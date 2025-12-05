import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function GET() {
  const supabase = await createSupabaseAdmin();

  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("events")
    .select("id, title, capacity, starts_at, ends_at")
    .gte("starts_at", nowIso)
    .order("starts_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching next event:", error);
    return NextResponse.json({ error: "Erro ao buscar próximo evento" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ event: null });
  }

  return NextResponse.json({ event: data });
}