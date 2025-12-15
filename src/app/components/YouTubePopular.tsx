"use client";

import { useEffect, useState } from "react";

type Video = { videoId: string; title: string };

export default function YouTubePopularGrid() {
  const [items, setItems] = useState<Video[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/youtube/popular", { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao carregar populares");
        const json = (await res.json()) as { items: Video[] };
        setItems(json.items ?? []);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Erro inesperado");
      }
    })();
  }, []);

  if (err) return <p className="text-red-500">{err}</p>;
  if (!items.length) return null;

  return (
    <div className="w-full">
      <h4 className="text-sm md:text-base font-semibold text-white mb-3">
        Populares
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((v) => (
          <div
            key={v.videoId}
            className="overflow-hidden rounded-xl ring-1 ring-white/10 bg-black/40"
          >
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${v.videoId}`}
                title={v.title}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="p-3">
              <p className="text-sm font-medium text-white line-clamp-2">
                {v.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}