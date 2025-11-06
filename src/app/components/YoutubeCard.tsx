// components/YouTubeCard.tsx
"use client";

import { useEffect, useState } from "react";

type Payload = { videoId: string; isLive: boolean; title?: string };

export default function YouTubeCard() {
  const [data, setData] = useState<Payload | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/youtube/current", { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao carregar vídeo");
        const json = (await res.json()) as Payload;
        setData(json);
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "Erro inesperado";
        setErr(msg);
      }
    })();
  }, []);

  if (err) return <p className="text-red-500">{err}</p>;
  if (!data) return <p className="opacity-70">Carregando vídeo…</p>;

  const src = `https://www.youtube.com/embed/${data.videoId}${
    data.isLive ? "?autoplay=1" : ""
  }`;

  return (
    <div className="relative rounded-xl overflow-hidden border bg-black/50">
      <div style={{ aspectRatio: "16/9" }}>
        <iframe
          className="w-full h-full"
          src={src}
          title={data.title ?? "Vídeo do canal"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <div className="p-3 flex items-center justify-between">
        <h3 className="text-sm md:text-base font-medium line-clamp-2 pr-2">
          {data.title ?? (data.isLive ? "AO VIVO" : "Último vídeo")}
        </h3>
        {data.isLive && (
          <span className="ml-2 inline-flex items-center text-[10px] md:text-xs font-semibold px-2 py-1 rounded bg-red-600 text-white">
            AO VIVO
          </span>
        )}
      </div>
    </div>
  );
}