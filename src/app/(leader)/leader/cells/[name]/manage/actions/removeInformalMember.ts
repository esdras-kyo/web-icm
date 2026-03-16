"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

type Feedback = { success: boolean; message: string };

export async function removeInformalMemberAction(
  formData: FormData
): Promise<Feedback> {
  const supabase = createSupabaseAdmin();

  const informalMemberId = String(
    formData.get("informalMemberId") ?? ""
  ).trim();
  const cellName = String(formData.get("cellName") ?? "").trim();

  if (!informalMemberId) {
    return { success: false, message: "ID do membro é obrigatório." };
  }

  const { error } = await supabase
    .from("cell_informal_members")
    .delete()
    .eq("id", informalMemberId);

  if (error) {
    console.error("removeInformalMemberAction error:", error);
    return { success: false, message: "Não foi possível remover o membro." };
  }

  revalidatePath(`/leader/cells/${encodeURIComponent(cellName)}/manage`);

  return { success: true, message: "Membro removido." };
}
