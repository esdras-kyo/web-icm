"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ExternalLink, Radio } from "lucide-react";

type CurrentPayload = { videoId: string; isLive: boolean; title?: string };
type PopularVideo = { videoId: string; title: string };
type PopularPayload = { items: PopularVideo[] };

type Props = {
  title?: string;
};

function getEmbedSrc(videoId: string, opts?: { autoplay?: boolean }) {
  const params = new URLSearchParams();
  if (opts?.autoplay) params.set("autoplay", "1");
  params.set("rel", "0");
  params.set("modestbranding", "1");
  params.set("playsinline", "1");
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "animate-pulse rounded-xl bg-white/10 ring-1 ring-white/10",
        className,
      ].join(" ")}
    />
  );
}

export default function YouTubeSection({
  title = "Estamos no YouTube",
}: Props) {
  const [current, setCurrent] = useState<CurrentPayload | null>(null);
  const [popular, setPopular] = useState<PopularVideo[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const [cRes, pRes] = await Promise.all([
          fetch("/api/youtube/current", { cache: "no-store" }),
          fetch("/api/youtube/popular", { cache: "no-store" }),
        ]);

        if (!cRes.ok) throw new Error("Falha ao carregar vídeo atual");
        if (!pRes.ok) throw new Error("Falha ao carregar vídeos populares");

        const cJson = (await cRes.json()) as CurrentPayload;
        const pJson = (await pRes.json()) as PopularPayload;

        if (!alive) return;

        setCurrent(cJson);
        setPopular(pJson.items ?? []);
      } catch (e) {
        if (!alive) return;
        setErr(e instanceof Error ? e.message : "Erro inesperado");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const currentSrc = useMemo(() => {
    if (!current?.videoId) return null;
    return getEmbedSrc(current.videoId, { autoplay: current.isLive });
  }, [current]);

  const watchUrl = useMemo(() => {
    if (!current?.videoId) return null;
    return `https://www.youtube.com/watch?v=${current.videoId}`;
  }, [current?.videoId]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
        delay: 0.5,
      }}
      viewport={{ once: true, amount: 0.4 }}
      className="w-full py-36 px-6"
    >
      <div className="relative w-full mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-white/6 to-white/3 p-6 md:p-10 shadow-xl">
        {/* glows */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />

        {/* Header */}
        <div className="relative z-10 flex flex-col items-center text-center gap-3">
          <h3 className="text-xl md:text-2xl font-semibold text-white">
            {title}
          </h3>
        </div>

        {/* Last transmission block (half video / half text on desktop) */}
        <div className="relative z-10 mt-8 overflow-hidden rounded-2xl ring-1 ring-white/10 bg-black/35">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Video */}
            <div className="aspect-video w-full">
              {loading ? (
                <Skeleton className="w-full h-full rounded-none" />
              ) : err || !currentSrc ? (
                <div className="w-full h-full flex items-center justify-center text-sm text-white/70">
                  Não foi possível carregar o vídeo.
                </div>
              ) : (
                <iframe
                  className="w-full h-full"
                  src={currentSrc}
                  title={current?.title ?? "Última transmissão"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>

            {/* Text */}
            <div className="p-5 md:p-7 flex flex-col justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/60">
                  Nossa última transmissão
                </p>

                <p className="mt-3 text-base md:text-lg font-semibold text-white leading-snug">
                  {loading
                    ? "Carregando…"
                    : err
                      ? "Indisponível"
                      : current?.title ?? (current?.isLive ? "AO VIVO" : "Último vídeo")}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {current?.isLive ? (
                    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-white/15 bg-white/10 text-white/90">
                      <Radio className="size-4" />
                      Ao vivo
                    </span>
                  ) : ("")}
                </div>
              </div>

              <a
                href={watchUrl ?? ""}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/15 bg-white/10 hover:bg-white/15 transition"
              >
                Ver no YouTube
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Popular grid */}
        <div className="relative z-10 mt-10">
          <p className="text-xs uppercase tracking-[0.28em] text-white/60">
            Outras ministrações
          </p>

          {loading ? (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <Skeleton className="h-52" />
              <Skeleton className="h-52" />
              <Skeleton className="h-52" />
            </div>
          ) : err ? (
            <p className="mt-4 text-sm text-red-400">{err}</p>
          ) : (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              {popular.slice(0, 3).map((v) => (
                <div
                  key={v.videoId}
                  className="overflow-hidden rounded-2xl ring-1 ring-white/10 bg-black/35"
                >
                  <div className="aspect-video w-full">
                    <iframe
                      className="w-full h-full"
                      src={getEmbedSrc(v.videoId)}
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
          )}
        </div>
      </div>
    </motion.section>
  );
}