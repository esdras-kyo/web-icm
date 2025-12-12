"use client";

import { useMemo, useState } from "react";
import AgendaMonthList, { AgendaEvent } from "../components/AgendaMonthList";

type LeaderAgendaClientProps = {
  initialEvents: AgendaEvent[];
  initialYear: number;
};

export default function LeaderAgendaClient({
  initialEvents,
  initialYear,
}: LeaderAgendaClientProps) {
  const [year, setYear] = useState(initialYear);

  // Filtra apenas os eventos do ano selecionado
  const eventsForYear = useMemo(
    () =>
      initialEvents.filter((ev) =>
        ev.event_date.startsWith(String(year))
      ),
    [initialEvents, year]
  );

  return (
    <AgendaMonthList
      year={year}
      events={eventsForYear}
      showHeader
      onYearChange={setYear}
    />
  );
}