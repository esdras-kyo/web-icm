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
  const newRole = String(formData.get("role") ?? "");
  const cellId = String(formData.get("cellId") ?? "");

  if (!membershipId || !cellId) {
    return { success: false, message: "Identificador inválido." };
  }
  if (!VALID_ROLES.has(newRole)) {
    return { success: false, message: "Papel inválido." };
  }

  const { data, error } = await supabase
    .from("cell_memberships")
    .update({ role: newRole })
    .eq("id", membershipId)
    .select("id")
    .single();

  if (error) {
    console.error("changeRoleAction error:", error);
    return { success: false, message: "Não foi possível alterar o papel." };
  }

  try {
    const { data: mUser, error: mErr } = await supabase
      .from("cell_memberships")
      .select("user_id, cell_id, role, users:users!inner(clerk_user_id)")
      .eq("id", membershipId)
      .single();

    if (mErr) {
      console.error("Erro carregando membership após update:", mErr);
    } else if (mUser) {
      const userId: string = mUser.user_id;

      await syncCellLeaderRole(userId);

      const { data: leaderRows, error: lErr } = await supabase
        .from("role_assignments")
        .select("id")
        .eq("user_id", userId)
        .eq("role", "LEADER")
        .limit(1);

      if (lErr) console.warn("check isLeader error:", lErr);
      const isLeader = !!leaderRows?.length;

      const clerkId: string | undefined = Array.isArray(mUser?.users)
        ? mUser.users[0]?.clerk_user_id
        : undefined;
      if (clerkId) {
        const client = await clerkClient();
        await client.users.updateUserMetadata(clerkId, {
          publicMetadata: {
            primary_cell_id: mUser.cell_id,
            cell_role: mUser.role, 
            is_leader: isLeader,
          },
        });
      } else {
        console.warn("changeRoleAction: clerk_user_id não encontrado no join de users");
      }

      revalidateTag("users");
      revalidateTag(`user:${userId}`);
    }
  } catch (err) {
    console.error("Erro ao atualizar Clerk publicMetadata:", err);
  }

  revalidatePath(`/leader/cells/${cellId}/manage`);
  return { success: true, message: "Papel atualizado com sucesso.", data };
}