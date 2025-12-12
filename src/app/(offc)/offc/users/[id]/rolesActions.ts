// app/leader/users/[id]/rolesActions.ts
'use server';

import { revalidateTag } from 'next/cache';
import { createSupabaseAdmin } from '@/utils/supabase/admin';
import { clerkClient } from '@clerk/nextjs/server';

type RoleRow = {
  role: string;
  scope_type?: 'ORG' | 'DEPARTMENT' | null;
  department_id?: string | null;
};

async function revokeUserSessions(clerkUserId: string) {
    try {
      // 1️⃣ Buscar todas as sessões do usuário
      const { data: sessions } = await (await clerkClient()).sessions.getSessionList({
        userId: clerkUserId,
      });
  
      // 2️⃣ Revogar todas as sessões ativas
      await Promise.all(
        sessions.map((s) => (async () => (await clerkClient()).sessions.revokeSession(s.id))())
      );

    } catch (err) {
      console.warn("Falha ao revogar sessões do Clerk:", err);
    }
  }

async function syncClerkRoles(supabase: ReturnType<typeof createSupabaseAdmin>, user_id: string) {
  // 1) pegar clerk_user_id
  const { data: userRow, error: userErr } = await supabase
    .from('users')
    .select('clerk_user_id')
    .eq('id', user_id)
    .single();

  if (userErr || !userRow?.clerk_user_id) {
    console.warn('syncClerkRoles: clerk_user_id não encontrado', userErr);
    return; // não quebra o fluxo da action
  }

  // 2) pegar roles atuais no banco
  const { data: rolesData, error: rolesErr } = await supabase
    .from('role_assignments')
    .select('role, scope_type, department_id')
    .eq('user_id', user_id);

  if (rolesErr) {
    console.warn('syncClerkRoles: erro ao ler roles', rolesErr);
    return;
  }

  // 3) normalizar para gravar no Clerk (publicMetadata)
  const roles = (rolesData ?? []).map((r: RoleRow) => ({
    role: r.role,
    scope_type: r.scope_type ?? 'ORG',
    department_id: r.department_id ?? null,
  }));

  const is_admin = roles.some(r => r.role === 'ADMIN');
  const is_leader = roles.some(r => r.role === 'LEADER');

  try {
    await (await clerkClient()).users.updateUserMetadata(userRow.clerk_user_id, {
      publicMetadata: {
        roles,            
        is_admin,
        is_leader,
      },
    });
  } catch (e) {
    console.warn('syncClerkRoles: falha ao atualizar Clerk', e);
    // segue o fluxo sem quebrar
  }
  await revokeUserSessions(userRow.clerk_user_id);
}

export async function addRoleAction(formData: FormData) {
  const supabase = createSupabaseAdmin();

  const user_id = String(formData.get('user_id') ?? '');
  const role = String(formData.get('role') ?? '');
  const scope_type = String(formData.get('scope_type') ?? 'ORG');
  const department_id = (formData.get('department_id') as string) || null;

  if (!user_id || !role) {
    return { success: false, message: 'Dados inválidos.' };
  }

  const { error } = await supabase.from('role_assignments').insert({
    user_id,
    role,
    scope_type,
    department_id,
  });

  if (error) {
    console.error('addRoleAction error:', error);
    return { success: false, message: 'Não foi possível adicionar a role.' };
  }

  // 🔁 invalida caches
  revalidateTag('users',"max");
  revalidateTag(`user:${user_id}`,"max");

  // 🔄 sincroniza Clerk (não bloqueante caso falhe)
  await syncClerkRoles(supabase, user_id);

  return { success: true };
}

export async function removeRoleAction(formData: FormData) {
  const supabase = createSupabaseAdmin();

  const role_assignment_id = String(formData.get('role_assignment_id') ?? '');
  const user_id = String(formData.get('user_id') ?? '');

  if (!role_assignment_id) {
    return { success: false, message: 'ID da role inválido.' };
  }

  const { error } = await supabase
    .from('role_assignments')
    .delete()
    .eq('id', role_assignment_id);

  if (error) {
    console.error('removeRoleAction error:', error);
    return { success: false, message: 'Não foi possível remover a role.' };
  }

  // 🔁 invalida caches
  revalidateTag('users', "max");
  revalidateTag(`user:${user_id}`, "max");

  // 🔄 sincroniza Clerk
  await syncClerkRoles(supabase, user_id);

  return { success: true };
}