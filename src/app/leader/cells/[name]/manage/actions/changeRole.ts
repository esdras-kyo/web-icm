// /app/leader/cells/[id]/manage/actions/changeRole.ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { clerkClient } from "@clerk/nextjs/server";
import { syncCellLeaderRole } from "./_syncCellLeaderRole";

const VALID_ROLES = new Set(["LEADER", "ASSISTANT", "MEMBER"]);

type Feedback = { success: boolean; message: string; data?: { id: string } };

export async function changeRoleAction(formData: FormData): Promise<Feedback> {
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

    if (membershipUser) {
      const userId: string = membershipUser.user_id;
      await syncCellLeaderRole(userId);
      if (
        Array.isArray(membershipUser.users) &&
        membershipUser.users[0]?.clerk_user_id
      ) {
        const { data: leaderRows } = await supabase
          .from("role_assignments")
          .select("id")
          .eq("user_id", userId)
          .eq("role", "LEADER");

        const isLeader = !!leaderRows?.length;

        await (
          await clerkClient()
        ).users.updateUserMetadata(membershipUser.users[0].clerk_user_id, {
          publicMetadata: {
            primary_cell_id: membershipUser.cell_id,
            cell_role: membershipUser.role,
            is_leader: isLeader,
          },
        });
      }

      // ♻️ revalida lista/usuário
      revalidateTag("users");
      revalidateTag(`user:${userId}`);
    }
  } catch (err) {
    console.error("Erro ao atualizar Clerk publicMetadata:", err);
  }

  revalidatePath(`/leader/cells/${cellId}/manage`);
  return { success: true, message: "Papel atualizado com sucesso.", data };
}
