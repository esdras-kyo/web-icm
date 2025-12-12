// app/leader/files/actions.ts
"use server";

import { revalidateTag } from "next/cache";

export type Visibility = "ORG" | "DEPARTMENT";
export type FileRow = {
  id: string;
  title: string | null;
  file_key: string;
  visibility: Visibility;
  created_at: string;
};

const REVALIDATE_SECONDS = 300; // 5 min

function tagFor(vis: Visibility) {
  return `files:${vis}`;
}

function getBaseFromEnv(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL; // ex.: https://meusite.com
  if (!raw) throw new Error("NEXT_PUBLIC_BASE_URL não definido no ambiente");
  try {
    // Normaliza para origin (remove path/query se houver)
    const u = new URL(raw);
    return u.origin;
  } catch {
    // Se veio só host, acrescenta http://
    return `http://${raw}`;
  }
}

function toAbsoluteUrl(api: string, query: string): string {
  const base = getBaseFromEnv();
  // Se api já for absoluto, retorna direto
  try {
    const maybeAbs = new URL(api);
    // Anexa a query mantendo origem
    if (query) {
      maybeAbs.search = maybeAbs.search ? `${maybeAbs.search}&${query}` : `?${query}`;
    }
    return maybeAbs.toString();
  } catch {
    // api relativo (ex.: /api/files/list)
    const url = new URL(api, base);
    if (query) url.search = query.startsWith("?") ? query : `?${query}`;
    return url.toString();
  }
}

export async function getFilesAction(params: { api: string; visibility: Visibility; limit?: number }) {
  const { api, visibility, limit = 500 } = params;
  const query = `visibility=${encodeURIComponent(visibility)}&limit=${limit}`;
  const url = toAbsoluteUrl(api, query);

  let res: Response;
  try {
    res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [tagFor(visibility)] },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Falha de rede ao buscar arquivos: ${msg}`);
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Resposta inválida da API em ${url}`);
  }

  if (!res.ok) {
    const errMsg =
      typeof json === "object" && json !== null && "error" in json
        ? String((json as { error?: unknown }).error || "")
        : "";
    throw new Error(errMsg || `Falha ao listar PDFs (HTTP ${res.status})`);
  }

  if (typeof json === "object" && json !== null && "files" in json) {
    const files = (json as { files?: unknown }).files;
    if (Array.isArray(files)) return files as FileRow[];
  }
  return [] as FileRow[];
}

export async function refreshFilesAction(visibility: Visibility) {
  revalidateTag(tagFor(visibility), "max");
}