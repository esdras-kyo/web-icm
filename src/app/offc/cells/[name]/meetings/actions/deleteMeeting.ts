// /app/leader/cells/[name]/meetings/actions/deleteMeeting.ts
"use server";

import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function deleteMeetingAction(formData: FormData) {
  const supabase = createSupabaseAdmin();

  const meetingId = String(formData.get("meetingId") ?? "");
  const cellName = String(formData.get("cellName") ?? "");

  if (!meetingId) return { success: false, message: "Relatório inválido." };

  const { error } = await supabase
    .from("cell_meetings")
    .delete()
    .eq("id", meetingId);

  if (error) {
    console.error("deleteMeetingAction error:", error);
    return { success: false, message: "Não foi possível excluir o relatório." };
  }

  revalidatePath(`/leader/cells/${encodeURIComponent(cellName)}/meetings`);
  return { success: true, message: "Relatório excluído." };
}