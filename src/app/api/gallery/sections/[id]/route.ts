import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sectionId = id;
    const { title, description, slug, is_published } = await req.json();

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Título é obrigatório." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    const { error } = await supabase
      .from("gallery_sections")
      .update({
        title: title.trim(),
        description: description?.trim() || null,
        slug: slug?.trim() || null,
        is_published:
          typeof is_published === "boolean" ? is_published : true,
      })
      .eq("id", sectionId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro inesperado ao atualizar seção." },
      { status: 500 }
    );
  }
}