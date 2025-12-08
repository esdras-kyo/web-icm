import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function PUT(req: Request) {
  try {
    const { sectionId, orderedIds } = await req.json();

    if (!sectionId || !Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: "Parâmetros inválidos" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();
    
    for (let i = 0; i < orderedIds.length; i++) {
      const id = orderedIds[i];

      await supabase
        .from("gallery_images")
        .update({
          sort_order: i,
        })
        .eq("id", id)
        .eq("section_id", sectionId);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao reordenar imagens" },
      { status: 500 }
    );
  }
}