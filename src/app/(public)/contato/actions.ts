"use server";

import { createSupabaseAdmin } from "@/utils/supabase/admin";

type State = {
  ok: boolean;
  error?: string;
};

export async function createHolyRequest(
  prevState: State,
  formData: FormData
): Promise<State> {
  const text = String(formData.get("text") || "").trim();

  if (!text) {
    return { ok: false, error: "Escreva seu pedido antes de enviar." };
  }

  const supabase = createSupabaseAdmin();

  const { error } = await supabase
    .from("holyrequest")
    .insert({ text }); // demais campos (created_at, id...) ficam default

  if (error) {
    console.error(error);
    return { ok: false, error: "Erro ao enviar seu pedido. Tente novamente." };
  }

  return { ok: true };
}