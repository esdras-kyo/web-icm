"use client";
import { Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import AgendaTimeline from "../components/AgendaTimeline";


type TitleLinedProps = {
    label: string;
    as?: React.ElementType;
    mono?: boolean;
  };
  
  function TitleLined({ label, as: Tag = "h2", mono = false }: TitleLinedProps) {
    return (
      <div className="w-full flex items-center gap-6">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <Tag className={`text-2xl md:text-3xl font-bold tracking-tight text-white text-center ${mono ? "font-mono" : ""}`}>
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

          {/* Cards de recorrência */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl p-6 bg-white/[0.04] ring-1 ring-white/10">
              <div className="flex items-center gap-3 text-white">
                <div className="p-2 rounded-xl bg-white/10"><Calendar className="w-5 h-5"/></div>
                <h3 className="text-lg font-semibold">Domingo</h3>
              </div>
              <ul className="mt-3 space-y-1 text-white/90">
                <li className="flex items-center gap-2"><Clock className="w-4 h-4"/> 09:00 — Culto</li>
                <li className="flex items-center gap-2"><Clock className="w-4 h-4"/> 19:00 — Culto</li>
              </ul>
              <p className="text-white/60 text-sm mt-2 flex items-center gap-2"><MapPin className="w-4 h-4"/> Templo</p>
            </div>
            <div className="rounded-2xl p-6 bg-white/[0.04] ring-1 ring-white/10">
              <div className="flex items-center gap-3 text-white">
                <div className="p-2 rounded-xl bg-white/10"><Calendar className="w-5 h-5"/></div>
                <h3 className="text-lg font-semibold">Quarta-feira</h3>
              </div>
              <ul className="mt-3 space-y-1 text-white/90">
                <li className="flex items-center gap-2"><Clock className="w-4 h-4"/> 20:00 — Células</li>
              </ul>
              <p className="text-white/60 text-sm mt-2 flex items-center gap-2"><MapPin className="w-4 h-4"/> Diversas casas</p>
            </div>
            <div className="rounded-2xl p-6 bg-gradient-to-br from-white/[0.06] to-white/[0.02] ring-1 ring-white/10">
              <h3 className="text-lg font-semibold text-white">Eventos especiais</h3>
              <p className="text-white/80 mt-2 text-sm">Inscrições em conferências, encontros...</p>
              <Link href="/events" className="inline-flex mt-4 text-black bg-white px-4 py-2 rounded-lg font-medium hover:opacity-90">Ver eventos</Link>
            </div>
          </div>
          
          <AgendaTimeline />
  
        </div>
      </section>
    );
  }
  