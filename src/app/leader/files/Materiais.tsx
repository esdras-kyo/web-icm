"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  FileText, Search, RefreshCcw, ExternalLink, Download, SlidersHorizontal, Loader2
} from "lucide-react";
import { getFilesAction, refreshFilesAction, type FileRow, type Visibility } from "./actions";

export default function MateriaisClient({
  api,
  defaultVisibility,
  initialRows,
  workerBase = process.env.NEXT_PUBLIC_WORKER_BASE || "https://worker-1.esdrascamel.workers.dev",
}: {
  api: string;
  defaultVisibility: Visibility;
  initialRows: FileRow[];
  workerBase?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initVis = (searchParams.get("vis") as Visibility) || defaultVisibility;
  const [visibility, setVisibility] = React.useState<Visibility>(initVis);
  const [sort, setSort] = React.useState<string>(searchParams.get("sort") || "newest");
  const [query, setQuery] = React.useState<string>(searchParams.get("q") || "");

  const [rows, setRows] = React.useState<FileRow[]>(initialRows);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const PAGE = 18;
  const [page, setPage] = React.useState(1);

  const isSyncingQS = React.useRef(false);
  React.useEffect(() => {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (visibility) next.set("vis", visibility);
    if (sort) next.set("sort", sort);

    const nextStr = next.toString();
    const currStr = searchParams.toString();

    if (nextStr === currStr) return; 

    if (isSyncingQS.current) return;
    isSyncingQS.current = true;
    router.replace(`${pathname}?${nextStr}`);

    Promise.resolve().then(() => { isSyncingQS.current = false; });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, visibility, sort]);

  const didFirstFetch = React.useRef(false);
  React.useEffect(() => {
    let mounted = true;
    if (!didFirstFetch.current && rows.length > 0 && visibility === initVis) {
      didFirstFetch.current = true;
      return;
    }
    if (didFirstFetch.current && process.env.NODE_ENV !== "production") {
    }
    didFirstFetch.current = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await getFilesAction({ api, visibility });
        if (mounted) { setRows(list); setPage(1); }
      } catch (e: unknown) {
        if (mounted) setError(e instanceof Error ? e.message : "Erro inesperado");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, visibility]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let base = rows.filter((r) => r.visibility === visibility);
    if (q) base = base.filter((r) => (r.title || "").toLowerCase().includes(q) || r.file_key.toLowerCase().includes(q));
    if (sort === "newest") base.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    else if (sort === "oldest") base.sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
    else if (sort === "az") base.sort((a, b) => (a.title || a.file_key).localeCompare(b.title || b.file_key, "pt-BR"));
    else if (sort === "za") base.sort((a, b) => (b.title || b.file_key).localeCompare(a.title || a.file_key, "pt-BR"));
    return base;
  }, [rows, visibility, query, sort]);

  const paginated = React.useMemo(() => filtered.slice(0, PAGE * page), [filtered, page]);
  const canLoadMore = paginated.length < filtered.length;

  async function handleRefresh() {
    setLoading(true);
    setError(null);
    try {
      await refreshFilesAction(visibility);
      router.refresh();                
    } finally {

      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh w-full bg-gradient-to-b text-white">
      {/* HEADER */}
      <div className="sticky top-0 z-20  border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Materiais</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleRefresh} disabled={loading} variant="secondary" className="cursor-pointer gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : <RefreshCcw className="h-4 w-4"/>}
              {loading ? "Atualizando…" : "Atualizar"}
            </Button>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="mx-auto max-w-6xl px-4 pt-4 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Buscar por título ou nome do arquivo…"
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <Select value={visibility} onValueChange={(v) => setVisibility(v as Visibility)}>
              <SelectTrigger className="w-full cursor-pointer"><SelectValue placeholder="Visibilidade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ORG">Público</SelectItem>
                <SelectItem value="DEPARTMENT">Interno</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full cursor-pointer">
                <div className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4"/> <SelectValue placeholder="Ordenar"/></div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mais recentes</SelectItem>
                <SelectItem value="oldest">Mais antigos</SelectItem>
                <SelectItem value="az">A → Z</SelectItem>
                <SelectItem value="za">Z → A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chips de status */}
        <div className="mt-3 flex items-center gap-2 text-xs">
          <Badge variant="secondary" className="bg-white/10 text-zinc-200">
            {filtered.length} {filtered.length === 1 ? "arquivo" : "arquivos"}
          </Badge>
          {query && (
            <Badge variant="secondary" className="bg-white/10 text-zinc-200">busca: “{query}”</Badge>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto max-w-6xl px-4 py-4">
        {error && (
          <div className="rounded-xl border border-white/10 p-4 bg-rose-500/10 text-rose-200 text-sm mb-4">
            {error}
          </div>
        )}

        {loading && !rows.length ? (
          // Skeletons
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-white/10 p-4 bg-zinc-900/40">
                <div className="h-4 w-16 rounded bg-white/10 mb-3 animate-pulse" />
                <div className="h-5 w-3/4 rounded bg-white/10 mb-2 animate-pulse" />
                <div className="h-5 w-1/2 rounded bg-white/10 mb-4 animate-pulse" />
                <div className="h-8 w-full rounded bg-white/10 animate-pulse" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState onRefresh={handleRefresh} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {paginated.map((f, idx) => (
                  <PdfCard key={f.id} f={f} workerBase={workerBase} idx={idx} />
                ))}
              </AnimatePresence>
            </div>
            {canLoadMore && (
              <div className="flex justify-center mt-6">
                <Button onClick={() => setPage((p) => p + 1)} variant="secondary" className="cursor-pointer">
                  Carregar mais
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="rounded-2xl border border-white/10 p-10 text-center text-zinc-400 bg-zinc-900/40">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
        <FileText className="h-6 w-6 text-zinc-300" />
      </div>
      <p className="text-sm md:text-base">Nenhum PDF encontrado para os filtros atuais.</p>
      <Button onClick={onRefresh} variant="secondary" className="mt-4 cursor-pointer gap-2">
        <RefreshCcw className="h-4 w-4"/> Tentar novamente
      </Button>
    </div>
  );
}

function PdfCard({ f, workerBase, idx }: { f: FileRow; workerBase: string; idx: number }) {
  const href = `${workerBase}/${encodeURIComponent(f.file_key)}`;
  const title = f.title || f.file_key;
  const date = new Date(f.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).replace(/\./g, "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.22, delay: idx * 0.03 }}
      className="group rounded-xl border border-white/10 bg-zinc-900/50 p-4 hover:bg-zinc-900/70 transition-all hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center gap-1 rounded bg-blue-500/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-blue-300">
          <FileText className="h-3 w-3" /> PDF
        </span>
        <span className="ml-auto text-xs text-zinc-400">{date}</span>
      </div>

      <div className="space-y-2">
        <div className="truncate font-medium" title={title}>{title}</div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/10 transition-colors cursor-pointer">
          <ExternalLink className="h-4 w-4" /> Abrir
        </a>
        <a href={href} download className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/10 transition-colors cursor-pointer">
          <Download className="h-4 w-4"/> Baixar
        </a>
      </div>
    </motion.div>
  );
}