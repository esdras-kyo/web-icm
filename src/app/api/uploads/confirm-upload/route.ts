export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function POST(req: Request) {
  try {
    const {eventId, visibility, fileKey, title, type } = await req.json();
    if (!visibility || !fileKey) {
      return NextResponse.json({ error: "Missing visibility/fileKey" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();

    // se for PDF, salva na tabela "event_files"
    if (type === "pdf") {
      const { error } = await supabase
        .from("files")
        .insert({
          visibility: visibility,
          file_key: fileKey,
          title: title || null,
        });

        if (error) {
            console.error("insert files error:", error); // <- loga completo no server
            return NextResponse.json({ error: error.message }, { status: 500 });
          }
    } else {
      const { error } = await supabase
        .from("events")
        .update({ image_key: fileKey, image_uploaded: true })
        .eq("id", eventId);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Confirm error" }, { status: 500 });
  }
}