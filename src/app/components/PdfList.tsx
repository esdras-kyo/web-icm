"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader, Loader2, LoaderIcon, RotateCcwIcon } from "lucide-react";

type Visibility = "ORG" | "DEPARTMENT";
type FileRow = { id: string; title: string | null; file_key: string; visibility: Visibility; created_at: string };

export function PdfCloudList({
  workerBase = "https://worker-1.esdrascamel.workers.dev",
  defaultVisibility = "ORG",
  api = "/api/files/list",
}: {
  workerBase?: string;
  defaultVisibility?: Visibility;
  api?: string;
}) {
  const [visibility, setVisibility] = React.useState<Visibility>(defaultVisibility);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<FileRow[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const url = `${api}?visibility=${encodeURIComponent(visibility)}&limit=200`;
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Falha ao listar PDFs");
      setRows(json.files || []);
    } catch (e: any) {
      setError(e.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibility]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      (r.title || "").toLowerCase().includes(q) || r.file_key.toLowerCase().includes(q)
    );
  }, [rows, search]);

  return (
    <div className="w-full max-w-3xl space-y-4 rounded-lg border border-white/10 p-4 text-white">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1">
          <Input
            placeholder="Buscar por título ou nome do arquivo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-56">
          <Select value={visibility} onValueChange={(v) => setVisibility(v as Visibility)}>
            <SelectTrigger><SelectValue placeholder="Visibilidade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ORG">Público</SelectItem>
              <SelectItem value="DEPARTMENT">Interno</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={load} disabled={loading}>{loading ? "Carregando…" : <RotateCcwIcon/>}</Button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {loading && !rows.length ? (
        <ul className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="h-10 animate-pulse rounded bg-white/10" />
          ))}
        </ul>
      ) : filtered.length === 0 ? (
        <div className="rounded border border-white/10 p-6 text-center text-zinc-400">
          Nenhum PDF encontrado para essa visibilidade.
        </div>
      ) : (
        <ul className="divide-y divide-white/10 rounded border border-white/10">
          {filtered.map((f) => {
            const href = `${workerBase}/${encodeURIComponent(f.file_key)}`; // abre inline no navegador
            return (
              <li key={f.id} className="flex items-center gap-3 p-3 hover:bg-white/5">
                <span className="shrink-0 rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-300">PDF</span>
                <div className="min-w-0 flex-1">
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate hover:underline"
                    title={f.title || f.file_key}
                  >
                    {f.title || f.file_key}
                  </a>
                </div>
                <span className="hidden text-xs text-zinc-400 md:block">
                  {new Date(f.created_at).toLocaleDateString()}
                </span>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded border border-white/10 px-3 py-1 text-sm hover:bg-white/10"
                >
                  Abrir
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}