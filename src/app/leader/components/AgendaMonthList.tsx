"use client";

import { useMemo } from "react";
import { Calendar, Download } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

export type AgendaEvent = {
  id: string;
  title: string;
  description: string | null;
  event_date: string; // YYYY-MM-DD
  event_time: string | null; // HH:mm:ss
  // demais campos ignorados no UI
};

function groupByMonth(items: AgendaEvent[]) {
  const map: Record<string, AgendaEvent[]> = {};
  for (const it of items) {
    const key = format(parseISO(it.event_date), "MMMM yyyy", { locale: ptBR });
    if (!map[key]) map[key] = [];
    map[key].push(it);
  }
  return map;
}

export default function AgendaMonthList({
  year,
  events,
  showHeader = true,
  onYearChange,
}: {
  year: number;
  events: AgendaEvent[];
  showHeader?: boolean;
  onYearChange?: (year: number) => void;
}) {
  const grouped = useMemo(() => {
    const g = groupByMonth(events);
    return Object.entries(g).sort(
      (a, b) =>
        new Date(a[1][0]?.event_date ?? "").getTime() -
        new Date(b[1][0]?.event_date ?? "").getTime()
    );
  }, [events]);

  const currentYear = new Date().getFullYear();

  async function downloadAgendaPdf(yearToDownload: number) {
    try {
      const res = await fetch(
        `/api/agenda/pdf?scope=leader&year=${yearToDownload}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error(`Falha ao gerar PDF: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `agenda-icm-${yearToDownload}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (err) {
      console.error(err);
      alert("Não foi possível baixar o PDF.");
    }
  }

  return (
    <div className="w-full mt-6">
      {showHeader && (
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between print:hidden rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.05] to-white/[0.01] px-4 py-3 md:px-5 md:py-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-semibold text-white">
                Agenda {year}
              </h2>
              <p className="text-xs md:text-sm text-white/60">
                Veja os eventos gerais da igreja ao longo do ano.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* seletor de ano */}
            <div className="relative inline-flex items-center rounded-xl border border-white/20 bg-white/5 px-2">
              <select
                aria-label="Selecionar ano"
                className="bg-transparent p-2 pr-7 text-xs md:text-sm text-white outline-none cursor-pointer appearance-none"
                value={year}
                onChange={(e) =>
                  onYearChange?.(Number(e.target.value))
                }
              >
                <option
                  className="bg-slate-900 text-white"
                  value={currentYear - 1}
                >
                  {currentYear - 1}
                </option>
                <option
                  className="bg-slate-900 text-white"
                  value={currentYear}
                >
                  {currentYear}
                </option>
                <option
                  className="bg-slate-900 text-white"
                  value={currentYear + 1}
                >
                  {currentYear + 1}
                </option>
              </select>
              <span className="pointer-events-none absolute right-2 text-white/60 text-xs">
                ▾
              </span>
            </div>

            {/* botão download */}
            <button
              onClick={() => downloadAgendaPdf(year)}
              className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs md:text-sm font-medium text-white hover:bg-white/15 transition"
            >
              <Download className="h-4 w-4" />
              Baixar PDF
            </button>
          </div>
        </div>
      )}

      {events.length === 0 ? (
        <p className="text-sm text-white/70">Nenhum evento encontrado.</p>
      ) : (
        <div className="space-y-6">
          {grouped.map(([monthKey, items]) => (
            <section
              key={monthKey}
              className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur"
            >
              <header className="sticky top-0 z-0 rounded-t-2xl border-b border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur">
                <h3 className="text-base md:text-lg font-semibold capitalize text-white">
                  {monthKey}
                </h3>
              </header>
              <ul className="divide-y divide-white/5">
                {items.map((ev) => {
                  const d = parseISO(ev.event_date);
                  const day = format(d, "dd");
                  const dow = format(d, "EEE", { locale: ptBR });
                  const time = ev.event_time ? ev.event_time.slice(0, 5) : null;

                  return (
                    <li
                      key={ev.id}
                      className="flex items-start gap-4 px-4 py-3 md:px-5 md:py-4"
                    >
                      <div className="w-14 text-right">
                        <div className="text-2xl md:text-3xl font-bold leading-none text-white">
                          {day}
                        </div>
                        <div className="text-[10px] md:text-xs text-white/60 uppercase">
                          {dow}
                        </div>
                      </div>
                      <div className="flex-1 border-l border-white/10 pl-4">
                        <div className="text-sm md:text-base font-medium text-white">
                          {ev.title}
                        </div>
                        {time && (
                          <div className="text-xs md:text-sm text-white/60 mt-0.5">
                            às {time}
                          </div>
                        )}
                        {ev.description && (
                          <p className="mt-1 text-xs md:text-sm text-white/75">
                            {ev.description}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}

      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          section {
            break-inside: avoid;
          }
          header {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}