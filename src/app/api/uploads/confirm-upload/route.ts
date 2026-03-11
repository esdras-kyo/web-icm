export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

async function deleteFromR2(key: string) {
  try {
    await s3.send(
      new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key })
    );
  } catch (e) {
    // Falha na deleção não bloqueia o fluxo — apenas loga
    console.warn("Falha ao deletar objeto antigo do R2:", key, e);
  }
}

export async function POST(req: Request) {
  try {
    const { eventId, visibility, fileKey, oldKey, title, type } = await req.json();

    if (!fileKey) {
      return NextResponse.json({ error: "Missing fileKey" }, { status: 400 });
    }

    if (type === "pdf" && !visibility) {
      return NextResponse.json({ error: "Missing visibility for PDF" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();

    if (type === "pdf") {
      const { error } = await supabase
        .from("files")
        .insert({ visibility, file_key: fileKey, title: title || null });

      if (error) {
        console.error("insert files error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      const { error } = await supabase
        .from("events")
        .update({ image_key: fileKey, image_uploaded: true })
        .eq("id", eventId);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      // Deleta imagem antiga do R2 apenas se diferente da nova
      if (oldKey && oldKey !== fileKey) {
        await deleteFromR2(oldKey);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Confirm error" }, { status: 500 });
  }
}
