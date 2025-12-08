import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const imageId = id;

    const supabase = createSupabaseAdmin();

    const { data: img, error: fetchErr } = await supabase
      .from("gallery_images")
      .select("id, r2_key")
      .eq("id", imageId)
      .single();

    if (fetchErr || !img) {
      return NextResponse.json(
        { error: "Imagem não encontrada." },
        { status: 404 }
      );
    }

    const s3 = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: img.r2_key,
      })
    );

    const { error: delErr } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", imageId);

    if (delErr) {
      return NextResponse.json(
        { error: delErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao remover imagem." },
      { status: 500 }
    );
  }
}