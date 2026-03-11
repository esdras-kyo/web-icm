"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ChevronRight } from "lucide-react";

type Mini = {
  id: string;
  title: string | null;
  description: string | null;
  price: number;
  image_key: string;
  starts_at: string;
  slug: string;
};

const CDN = "https://worker-1.esdrascamel.workers.dev";

export default function EventsGrid() {
  const [events, setEvents] = useState<Mini[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/events-on?visibility=ORG&status=ATIVO", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Erro ao carregar eventos");
        const data = (await res.json()) as Mini[];
        setEvents(data ?? []);
      } catch (err) {
        console.error(err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const top3 = useMemo(() => {
    return [...events]
      .sort(
        (a, b) =>
          new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
      )
      .slice(0, 3);
  }, [events]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.4 }}
      className="w-full py-36 bg-linear-to-tr from-white/10 via-black to-sky-800/30"
    >
      <div className="mx-auto max-w-6xl px-6 flex flex-col gap-10">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-white/60">
            Programações especiais
          </p>
          <h2 className="mt-3 text-2xl md:text-4xl font-semibold tracking-tight text-white">
            Próximos Eventos
          </h2>
          <p className="mt-2 text-sm md:text-base text-white/70">
            Participe do movimento.
          </p>
        </div>

        {/* Content */}
        <div className="min-h-[28rem] md:min-h-[35rem]">
          {loading ? (
            <div className="flex flex-col gap-4">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : top3.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
              <p className="text-white/80 font-medium">
                Nenhum evento disponível no momento.
              </p>
              <p className="mt-2 text-sm text-white/60">
                Em breve teremos novidades.
              </p>
            </div>
          ) : (
            <>
              <ul className="flex flex-col gap-4">
                {top3.map((ev) => (
                  <li key={ev.id}>
                    <Link href={`/events/${ev.slug}`} className="block">
                      <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        whileHover={{ x: 6 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                        className="group rounded-2xl border border-white/10 bg-black overflow-hidden"
                      >
                        {/* Imagem — área dedicada com altura proporcional */}
                        <div className="relative w-full aspect-video md:h-72 md:aspect-auto overflow-hidden">
                          <Image
                            src={`${CDN}/${encodeURIComponent(ev.image_key)}`}
                            alt={ev.title ?? "Evento"}
                            fill
                            sizes="(max-width: 768px) 100vw, 1200px"
                            className="object-contain object-center sm:object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            priority={false}
                          />
                          <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-b from-transparent to-black" />
                        </div>

                        {/* Área de texto — fundo preto, separado da imagem */}
                        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5 md:px-6 md:py-5">
                          <p className="text-sm sm:text-base md:text-xl font-semibold text-white line-clamp-2 leading-snug">
                            {ev.title ?? ""}
                          </p>
                          <ChevronRight className="h-5 w-5 shrink-0 text-white/50 transition-colors group-hover:text-white" />
                        </div>
                      </motion.div>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex justify-center pt-6">
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-xs md:text-sm font-semibold text-black bg-zinc-200 hover:bg-zinc-100 transition"
                >
                  <p>Ver todos</p>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
}

function SkeletonRow() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="h-52 md:h-72 bg-white/5" />
      <div className="px-4 py-4 md:px-6 md:py-5">
        <div className="h-5 w-2/3 rounded bg-white/10" />
      </div>
    </div>
  );
}
