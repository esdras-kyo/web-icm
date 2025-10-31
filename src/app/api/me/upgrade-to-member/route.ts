// app/api/me/upgrade-to-member/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: false }, { status: 401 });

  const { data: userRow } = await supabase
    .from("users")
    .select("id, public_code")
    .eq("clerk_user_id", userId)
    .single();

  // 1) Tenta promover VISITANT -> MEMBER (conta quantas linhas foram atualizadas)
  const { error: updErr, count: updatedCount } = await supabase
  .from("role_assignments")
  .update({ role: "MEMBER" })
  .eq("user_id", userRow?.id)
  .eq("scope_type", "ORG")
  .is("department_id", null)
  .eq("role", "VISITANT")
  .select()
  .throwOnError()
  .then((res) => ({
    ...res,
    count: res.count,
  }));
  if (updErr) throw updErr;

  // 2) Se nenhuma VISITANT foi atualizada, verifique se já existe role ORG
  if (!updatedCount || updatedCount === 0) {
    const { error: existErr, count: orgCount } = await supabase
      .from("role_assignments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userRow?.id)
      .eq("scope_type", "ORG")
      .is("department_id", null);

    if (existErr) throw existErr;

    // 3) Só insere MEMBER caso NÃO exista linha ORG
    if (!orgCount || orgCount === 0) {
      const { error: insErr } = await supabase
        .from("role_assignments")
        .insert({
          user_id: userRow?.id,
          role: "MEMBER",
          scope_type: "ORG",
          department_id: null,
        });
      if (insErr && insErr.code !== "23505") throw insErr;
    }
  }

  // 4) Recarrega roles para snapshot no Clerk
  const { data: rolesFromDb } = await supabase
    .from("role_assignments")
    .select("role, scope_type, department_id")
    .eq("user_id", userRow?.id);

  await (await clerkClient()).users.updateUserMetadata(userId, {
    publicMetadata: {
      app_user_id: userRow?.id,
      public_code: userRow?.public_code ?? null,
      roles: (rolesFromDb ?? []).map((r) => ({
        role: r.role,
        scope_type: r.scope_type,
        department_id: r.department_id,
      })),
      app_meta_version: 1,
    },
  });

  return NextResponse.json({ ok: true });
}