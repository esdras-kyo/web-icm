// /app/leader/cells/[id]/manage/actions/changeRole.ts
"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { clerkClient } from "@clerk/nextjs/server";

const VALID_ROLES = new Set(["LEADER", "ASSISTANT", "MEMBER"]);

export async function changeRoleAction(formData: FormData) {
  const supabase = createSupabaseAdmin();

  const membershipId = String(formData.get("membershipId") ?? "");
  const role = String(formData.get("role") ?? "");
  const cellId = String(formData.get("cellId") ?? "");

  if (!membershipId || !cellId) {
    return { success: false, message: "Identificador inválido." };
  }
  if (!VALID_ROLES.has(role)) {
    return { success: false, message: "Papel inválido." };
  }

  const { data, error } = await supabase
    .from("cell_memberships")
    .update({ role })
    .eq("id", membershipId)
    .select("id")
    .single();

  if (error) {
    console.error("changeRoleAction error:", error);
    return { success: false, message: "Não foi possível alterar o papel." };
  }

  try {
    const { data: membershipUser } = await supabase
      .from("cell_memberships")
      .select("user_id, cell_id, role, users!inner(clerk_user_id)")
      .eq("id", membershipId)
      .single();

    if (membershipUser && Array.isArray(membershipUser.users) && membershipUser.users[0]?.clerk_user_id) {
      await (await clerkClient()).users.updateUser(membershipUser.users[0].clerk_user_id, {
        publicMetadata: {
          primary_cell_id: membershipUser.cell_id,
          cell_role: membershipUser.role,
        },
      });
    }
  } catch (err) {
    console.error("Erro ao atualizar Clerk publicMetadata:", err);
  }

  revalidatePath(`/leader/cells/${cellId}/manage`);
  return { success: true, message: "Papel atualizado com sucesso.", data };
}