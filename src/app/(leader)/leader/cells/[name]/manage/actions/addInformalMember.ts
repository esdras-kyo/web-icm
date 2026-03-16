"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

type Feedback = { success: boolean; message: string };

export async function addInformalMemberAction(
  formData: FormData
): Promise<Feedback> {
  const supabase = createSupabaseAdmin();

  const cellId = String(formData.get("cellId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const cellName = String(formData.get("cellName") ?? "").trim();

  if (!cellId || !name) {
    return { success: false, message: "Célula e nome são obrigatórios." };
  }

  const { error } = await supabase
    .from("cell_informal_members")
    .insert([{ cell_id: cellId, name }]);

  if (error) {
    console.error("addInformalMemberAction error:", error);
    return { success: false, message: "Não foi possível adicionar o membro." };
  }

  revalidatePath(`/leader/cells/${encodeURIComponent(cellName)}/manage`);

  return { success: true, message: "Membro adicionado." };
}
