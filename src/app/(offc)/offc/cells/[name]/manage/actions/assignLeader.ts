"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { clerkClient } from "@clerk/nextjs/server";
import { syncCellLeaderRole } from "./_syncCellLeaderRole";

type Feedback = { success: boolean; message: string };

export async function assignLeaderAction(formData: FormData): Promise<Feedback> {
  const supabase = createSupabaseAdmin();

  const cellId = String(formData.get("cellId") ?? "");
  const cellName = String(formData.get("cellName") ?? "");
  const userId = String(formData.get("userId") ?? "");

  if (!cellId || !userId) {
    return { success: false, message: "Dados inválidos." };
  }

  const { error } = await supabase
    .from("cell_memberships")
    .upsert(
      { cell_id: cellId, user_id: userId, role: "LEADER" },
      { onConflict: "cell_id,user_id" }
    );

  if (error) {
    console.error("assignLeaderAction error:", error);
    return { success: false, message: "Não foi possível definir o líder." };
  }

  await syncCellLeaderRole(userId);

  try {
    const { data: userData } = await supabase
      .from("users")
      .select("clerk_user_id")
      .eq("id", userId)
      .single();

    if (userData?.clerk_user_id) {
      await (await clerkClient()).users.updateUserMetadata(userData.clerk_user_id, {
        publicMetadata: {
          primary_cell_id: cellId,
          cell_role: "LEADER",
          is_leader: true,
        },
      });
    }
  } catch (err) {
    console.error("Erro ao atualizar Clerk:", err);
  }

  revalidatePath(`/offc/cells/${encodeURIComponent(cellName)}/manage`);
  return { success: true, message: "Líder definido com sucesso." };
}
