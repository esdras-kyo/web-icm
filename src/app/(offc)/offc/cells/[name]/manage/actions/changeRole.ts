"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { clerkClient } from "@clerk/nextjs/server";
import { syncCellLeaderRole } from "./_syncCellLeaderRole";
// import { redirect } from "next/navigation";

const VALID_ROLES = new Set(["LEADER", "ASSISTANT", "MEMBER"] as const);

type CellRole = (typeof VALID_ROLES extends Set<infer U> ? U : never) & string;

type Feedback = { success: boolean; message: string; data?: { id: string } };

type MembershipWithClerk = {
  user_id: string;
  cell_id: string;
  role: CellRole;
  users: { clerk_user_id: string } | { clerk_user_id: string }[];
};

function extractClerkId(
  users: MembershipWithClerk["users"]
): string | undefined {
  return Array.isArray(users) ? users[0]?.clerk_user_id : users?.clerk_user_id;
}

export async function changeRoleAction(formData: FormData): Promise<Feedback> {
  const supabase = createSupabaseAdmin();

  const membershipId = String(formData.get("membershipId") ?? "");
  const newRole = String(formData.get("role") ?? "");
  const cellId = String(formData.get("cellId") ?? "");

  if (!membershipId || !cellId) {
    return { success: false, message: "Identificador inválido." };
  }
  if (!VALID_ROLES.has(newRole as CellRole)) {
    return { success: false, message: "Papel inválido." };
  }

  // 1) Atualiza a role na membership
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
      .select(
        "user_id, cell_id, role, users:users!inner(clerk_user_id)"
      )
      .eq("id", membershipId)
      .single<MembershipWithClerk>();

    if (mErr) {
      console.error("Erro carregando membership após update:", mErr);
    } else if (mUser) {
      const userId = mUser.user_id;

      await syncCellLeaderRole(userId);

      const { data: leaderRows, error: lErr } = await supabase
        .from("role_assignments")
        .select("id")
        .eq("user_id", userId)
        .eq("role", "LEADER")
        .limit(1);

      if (lErr) console.warn("check isLeader error:", lErr);
      const isLeader = !!leaderRows?.length;

      const clerkId = extractClerkId(mUser.users);
      if (clerkId) {
        await (await clerkClient()).users.updateUserMetadata(clerkId, {
          publicMetadata: {
            primary_cell_id: mUser.cell_id,
            cell_role: mUser.role, 
            is_leader: isLeader,
          },
        });
      } else {
        console.warn("changeRoleAction: clerk_user_id não encontrado no join de users");
      }

      revalidateTag("users", "max");
      revalidateTag(`user:${userId}`, "max");
    }
  } catch (err) {
    console.error("Erro ao atualizar Clerk publicMetadata:", err);
  }

  const cellName = String(formData.get("cellName") ?? "");
  console.log("cellname",cellName)

  if (cellName) {
    revalidatePath(`/offc/cells/${encodeURIComponent(cellName)}/manage`);
    // redirect(`/offc/cells/${encodeURIComponent(cellName)}/manage`);
  } else {
    revalidatePath("/offc/cells");
  }

  return { success: true, message: "Papel atualizado com sucesso."};
}