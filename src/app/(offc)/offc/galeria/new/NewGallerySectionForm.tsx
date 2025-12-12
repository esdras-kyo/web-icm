"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewGallerySectionForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg("O título é obrigatório.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/gallery/sections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description: description || null,
          slug: slug || null,
          is_published: isPublished,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Erro ao criar seção.");
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();
      const id = data.id as string | undefined;

      if (!id) {
        setErrorMsg("Seção criada, mas não foi possível obter o ID.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/offc/galeria/${id}`);
    } catch (err) {
      console.error(err);
      setErrorMsg("Erro inesperado ao criar seção.");
      setIsSubmitting(false);
    }
  }

  function handleGenerateSlug() {
    if (!title.trim()) return;
    const base = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlug(base);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-100">
          Título *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-icm-primary focus:outline-none focus:ring-1 focus:ring-icm-primary"
          placeholder="Ex: Conferência, Batismos, Acampamento..."
        />
        <p className="text-xs text-slate-500">
          Esse nome será exibido como título da seção na galeria.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-100">
          Descrição
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-icm-primary focus:outline-none focus:ring-1 focus:ring-icm-primary"
          rows={3}
          placeholder="Breve descrição do que é essa seção/álbum."
        />
        <p className="text-xs text-slate-500">
          Opcional. Usado só para contexto na página de galeria.
        </p>
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-100">
          Slug (URL amigável)
        </label>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-icm-primary focus:outline-none focus:ring-1 focus:ring-icm-primary"
              placeholder="Ex: conferencia-2025"
            />
          </div>
          <button
            type="button"
            onClick={handleGenerateSlug}
            className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-medium text-slate-100 hover:border-icm-primary hover:text-icm-primary cursor-pointer"
          >
            Gerar
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Opcional. Se definido, pode ser usado em rotas públicas como{" "}
          <span className="font-mono text-[11px] text-slate-300">
            /galeria/{slug || "meu-album"}
          </span>
          .
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsPublished((v) => !v)}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition ${
            isPublished
              ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-200"
              : "border-slate-600 bg-slate-800/60 text-slate-200"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isPublished ? "bg-emerald-400" : "bg-slate-500"
            }`}
          />
          {isPublished ? "Publicado" : "Salvar como rascunho"}
        </button>
        <span className="text-xs text-slate-500">
          Se publicado, já poderá aparecer na galeria pública (quando você
          tiver fotos associadas).
        </span>
      </div>

      {errorMsg && (
        <div className="rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {errorMsg}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push("/offc/galeria")}
          className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:border-slate-400 cursor-pointer"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-icm-primary px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? "Criando..." : "Criar seção"}
        </button>
      </div>
    </form>
  );
}