"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { clerkClient } from "@clerk/nextjs/server";
import { syncCellLeaderRole } from "./_syncCellLeaderRole";

const VALID_ROLES = new Set(["LEADER", "ASSISTANT", "MEMBER"]);

type Feedback = { success: boolean; message: string; data?: { id: string } };

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
    const duplicate = (error as { code?: string })?.code === "23505";
    const msg = duplicate
      ? "Usuário já é membro desta célula."
      : "Não foi possível adicionar o usuário.";
    console.error("addMemberAction error:", error);
    return { success: false, message: msg };
  }

  await syncCellLeaderRole(userId);

  try {
    const { data: userData } = await supabase
      .from("users")
      .select("clerk_user_id")
      .eq("id", userId)
      .single();

    if (userData?.clerk_user_id) {
      const { data: rolesData } = await supabase
        .from("role_assignments")
        .select("id")
        .eq("user_id", userId)
        .eq("role", "LEADER");

      const isLeader = !!rolesData?.length;

      await (
        await clerkClient()
      ).users.updateUserMetadata(userData.clerk_user_id, {
        publicMetadata: {
          primary_cell_id: cellId,
          cell_role: role,
          is_leader: isLeader,
        },
      });
    }
  } catch (err) {
    console.error("Erro ao atualizar Clerk publicMetadata:", err);
  }

  revalidatePath(`/leader/cells/${cellId}/manage`);
  revalidateTag("users");
  revalidateTag(`user:${userId}`);

  return { success: true, message: "Membro adicionado com sucesso.", data };
}
