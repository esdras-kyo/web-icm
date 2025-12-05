"use client";

import { useEffect, useState } from "react";
import { EventKpis } from "./EventsKpis";
import StatisticsChart, {
  RegistrationPoint,
} from "@/app/components/EventChart";

type NextEventResponse = {
  event: {
    id: string;
    title: string | null;
    capacity: number | null;
    starts_at: string | null;
    ends_at: string | null;
  } | null;
};

export default function EventsHomeOverview() {
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<NextEventResponse["event"]>(null);
  const [chartData, setChartData] = useState<RegistrationPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function fetchNextEventAndStats() {
    setLoading(true);
    setError(null);

    try {
      // 1) Pegar evento mais próximo
      const nextRes = await fetch("/api/events/next", { cache: "no-store" });
      const nextJson: NextEventResponse = await nextRes.json();

      if (!nextJson.event) {
        setEvent(null);
        setChartData([]);
        setLoading(false);
        return;
      }

      setEvent(nextJson.event);

      // 2) Pegar registros ao longo do tempo para esse evento
      const regsRes = await fetch("/api/events/registrations-over-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: nextJson.event.id }),
      });

      const regsJson: RegistrationPoint[] = await regsRes.json();
      setChartData(regsJson);
    } catch (e) {
      console.error(e);
      setError("Falha ao carregar dados do próximo evento.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNextEventAndStats();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-800 bg-white/5 p-6 text-white">
        Carregando resumo de eventos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-700/70 bg-red-950/40 p-6 text-sm text-red-100">
        {error}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="rounded-2xl border border-gray-800 bg-white/5 p-6 text-sm text-white/80">
        Nenhum evento futuro encontrado.
      </div>
    );
  }

  // ===== KPIs derivados do próximo evento =====

  const totalRegistrations =
    chartData.length > 0
      ? chartData[chartData.length - 1].registrations_cumulative
      : 0;

  // Hoje em YYYY-MM-DD
  const todayStr = (() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  })();

  const todayRegistrations = chartData.find((p) => p.day === todayStr)
    ?.registrations_in_day ?? 0;

  // Dias até o evento usando starts_at / ends_at
  let daysToEvent: number | null = null;
  if (event.starts_at) {
    const now = new Date();
    const start = new Date(event.starts_at);
    const end = event.ends_at ? new Date(event.ends_at) : null;

    const todayMid = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const startMid = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    ).getTime();

    if (end && todayMid > end.getTime()) {
      daysToEvent = -1;
    } else {
      const diffMs = startMid - todayMid;
      daysToEvent = Math.round(diffMs / (1000 * 60 * 60 * 24));
    }
  }

  // Variação percentual (último dia vs penúltimo)
  let registrationsChangePercent: number | null = null;
  if (chartData.length >= 2) {
    const last = chartData[chartData.length - 1].registrations_in_day;
    const prev = chartData[chartData.length - 2].registrations_in_day;
    if (prev > 0) {
      registrationsChangePercent = ((last - prev) / prev) * 100;
    } else if (last > 0) {
      registrationsChangePercent = 100;
    }
  }

  const capacity = event.capacity ?? null;

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Título + info básica do evento em destaque */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
            Próximo evento
          </p>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            {event.title ?? "Evento sem título"}
          </h2>
          {event.starts_at && (
            <p className="text-sm text-white/60">
              Início:{" "}
              {new Date(event.starts_at).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>

        {/* Link pra tela detalhada se quiser */}
        {/* <Link
          href={`/dashboard/events/${event.id}/inscricoes`}
          className="mt-2 inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300"
        >
          Ver detalhes do evento →
        </Link> */}
      </div>

      {/* KPIs do evento mais próximo */}
      <EventKpis
        totalRegistrations={totalRegistrations}
        capacity={capacity}
        todayRegistrations={todayRegistrations}
        daysToEvent={daysToEvent}
        registrationsChangePercent={registrationsChangePercent}
      />

      {/* Gráfico do próximo evento (opcional, mas eu deixaria) */}
      <div className="mt-2">
        <StatisticsChart data={chartData} />
      </div>
    </div>
  );
}