// src/app/api/events/create/route.ts
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { slugify } from "@/lib/slugify";
import type { EventCreatePayload } from "../../../components/EventCreator";

async function generateUniqueSlug(
  supabase: ReturnType<typeof createSupabaseAdmin>,
  title: string
): Promise<string> {
  const base = slugify(title);

  // Tenta slug base, depois base-2, base-3, ... base-5, fallback com timestamp
  const candidates = [
    base,
    `${base}-2`,
    `${base}-3`,
    `${base}-4`,
    `${base}-5`,
    `${base}-${Date.now()}`,
  ];

  for (const candidate of candidates) {
    const { data } = await supabase
      .from("events")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (!data) return candidate;
  }

  // fallback extremo (nunca deve chegar aqui)
  return `${base}-${Date.now()}`;
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as EventCreatePayload;

    const supabase = createSupabaseAdmin();
    const slug = await generateUniqueSlug(supabase, payload.title);

    console.log("CREATE EVENT STATUS:", payload.status, "SLUG:", slug);

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
        registration_starts_at: payload.registration_starts_at,
        registration_ends_at: payload.registration_ends_at,
        address: payload.address,
        registration_fields: payload.registration_fields,
        image_key: payload.image_key,
        payment_note: payload.payment_note,
        slug,
      })
      .select("id, slug")
      .single();

    if (error) {
      console.error("insert events error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id, slug: data.slug });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Create event error" }, { status: 500 });
  }
}
