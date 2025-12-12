"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Section = {
  id: string;
  title: string;
  description: string | null;
  slug: string | null;
  is_published: boolean;
};

export function EditGallerySectionForm({ section }: { section: Section }) {
  const router = useRouter();

  const [title, setTitle] = useState(section.title);
  const [description, setDescription] = useState(section.description ?? "");
  const [slug, setSlug] = useState(section.slug ?? "");
  const [isPublished, setIsPublished] = useState(section.is_published);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!title.trim()) {
      setErrorMsg("O título é obrigatório.");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch(`/api/gallery/sections/${section.id}`, {
        method: "PUT",
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

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMsg(data.error || "Erro ao salvar alterações.");
        setIsSaving(false);
        return;
      }

      setSuccessMsg("Alterações salvas com sucesso!");
      setIsSaving(false);

      router.refresh();
    } catch (err) {
      console.error(err);
      setErrorMsg("Erro inesperado ao salvar alterações.");
      setIsSaving(false);
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
        />
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
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-100">
          Slug (URL amigável)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-icm-primary focus:outline-none focus:ring-1 focus:ring-icm-primary"
          />
          <button
            type="button"
            onClick={handleGenerateSlug}
            className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-medium text-slate-100 hover:border-icm-primary hover:text-icm-primary cursor-pointer"
          >
            Gerar
          </button>
        </div>
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
          {isPublished ? "Publicado" : "Rascunho"}
        </button>
      </div>

      {errorMsg && (
        <div className="rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
          {successMsg}
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-icm-primary px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:opacity-60"
        >
          {isSaving ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </form>
  );
}