// /app/leader/cells/[id]/manage/actions/removeMember.ts
"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function removeMemberAction(formData: FormData) {
  const supabase = createSupabaseAdmin();

  const membershipId = String(formData.get("membershipId") ?? "");
  const cellId = String(formData.get("cellId") ?? "");

  if (!membershipId || !cellId) {
    return { success: false, message: "Identificador inválido." };
  }

  const { error } = await supabase
    .from("cell_memberships")
    .delete()
    .eq("id", membershipId);

  if (error) {
    console.error("removeMemberAction error:", error);
    return { success: false, message: "Não foi possível remover o membro." };
  }

  revalidatePath(`/leader/cells/${cellId}/manage`);
  return { success: true, message: "Membro removido com sucesso." };
}