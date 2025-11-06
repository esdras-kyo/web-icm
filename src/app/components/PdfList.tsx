"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { motion } from "framer-motion";
import { FileText, Search, RefreshCcw, ExternalLink, FolderOpen, Plus } from "lucide-react";

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
  const [open, setOpen] = React.useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const url = `${api}?visibility=${encodeURIComponent(visibility)}&limit=200`;
      const res = await fetch(url, { cache: "force-cache" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Falha ao listar PDFs");
      setRows(json.files || []);
    } catch (e) {
      const msg =
      e instanceof Error ? e.message : "Erro inesperado";
    setError(msg);
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
    <div className="w-full max-w-5xl space-y-6 rounded-2xl border border-white/10 p-6 text-white bg-gradient-to-b from-zinc-900/60 to-transparent">
      {/* Collapsible wrapper */}
      <Collapsible open={open} onOpenChange={setOpen}>
        {/* Compact bar with + */}
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <div>
              <div className="text-sm font-medium leading-none"><h2 className="text-xl md:text-2xl font-semibold tracking-tight">Materiais</h2></div>
             {open? <div className="mt-3 text-xs text-zinc-400">  {filtered.length} {filtered.length === 1 ? "arquivo" : "arquivos"}</div>:null}
            </div>
          </div>
          <Button size="icon" variant="secondary" onClick={() => setOpen(!open)} className="cursor-pointer rounded-full transition-transform">
            <Plus className={`h-5 w-5 transition-transform ${open ? "rotate-45" : ""}`} />
          </Button>
        </div>

        {/* Expanding content */}
        <CollapsibleContent>
          <motion.div
            initial={false}
            animate={open ? { opacity: 1, height: "auto", marginTop: 12 } : { opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden"
          >


            {/* Toolbar */}
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    className="pl-9"
                    placeholder="Buscar por título ou nome do arquivo…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
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
              <Button onClick={load} disabled={loading} variant="secondary" className="gap-2">
                <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Atualizando…" : "Atualizar"}
              </Button>
            </div>

            {error && <p className="text-sm text-red-400 mt-2">{error}</p>}

            {/* Loading skeleton */}
            {loading && !rows.length ? (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-white/10 p-4 bg-zinc-900/30">
                    <div className="h-4 w-16 rounded bg-white/10 mb-3 animate-pulse" />
                    <div className="h-5 w-3/4 rounded bg-white/10 mb-2 animate-pulse" />
                    <div className="h-5 w-2/4 rounded bg-white/10 mb-4 animate-pulse" />
                    <div className="h-8 w-full rounded bg-white/10 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="mt-4 rounded-xl border border-white/10 p-8 text-center text-zinc-400 bg-zinc-900/30">
                <FolderOpen className="mx-auto h-8 w-8 mb-3 text-zinc-500" />
                <p className="mb-3">Nenhum PDF encontrado para essa visibilidade.</p>
                <Button variant="secondary" onClick={load} className="gap-2">
                  <RefreshCcw className="h-4 w-4" /> Tentar novamente
                </Button>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((f, idx) => {
                  const href = `${workerBase}/${encodeURIComponent(f.file_key)}`;
                  const title = f.title || f.file_key;
                  const date = new Date(f.created_at).toLocaleDateString();
                  return (
                    <motion.div
                      key={f.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.04 }}
                      className="group rounded-xl border border-white/10 bg-zinc-900/40 p-4 hover:bg-zinc-900/70 transition-all hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 rounded bg-blue-500/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-blue-300">
                          <FileText className="h-3 w-3" /> PDF
                        </span>
                        <span className="ml-auto text-xs text-zinc-400">{date}</span>
                      </div>

                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate font-medium hover:underline"
                        title={title}
                      >
                        {title}
                      </a>

                      <div className="mt-4">
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/10 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Abrir
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}