"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type GallerySection = {
  id: string;
  title: string;
  description: string | null;
  slug: string | null;
  is_published: boolean;
  created_at: string;
};

export function GallerySectionsList({
  sections,
}: {
  sections: GallerySection[];
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return sections;

    return sections.filter((s) => {
      const haystack =
        `${s.title} ${s.description ?? ""} ${s.slug ?? ""}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [sections, search]);

  return (
    <div className="space-y-4">
      {/* Filtro */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Buscar por título, descrição ou slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-icm-primary focus:outline-none focus:ring-1 focus:ring-icm-primary"
        />
        <span className="text-xs text-slate-500">
          {filtered.length} seção{filtered.length === 1 ? "" : "es"}
        </span>
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900/80">
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3 hidden md:table-cell">Descrição</th>
              <th className="px-4 py-3 hidden sm:table-cell">Slug</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-slate-400"
                >
                  Nenhuma seção encontrada.
                </td>
              </tr>
            )}

            {filtered.map((section) => (
              <tr
                key={section.id}
                className="border-t border-slate-800/80 hover:bg-slate-800/40"
              >
                {/* Título + data (compacto pra mobile) */}
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-slate-100">
                      {section.title}
                    </span>

                    <span className="text-[11px] text-slate-500 sm:hidden">
                      {section.slug ? `/galeria/${section.slug}` : "Sem slug"}
                    </span>

                    <span className="text-[11px] text-slate-500">
                      Criado em{" "}
                      {new Date(section.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </td>

                {/* Descrição (desktop) */}
                <td className="px-4 py-3 align-top hidden md:table-cell">
                  <span className="line-clamp-2 text-xs text-slate-300">
                    {section.description || "—"}
                  </span>
                </td>

                {/* Slug (desktop) */}
                <td className="px-4 py-3 align-top hidden sm:table-cell">
                  <span className="text-xs text-slate-300">
                    {section.slug ? `/galeria/${section.slug}` : "—"}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3 align-top text-center">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      section.is_published
                        ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/40"
                        : "bg-slate-600/10 text-slate-300 ring-1 ring-slate-500/40"
                    }`}
                  >
                    <span
                      className={`mr-1 h-1.5 w-1.5 rounded-full ${
                        section.is_published
                          ? "bg-emerald-400"
                          : "bg-slate-400"
                      }`}
                    />
                    {section.is_published ? "Publicado" : "Rascunho"}
                  </span>
                </td>

                {/* Ações */}
                <td className="px-4 py-3 align-top text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/offc/galeria/${section.id}`}
                      className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-50 hover:bg-slate-600 cursor-pointer"
                    >
                      Gerenciar
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}