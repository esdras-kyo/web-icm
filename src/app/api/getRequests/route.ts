import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function GET() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("holyrequest")
    .select(`id, text, created_at`)
    .order("created_at", { ascending: true });

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "erro " }, { status: 404 });
  }
  return NextResponse.json(data);
}
