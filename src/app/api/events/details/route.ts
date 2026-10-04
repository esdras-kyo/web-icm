import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { resolveEventAccess } from "@/utils/auth/resolveEventAccess";
import { canReadEvent } from "@/utils/auth/eventAccess";

export async function POST(req: Request) {
  const body = await req.json();
  const { event_id } = body;

  if (!event_id) {
    return NextResponse.json(
      { error: "Missing event_id" },
      { status: 400 }
    );
  }

  const access = await resolveEventAccess();
  if (!canReadEvent(access, event_id)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
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
      shirt_price,
      status,
      visibility,
      registration_starts_at,
      registration_ends_at,
      address,
      registration_fields,
      payment_note,
      pix_key,
      pix_description,
      image_key
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