import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function POST(req: Request) {
  try {
    const { sectionId, fileKey } = await req.json();

    if (!sectionId || !fileKey) {
      return NextResponse.json(
        { error: "sectionId e fileKey são obrigatórios." },
        { status: 400 }
      );
    }

    const baseUrl = "https://worker-1.esdrascamel.workers.dev";
    if (!baseUrl) {
      return NextResponse.json(
        { error: "R2_PUBLIC_BASE_URL não configurada." },
        { status: 500 }
      );
    }

    const imageUrl = `${baseUrl}/${fileKey}`;

    const supabase = createSupabaseAdmin();

    let sortOrder: number | null = null;
    const { data: maxRows, error: maxErr } = await supabase
      .from("gallery_images")
      .select("sort_order")
      .eq("section_id", sectionId)
      .order("sort_order", { ascending: false })
      .limit(1);

    if (!maxErr && maxRows && maxRows.length > 0) {
      const currentMax = maxRows[0].sort_order ?? 0;
      sortOrder = currentMax + 1;
    } else {
      sortOrder = 0;
    }

    const { data, error } = await supabase
      .from("gallery_images")
      .insert({
        section_id: sectionId,
        image_url: imageUrl,
        r2_key: fileKey,
        alt_text: null,
        sort_order: sortOrder,
      })
      .select("id, image_url, alt_text, sort_order, created_at")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Erro ao salvar imagem." },
        { status: 500 }
      );
    }

    return NextResponse.json({ image: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro inesperado ao confirmar upload." },
      { status: 500 }
    );
  }
}