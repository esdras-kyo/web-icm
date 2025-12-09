// app/api/gallery/section-images/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sectionId = searchParams.get("sectionId");
    const page = Number(searchParams.get("page") ?? "0");
    const pageSize = Number(searchParams.get("pageSize") ?? "24");

    if (!sectionId) {
      return NextResponse.json(
        { error: "sectionId é obrigatório." },
        { status: 400 }
      );
    }

    const from = page * pageSize;
    const to = from + pageSize - 1;

    const supabase = createSupabaseAdmin();

    const { data: images, error } = await supabase
      .from("gallery_images")
      .select("id, image_url, alt_text, sort_order, created_at")
      .eq("section_id", sectionId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .range(from, to);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ images: images ?? [] });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao carregar imagens." },
      { status: 500 }
    );
  }
}