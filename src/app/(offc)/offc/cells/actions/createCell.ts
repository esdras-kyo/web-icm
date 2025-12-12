// /app/leader/cells/actions/createCell.ts
"use server";

import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createCellAction(formData: FormData) {
  const supabase = createSupabaseAdmin();

  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return { success: false, message: "Nome da célula é obrigatório." };
  }

  const { data, error } = await supabase
    .from("cells")
    .insert([{ name }])
    .select()
    .single();

  if (error) {
    const duplicate = error?.code === "23505";
    return {
      success: false,
      message: duplicate ? "Já existe uma célula com esse nome." : "Erro ao criar célula.",
    };
  }

  revalidatePath("/leader/cells");
  return { success: true, message: "Célula criada com sucesso!", data };
}