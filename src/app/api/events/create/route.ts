// src/app/api/events/create/route.ts
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import type { EventCreatePayload } from "../../../components/EventCreator" // ajusta o path

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as EventCreatePayload;

    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from("events")
      .insert({
        title: payload.title,
        description: payload.description,
        visibility: payload.visibility,
        status: payload.status,
        price: payload.price,
        capacity: payload.capacity,
        starts_at: payload.starts_at,
        ends_at: payload.ends_at,
        registration_starts_at: payload.registrations_starts_at,
        registration_ends_at: payload.registrations_ends_at,
        address: payload.address,
        registration_fields: payload.registration_fields,
        image_key: payload.image_key,
        // owner_department_id: ...  // aqui você coloca pelo contexto do usuário
      })
      .select("id")
      .single();

    if (error) {
      console.error("insert events error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Create event error" }, { status: 500 });
  }
}