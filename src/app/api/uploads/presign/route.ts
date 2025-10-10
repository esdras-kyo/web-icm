export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

// === CLIENTE R2 ===================================================
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT, // ex.: https://<ACCOUNT>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// === GERA URL DE UPLOAD PRESIGN ===================================
export async function POST(req: Request) {
  try {
    const { eventId, filename, contentType, title } = await req.json();
    if ( !filename || !contentType) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // inclui PDF entre os formatos aceitos
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/jpg",
      "application/pdf",
    ];
    if (!allowed.includes(contentType)) {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
    }

    // chave única — pode usar subpastas pra separar imagens e pdfs
    const folder = contentType === "application/pdf" ? "pdfs" : "";
    const key = `${folder}/${randomUUID()}-${filename}`;

    const cmd = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
      ContentType: contentType,
      Metadata: {
        uploaded_via: "presigned",
        title: title || filename, // adiciona título no metadata
      },
    });

    const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 90 });

    return NextResponse.json({ key, uploadUrl });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Presign error" }, { status: 500 });
  }
}