"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { HighlightKpiCard } from "../components/HighlightKpiCard";
import type { RegistrationPoint } from "@/app/components/EventChart";

type NextEventResponse = {
  event: {
    id: string;
    title: string | null;
    capacity: number | null;
    starts_at: string | null;
    ends_at: string | null;
  } | null;
};

type Props = {
  // opcional: se sua rota for diferente, você ajusta aqui
  buildEventHref?: (eventId: string) => string;
};

export function NextEventRegistrationsKpi({
  buildEventHref = (id) => `/offc/events/${id}`, // ajuste se a sua rota for outra
}: Props) {
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<NextEventResponse["event"]>(null);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    setLoading(true);
    setError(null);

    try {
      // 1) Pega o próximo evento
      const resNext = await fetch("/api/events/next", { cache: "no-store" });
      const jsonNext: NextEventResponse = await resNext.json();

      if (!jsonNext.event) {
        setEvent(null);
        setTotalRegistrations(0);
        setLoading(false);
        return;
      }

      setEvent(jsonNext.event);

      // 2) Pega evolução das inscrições desse evento
      const resRegs = await fetch("/api/events/registrations-over-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: jsonNext.event.id }),
      });

      const jsonRegs: RegistrationPoint[] = await resRegs.json();

      const total =
        jsonRegs.length > 0
          ? jsonRegs[jsonRegs.length - 1].registrations_cumulative
          : 0;

      setTotalRegistrations(total);
    } catch (e) {
      console.error(e);
      setError("Erro ao carregar dados do próximo evento.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-full rounded-2xl border border-gray-800 bg-white/5 p-5 text-sm text-white/70">
        Carregando próximos inscritos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-full rounded-2xl border border-red-700/60 bg-red-950/40 p-5 text-sm text-red-100">
        {error}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="w-full max-w-full rounded-2xl border border-gray-800 bg-white/5 p-5 text-sm text-white/80">
        Nenhum evento futuro encontrado.
      </div>
    );
  }

  const dateLabel = event.starts_at
    ? new Date(event.starts_at).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const description = [
    event.title ?? "Evento sem título",
    dateLabel ? `Início: ${dateLabel}` : null,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <HighlightKpiCard
      label="Inscritos no próximo evento"
      value={totalRegistrations}
      description={description}
      href={buildEventHref(event.id)}
      ctaLabel="Ver detalhes do evento"
      icon={<Users size={18} />}
    />
  );
}