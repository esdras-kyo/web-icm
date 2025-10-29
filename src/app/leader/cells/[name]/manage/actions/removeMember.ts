// /app/leader/cells/[id]/manage/actions/removeMember.ts
"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { clerkClient } from "@clerk/nextjs/server";

export async function removeMemberAction(formData: FormData) {
  const supabase = createSupabaseAdmin();

  const membershipId = String(formData.get("membershipId") ?? "");
  const cellId = String(formData.get("cellId") ?? "");

  if (!membershipId || !cellId) {
    return { success: false, message: "Identificador inválido." };
  }

  const { error } = await supabase
    .from("cell_memberships")
    .delete()
    .eq("id", membershipId);

  if (error) {
    console.error("removeMemberAction error:", error);
    return { success: false, message: "Não foi possível remover o membro." };
  }

  try {
    // Buscar clerk_user_id do usuário removido
    const { data: userData, error: userErr } = await supabase
      .from("users")
      .select("clerk_user_id")
      .eq("id", formData.get("userId"))
      .single();

    if (userErr) {
      console.error("Erro ao buscar clerk_user_id:", userErr);
    } else if (userData?.clerk_user_id) {
      await (await clerkClient()).users.updateUser(userData.clerk_user_id, {
        publicMetadata: {
          primary_cell_id: null,
          cell_role: null,
        },
      });
    }
  } catch (err) {
    console.error("Erro ao atualizar Clerk publicMetadata:", err);
  }

  revalidatePath(`/leader/cells/${cellId}/manage`);
  return { success: true, message: "Membro removido com sucesso." };
}