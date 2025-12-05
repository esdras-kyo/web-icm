// src/app/leader/events/EventCreateWrapper.tsx
"use client";

import { useEffect, useState } from "react";
import EventCreateForm, {
  type EventCreatePayload,
} from "../components/EventCreator";
import StatisticsChart, {type RegistrationPoint} from "../components/EventChart";
import EventsHomeOverview from "./EventsOverview";
import { NextEventRegistrationsKpi } from "./NextEventKpi";
import { TotalUsersKpi } from "./TotalUsers";

export default function Office() {
const [data, setData] = useState<RegistrationPoint[]>([])
async function fetchNumbers(){
  console.log("chamouuuuu")
  const data = await fetch("/api/events/registrations-over-time", {
    method: "POST",
    body: JSON.stringify({
      event_id: "12627de8-2bbc-47b5-96c8-80276f45ae28",
      // from: "2025-01-01",     // opcional
      // to: "2025-12-31"        // opcional
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((r) => r.json());
  setData(data)
}

useEffect(()=>{
  fetchNumbers()
},[])


  return(
  <div>
     {/* <EventCreateForm onCreate={handleCreate} /> */}
     <main className="min-h-dvh w-full px-4 pt-6 pb-16 sm:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        {/* Sessão: Usuários */}
        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Visão geral
            </h2>
            <p className="text-xs text-gray-500 sm:text-sm"> cadastrados no sistema.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
            <TotalUsersKpi />
            {/* no futuro: outro KPI de usuários aqui */}
          </div>
        </section>

        {/* Sessão: Eventos */}
        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Próximo evento
            </h2>

          </div>

          <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
            <NextEventRegistrationsKpi />
            {/* no futuro: outro KPI de eventos aqui (ex: total de eventos ativos) */}
          </div>
        </section>

        {/* Se quiser reativar criador de eventos depois: */}
        {/* 
        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Criar novo evento
            </h2>
          </div>
          <EventCreateForm onCreate={handleCreate} />
        </section>
        */}
      </div>
    </main>
  </div>)
}