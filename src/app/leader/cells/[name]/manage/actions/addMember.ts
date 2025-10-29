// /app/leader/cells/[id]/manage/actions/addMember.ts
"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { clerkClient } from "@clerk/nextjs/server";

const VALID_ROLES = new Set(["LEADER", "ASSISTANT", "MEMBER"]);

type Feedback ={
  success: boolean,
  message: string,
  data?: {
    id: string
  }
}

export async function addMemberAction(formData: FormData): Promise<Feedback> {
  const supabase = createSupabaseAdmin();

  const cellId = String(formData.get("cellId") ?? "");
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "MEMBER");

  if (!cellId || !userId) {
    return { success: false, message: "Célula e usuário são obrigatórios." };
  }

  if (!VALID_ROLES.has(role)) {
    return { success: false, message: "Papel inválido." };
  }

  const { data, error } = await supabase
    .from("cell_memberships")
    .insert([{ cell_id: cellId, user_id: userId, role }])
    .select("id")
    .single();

  if (error) {
    // erro comum: unique (cell_id, user_id)
    const duplicate = (error as { code?: string })?.code === "23505";
    const msg = duplicate
      ? "Usuário já é membro desta célula."
      : "Não foi possível adicionar o usuário.";
    console.error("addMemberAction error:", error);
    return { success: false, message: msg };
  }

  try {
    // Buscar clerk_user_id do usuário adicionado
    const { data: userData, error: userErr } = await supabase
      .from("users")
      .select("clerk_user_id")
      .eq("id", userId)
      .single();
  
    if (userErr) {
      console.error("Erro ao buscar clerk_user_id:", userErr);
    } else if (userData?.clerk_user_id) {
      await (await clerkClient()).users.updateUser(userData.clerk_user_id, {
        publicMetadata: {
          primary_cell_id: cellId,
          cell_role: role,
        },
      });
    }
  } catch (err) {
    console.error("Erro ao atualizar Clerk publicMetadata:", err);
  }

  revalidatePath(`/leader/cells/${cellId}/manage`);
  return { success: true, message: "Membro adicionado com sucesso.", data };
}