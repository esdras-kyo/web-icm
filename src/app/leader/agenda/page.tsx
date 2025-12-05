// app/(leader)/agenda/page.tsx
import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { AgendaEvent } from "../components/AgendaMonthList";
import LeaderAgendaClient from "./LeaderAgendaClient";

async function assertLeaderOrAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  // TODO: checar roles de fato (ADMIN / LEADER)
  return userId;
}

export default async function LeaderAgendaPage() {
  await assertLeaderOrAdmin();

  const supabase = createSupabaseAdmin();
  const currentYear = new Date().getFullYear();

  const from = `${currentYear - 1}-01-01`;
  const to = `${currentYear + 1}-12-31`;

  const { data, error } = await supabase
    .from("agenda_events")
    .select("id, title, description, event_date, event_time")
    .gte("event_date", from)
    .lte("event_date", to)
    // Área interna: GLOBAL + INTERNAL (RLS cuida do resto, se aplicado)
    .order("event_date", { ascending: true });

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Agenda — Líder</h1>
        <p className="mt-4 text-sm text-red-300">
          Erro ao carregar agenda: {error.message}
        </p>
      </div>
    );
  }

  const events = (data ?? []) as AgendaEvent[];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-semibold text-white">Agenda</h1>

      <LeaderAgendaClient
        initialEvents={events}
        initialYear={currentYear}
      />
    </div>
  );
}