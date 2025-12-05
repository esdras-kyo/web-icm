"use client";

import React from "react";
import { Users, UserPlus, CalendarDays } from "lucide-react";
import { KpiCard } from "../components/KpiCard";
import OccupancyRadial from "../components/OccupancyRadial";

type EventKpisProps = {
  totalRegistrations: number;
  capacity?: number | null;
  todayRegistrations?: number;
  daysToEvent?: number | null;
  registrationsChangePercent?: number | null;
};

export function EventKpis({
  totalRegistrations,
  capacity,
  todayRegistrations,
  daysToEvent,
  registrationsChangePercent,
}: EventKpisProps) {
  const occupancyPercent =
    capacity && capacity > 0
      ? Math.min(100, Math.round((totalRegistrations / capacity) * 100))
      : 0;

  const trendDirection =
    registrationsChangePercent == null
      ? "neutral"
      : registrationsChangePercent > 0
      ? "up"
      : registrationsChangePercent < 0
      ? "down"
      : "neutral";

  const trendValue =
    registrationsChangePercent == null
      ? undefined
      : `${registrationsChangePercent > 0 ? "+" : ""}${registrationsChangePercent.toFixed(
          1
        )}%`;

  return (
    <div
      className="
        flex flex-col gap-4
        md:grid md:grid-cols-2
        xl:grid-cols-4
        w-full max-w-full
      "
    >
      <KpiCard
        label="Inscritos totais"
        value={totalRegistrations}
        helperText={
          capacity ? `Capacidade: ${capacity} pessoas` : "Sem limite definido"
        }
        trendValue={trendValue}
        trendDirection={trendDirection}
        icon={<Users size={20} />}
        className="w-full"
      />

      <KpiCard
        label="Inscritos hoje"
        value={todayRegistrations ?? 0}
        helperText="Desde 00:00"
        icon={<UserPlus size={20} />}
        className="w-full"
      />

      <KpiCard
        label="Dias até o evento"
        value={
          daysToEvent == null
            ? "—"
            : daysToEvent < 0
            ? "Encerrado"
            : daysToEvent
        }
        helperText={
          daysToEvent != null && daysToEvent >= 0
            ? "Contagem regressiva"
            : undefined
        }
        icon={<CalendarDays size={20} />}
        className="w-full"
      />

      <div className="w-full">
        <OccupancyRadial
          percent={occupancyPercent}
          helperText={
            capacity
              ? `${totalRegistrations} de ${capacity} inscritos`
              : `${totalRegistrations} inscritos`
          }
        />
      </div>
    </div>
  );
}