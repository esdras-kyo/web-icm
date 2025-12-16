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
};

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
          new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
      )
      .slice(0, 3);
  }, [events]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    );
  }

  if (top3.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
        <p className="text-white/80 font-medium">
          Nenhum evento disponível no momento.
        </p>
        <p className="mt-2 text-sm text-white/60">Em breve teremos novidades.</p>
      </div>
    );
  }

  return (
    <>
    <ul className="flex flex-col gap-4 ">
      {top3.map((ev) => (
        <li key={ev.id}>
          <Link href={`/events/${ev.id}`} className="cursor-pointer block">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              whileHover={{ opacity: 0.9, x: 14 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/50"
            >
              {ev.image_key && (
                <div className="absolute inset-0">

                  <Image
                    src={`https://worker-1.esdrascamel.workers.dev/${encodeURIComponent(
                      ev.image_key
                    )}`}
                    alt={ev.title ?? "Evento"}
                    fill
                    sizes="100vw"
                    className="  object-cover object-left md:object-center rounded-2xl transition-transform duration-700 ease-out group-hover:scale-105"
                    priority={false}
                  />

                  <div className="absolute inset-0 rounded-2xl bg-black/30" />

                  <div
                    className="
                      absolute inset-0
                      rounded-2xl
                      bg-linear-to-b
                      from-black/70
                      via-transparent
                      to-transparent
                    "
                  />
                </div>
              )}

              <div className="relative z-10 flex items-end justify-between gap-4 p-4 md:p-6 bg-black/50 hover:bg-black/30">
                <p className="text-xl md:text-2xl font-semibold text-white">
                  {ev.title ?? "Sem nome"}
                </p>
                <ChevronRight className="h-10 w-10 text-white" />
              </div>

              {/* altura de retângulo DEITADO */}
              <div className="h-36 md:h-44" />
            </motion.div>
          </Link>
        </li>
      ))}
    </ul>
              <div className="flex justify-center">
              <Link 
              href="/events"
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-xs md:text-sm font-semibold text-black bg-zinc-200 hover:bg-zinc-100 transition">
                <p>Ver todos</p>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            </>
  );
}

function SkeletonRow() {
  return (
    <div className="animate-pulse">
      <div className="h-36 md:h-44 rounded-2xl border border-white/10 bg-white/5" />
    </div>
  );
}