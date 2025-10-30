import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import AgendaMonthList, { AgendaEvent } from "../components/AgendaMonthList";

// Troque por sua checagem real (roles em Clerk ou na tabela role_assignments)
async function assertLeaderOrAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  // TODO: checar roles de fato (ADMIN / LEADER)
  return userId;
}

export default async function LeaderAgendaPage() {
  await assertLeaderOrAdmin();

  const supabase = createSupabaseAdmin();
  const year = new Date().getFullYear();

  const { data, error } = await supabase
    .from("agenda_events")
    .select("id, title, description, event_date, event_time")
    .gte("event_date", `${year}-01-01`)
    .lte("event_date", `${year}-12-31`)
    // Como é área interna, pegamos TUDO (GLOBAL + INTERNAL)
    .order("event_date", { ascending: true });

  if (error) {
    // Você pode renderizar um estado de erro mais elegante
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Agenda — Líder</h1>
        <p className="mt-4 text-sm text-red-300">Erro ao carregar agenda: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-semibold">Agenda</h1>


      <AgendaMonthList year={year} events={(data ?? []) as AgendaEvent[]} />
    </div>
  );
}