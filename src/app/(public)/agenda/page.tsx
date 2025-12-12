"use client";
import { Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import AgendaTimeline from "../../components/AgendaTimeline";

type TitleLinedProps = {
  label: string;
  as?: React.ElementType;
  mono?: boolean;
};

function TitleLined({ label, as: Tag = "h2", mono = false }: TitleLinedProps) {
  return (
    <div className="w-full flex items-center gap-6">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <Tag
        className={`text-2xl md:text-3xl font-bold tracking-tight text-white text-center ${
          mono ? "font-mono" : ""
        }`}
      >
        {label}
      </Tag>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-white/25 to-transparent" />
    </div>
  );
}

export default function AgendaSection() {
  return (
    <section id="agenda" className="py-14 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <TitleLined label="Programações" />

        {/* Cardão principal de agenda */}
        <div className="mt-10 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/95 shadow-xl">
          {/* glow de fundo */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.16),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.16),_transparent_55%)]" />

          <div className="relative p-6 md:p-10 flex flex-col gap-8">
            {/* Cards de recorrência */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl p-6 bg-white/[0.03] ring-1 ring-white/10">
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2 rounded-xl bg-white/10">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Domingo</h3>
                    <p className="text-xs text-white/60">
                      Cultos presenciais no templo.
                    </p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1 text-white/90 text-sm">
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    09:00 — Culto
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    19:00 — Culto
                  </li>
                </ul>
                <p className="text-white/60 text-xs mt-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Templo
                </p>
              </div>

              <div className="rounded-2xl p-6 bg-white/[0.03] ring-1 ring-white/10">
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2 rounded-xl bg-white/10">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Quarta-feira</h3>
                    <p className="text-xs text-white/60">
                      Reuniões em células nos lares.
                    </p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1 text-white/90 text-sm">
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    20:00 — Células
                  </li>
                </ul>
                <p className="text-white/60 text-xs mt-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Diversas casas
                </p>
              </div>

              <div className="rounded-2xl p-6 bg-gradient-to-br from-white/[0.08] to-white/[0.02] ring-1 ring-white/10 flex flex-col">
                <h3 className="text-lg font-semibold text-white">
                  Eventos especiais
                </h3>
                <p className="text-white/80 mt-2 text-sm">
                  Conferências, encontros, retiros e outras programações
                  pontuais da igreja.
                </p>
                <Link
                  href="/events"
                  className="cursor-pointer inline-flex items-center justify-center mt-4 rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                >
                  Ver eventos
                </Link>
              </div>
            </div>

            {/* Timeline abaixo, com o mesmo card */}
            <div className="border-t border-white/10 pt-6">
              <AgendaTimeline />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}