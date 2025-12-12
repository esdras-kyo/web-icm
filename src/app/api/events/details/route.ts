import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function POST(req: Request) {
  const body = await req.json();
  const { event_id } = body;

  if (!event_id) {
    return NextResponse.json(
      { error: "Missing event_id" },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseAdmin();

  const { data, error } = await supabase
    .from("events")
    .select(`
      id,
      title,
      description,
      starts_at,
      ends_at,
      capacity,
      price,
      status,
      visibility,
      registration_starts_at,
      registration_ends_at,
      address,
      registration_fields,
      payment_note
    `)
    .eq("id", event_id)
    .single();

  if (error || !data) {
    console.error("Error fetching event details:", error);
    return NextResponse.json(
      { error: "Event not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}