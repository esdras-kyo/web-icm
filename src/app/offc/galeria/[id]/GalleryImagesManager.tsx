"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type GalleryImage = {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number | null;
  created_at: string;
};

type Props = {
  sectionId: string;
  initialImages: GalleryImage[];
};

export function GalleryImagesManager({ sectionId, initialImages }: Props) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/jpg",
  ];

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    setErrorMsg(null);

    const valid: File[] = [];
    const previews: string[] = [];

    for (const f of selected) {
      if (!allowedTypes.includes(f.type)) {
        setErrorMsg(
          "Algum arquivo possui formato inválido (use JPG, PNG, WEBP ou AVIF)."
        );
        continue;
      }
      valid.push(f);
      previews.push(URL.createObjectURL(f));
    }

    setFiles(valid);
    setPreviewUrls(previews);
  }

  function clearSelection() {
    setFiles([]);
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleUpload() {
    if (!files.length) return;
    setErrorMsg(null);
    setIsUploading(true);

    try {
      const newImages: GalleryImage[] = [];

      for (const file of files) {
        const presignRes = await fetch("/api/uploads/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
          }),
        });

        if (!presignRes.ok) {
          const body = await presignRes.json().catch(() => ({}));
          throw new Error(body?.error ?? "Falha ao gerar URL de upload");
        }

        const { uploadUrl, key } = (await presignRes.json()) as {
          uploadUrl: string;
          key: string;
        };

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", uploadUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.onload = () =>
            xhr.status >= 200 && xhr.status < 300
              ? resolve()
              : reject(new Error("Upload failed"));
          xhr.onerror = () => reject(new Error("Upload error"));
          xhr.send(file);
        });

        const confirmRes = await fetch("/api/gallery/confirm-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sectionId,
            fileKey: key,
          }),
        });

        const confirmBody = await confirmRes.json().catch(() => ({}));

        if (!confirmRes.ok) {
          throw new Error(
            confirmBody?.error ?? "Falha ao salvar imagem no banco"
          );
        }

        const created = confirmBody.image as GalleryImage | undefined;
        if (created) {
          newImages.push(created);
        }
      }

      if (newImages.length) {
        setImages((prev) => [...prev, ...newImages]);
      }
      clearSelection();
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.message ?? "Erro ao enviar imagens.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja remover esta imagem?")) return;

    try {
      const res = await fetch(`/api/gallery/images/${id}`, {
        method: "DELETE",
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(body?.error ?? "Falha ao remover imagem");
      }

      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.message ?? "Erro ao remover imagem.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-xl border border-slate-700 bg-slate-900/60 p-4">
        <p className="text-sm text-slate-200">
          Adicione novas fotos para esta seção.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full cursor-pointer rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-slate-700 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-50 hover:bg-slate-900"
        />

        {previewUrls.length > 0 && (
          <div>
            <p className="mb-2 text-xs text-slate-400">
              {previewUrls.length} arquivo(s) pronto(s) para envio:
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {previewUrls.map((url, idx) => (
                <div
                  key={url}
                  className="relative aspect-4/3 overflow-hidden rounded-lg border border-slate-700"
                >
                  <Image
                    src={url}
                    alt={`Pré-visualização ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-200 hover:border-slate-400 cursor-pointer"
              >
                Limpar seleção
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading || !files.length}
                className="rounded-lg bg-icm-primary px-4 py-1.5 text-xs font-medium text-white cursor-pointer disabled:opacity-60"
              >
                {isUploading
                  ? "Enviando..."
                  : `Enviar ${files.length} foto${
                      files.length > 1 ? "s" : ""
                    }`}
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-slate-500">
          Formatos aceitos: JPG, PNG, WEBP ou AVIF.
        </p>

        {errorMsg && (
          <div className="mt-2 rounded-md border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {errorMsg}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-sm text-slate-200">
          Imagens atuais ({images.length}):
        </p>

        {images.length === 0 ? (
          <p className="text-xs text-slate-500">
            Nenhuma imagem cadastrada ainda.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-4/3 overflow-hidden rounded-lg border border-slate-700 bg-slate-900/80"
              >
                <Image
                  src={img.image_url}
                  alt={img.alt_text ?? "Imagem da galeria"}
                  fill
                  className="object-cover"
                />

                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-medium text-red-200 opacity-0 shadow-sm transition group-hover:opacity-100 cursor-pointer"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}