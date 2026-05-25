"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { clerkClient } from "@clerk/nextjs/server";
import { syncCellAssistantRole } from "./_syncCellAssistantRole";

type Feedback = { success: boolean; message: string };

export async function removeAssistantAction(formData: FormData): Promise<Feedback> {
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
    console.error("removeAssistantAction error:", error);
    return { success: false, message: "Não foi possível remover o co-líder." };
  }

  if (!deletedRow) {
    revalidatePath(`/offc/cells/${encodeURIComponent(cellName)}/manage`);
    return { success: true, message: "Co-líder já havia sido removido." };
  }

  const removedUserId = deletedRow.user_id as string;

  await syncCellAssistantRole(removedUserId);

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
        },
      });
    }
  } catch (err) {
    console.error("Erro ao atualizar Clerk:", err);
  }

  revalidatePath(`/offc/cells/${encodeURIComponent(cellName)}/manage`);
  return { success: true, message: "Co-líder removido." };
}
