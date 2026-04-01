"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { clerkClient } from "@clerk/nextjs/server";
import { syncCellLeaderRole } from "./_syncCellLeaderRole";

type Feedback = { success: boolean; message: string };

export async function removeLeaderAction(formData: FormData): Promise<Feedback> {
  const supabase = createSupabaseAdmin();

  const membershipId = String(formData.get("membershipId") ?? "");
  const cellName = String(formData.get("cellName") ?? "");

  if (!membershipId) {
    return { success: false, message: "Identificador inválido." };
  }

  const { data: deletedRow, error } = await supabase
    .from("cell_memberships")
    .delete()
    .eq("id", membershipId)
    .select("user_id")
    .single();

  if (error) {
    console.error("removeLeaderAction error:", error);
    return { success: false, message: "Não foi possível remover o líder." };
  }

  if (!deletedRow) {
    revalidatePath(`/offc/cells/${encodeURIComponent(cellName)}/manage`);
    return { success: true, message: "Líder já havia sido removido." };
  }

  const removedUserId = deletedRow.user_id as string;

  await syncCellLeaderRole(removedUserId);

  try {
    const { data: userData } = await supabase
      .from("users")
      .select("clerk_user_id")
      .eq("id", removedUserId)
      .single();

    if (userData?.clerk_user_id) {
      await (await clerkClient()).users.updateUserMetadata(userData.clerk_user_id, {
        publicMetadata: {
          primary_cell_id: null,
          cell_role: null,
          is_leader: false,
        },
      });
    }
  } catch (err) {
    console.error("Erro ao atualizar Clerk:", err);
  }

  revalidatePath(`/offc/cells/${encodeURIComponent(cellName)}/manage`);
  return { success: true, message: "Líder removido." };
}
