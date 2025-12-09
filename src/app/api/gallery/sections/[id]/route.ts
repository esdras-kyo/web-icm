import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sectionId = id;

    const supabase = createSupabaseAdmin();

    // 1) Buscar imagens da seção para deletar do R2
    const { data: images, error: imagesError } = await supabase
      .from("gallery_images")
      .select("id, r2_key")
      .eq("section_id", sectionId);

    if (imagesError) {
      console.error("Erro ao buscar imagens da seção:", imagesError);
      return NextResponse.json(
        { error: "Erro ao buscar imagens da seção." },
        { status: 500 }
      );
    }

    // 2) Deletar do R2 (best-effort – se falhar uma, loga e segue)
    const s3 = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });

    if (images && images.length > 0) {
      for (const img of images) {
        if (!img.r2_key) continue;

        try {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET!,
              Key: img.r2_key,
            })
          );
        } catch (err) {
          console.error(
            `Erro ao deletar do R2 (imagem ${img.id}, key ${img.r2_key}):`,
            err
          );
          // não dou return aqui pra não travar toda a exclusão
        }
      }
    }

    // 3) Deletar linhas de gallery_images
    const { error: delImagesError } = await supabase
      .from("gallery_images")
      .delete()
      .eq("section_id", sectionId);

    if (delImagesError) {
      console.error("Erro ao deletar imagens da seção:", delImagesError);
      return NextResponse.json(
        { error: "Erro ao deletar imagens da seção." },
        { status: 500 }
      );
    }

    // 4) Deletar a própria seção
    const { error: delSectionError } = await supabase
      .from("gallery_sections")
      .delete()
      .eq("id", sectionId);

    if (delSectionError) {
      console.error("Erro ao deletar seção:", delSectionError);
      return NextResponse.json(
        { error: "Erro ao deletar seção." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro inesperado ao deletar seção:", err);
    return NextResponse.json(
      { error: "Erro inesperado ao deletar seção." },
      { status: 500 }
    );
  }
}