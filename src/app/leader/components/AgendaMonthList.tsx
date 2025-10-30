"use client";

import { useMemo } from "react";
import { Download } from "lucide-react";
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
}: {
  year: number;
  events: AgendaEvent[];
  showHeader?: boolean;
}) {
  const grouped = useMemo(() => {
    const g = groupByMonth(events);
    return Object.entries(g).sort(
      (a, b) =>
        new Date(a[1][0]?.event_date ?? "").getTime() -
        new Date(b[1][0]?.event_date ?? "").getTime()
    );
  }, [events]);

  async function downloadAgendaPdf(year: number) {
    try {
      const res = await fetch(`/api/agenda/pdf?scope=leader&year=${year}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Falha ao gerar PDF: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `agenda-icm-${year}.pdf`;
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
    <div className="w-full">
      {showHeader && (
        <div className="mb-6 flex items-center justify-between gap-2 print:hidden">
          <h2 className="text-xl font-semibold">Agenda {year}</h2>
          <button
            onClick={() => downloadAgendaPdf(new Date().getFullYear())}
            className="cursor-pointer rounded-xl border px-3 py-2 text-sm hover:bg-zinc-800"
          >
            <Download className="mr-1 inline h-4 w-4" />
            Baixar PDF
          </button>
        </div>
      )}

      {events.length === 0 ? (
        <p className="text-sm opacity-70">Nenhum evento encontrado.</p>
      ) : (
        <div className="space-y-8">
          {grouped.map(([monthKey, items]) => (
            <section
              key={monthKey}
              className="rounded-2xl border bg-zinc-900/40"
            >
              <header className="sticky top-0 z-0 rounded-t-2xl border-b bg-zinc-900/70 px-4 py-3 backdrop-blur">
                <h3 className="text-lg font-semibold capitalize">{monthKey}</h3>
              </header>
              <ul className="divide-y">
                {items.map((ev) => {
                  const d = parseISO(ev.event_date);
                  const day = format(d, "dd");
                  const dow = format(d, "EEE", { locale: ptBR });
                  const time = ev.event_time ? ev.event_time.slice(0, 5) : null;

                  return (
                    <li
                      key={ev.id}
                      className="flex items-start gap-4 px-4 py-3"
                    >
                      <div className="w-14 text-right">
                        <div className="text-2xl font-bold leading-none">
                          {day}
                        </div>
                        <div className="text-xs opacity-60">{dow}</div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{ev.title}</div>
                        <div className="text-xs opacity-70">
                          {time ? `às ${time}` : ""}
                        </div>
                        {ev.description && (
                          <p className="mt-1 text-sm opacity-80">
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
