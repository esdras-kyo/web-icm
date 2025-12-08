import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      slug,
      is_published,
    }: {
      title?: string;
      description?: string | null;
      slug?: string | null;
      is_published?: boolean;
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Título é obrigatório." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from("gallery_sections")
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        slug: slug?.trim() || null,
        is_published:
          typeof is_published === "boolean" ? is_published : true,
      })
      .select("id")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Erro ao criar seção." },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro inesperado ao criar seção." },
      { status: 500 }
    );
  }
}