// app/(admin)/events/new/actions.ts
"use server";

import { createSupabaseAdmin} from "../../../utils/supabase/admin"; // ajuste o caminho

export async function createEvent(data: {
  owner_department_id: string;
  visibility: "ORG" | "DEPARTMENT";
  status: "ATIVO" | "INATIVO";
  title: string;
  description: string;
  price: number;
  capacity: number;
  starts_at: string;
  ends_at: string;
}) {
  const supabase = createSupabaseAdmin();


  const { data: inserted, error } = await supabase
    .from("events")
    .insert({ ...data })
    .select("id")
    .single();
    
  if (error) {
    throw new Error(error.message);
  }
  return inserted.id as string
}