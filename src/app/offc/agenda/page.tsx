import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { createAgendaItem, deleteAgendaItem } from "./actions";
import { Trash2 } from "lucide-react";

export default async function AdminAgendaPage() {
  const supabase = createSupabaseAdmin();

  const { data: departments } = await supabase
    .from("departments")
    .select("id, name")
    .order("name");

  const { data: events } = await supabase
    .from("agenda_events")
    .select("id, title, description, event_date, event_time, visibility, department_id")
    .order("event_date", { ascending: true });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-8">
      <h1 className="text-2xl font-semibold">Agenda — Administração</h1>

      {/* Criar novo evento */}
      <form action={createAgendaItem} className="grid gap-3 rounded-xl border border-zinc-700 bg-zinc-900/40 p-4">
        <h2 className="font-medium text-lg">Novo evento</h2>

        <input name="title" placeholder="Título" required className="rounded border border-zinc-700 bg-transparent p-2" />
        <textarea name="description" placeholder="Descrição (opcional)" className="rounded border border-zinc-700 bg-transparent p-2" />

        <div className="grid grid-cols-2 gap-3">
          <input type="date" name="event_date" required className="rounded border border-zinc-700 bg-transparent p-2" />
          <input type="time" name="event_time" className="rounded border border-zinc-700 bg-transparent p-2" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select name="visibility" className="rounded border border-zinc-700 bg-transparent p-2" defaultValue="GLOBAL">
            <option value="GLOBAL">Global (Público)</option>
            <option value="INTERNAL">Interno (Líderes)</option>
          </select>

          <select name="department_id" className="rounded border border-zinc-700 bg-transparent p-2" defaultValue="">
            <option value="">Sem departamento</option>
            {departments?.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="rounded-xl border border-zinc-600 px-4 py-2 text-sm hover:bg-zinc-800">
          Salvar
        </button>
      </form>

      {/* Lista de eventos */}
      <div className="rounded-xl border border-zinc-700 overflow-hidden">
        {!events || events.length === 0 ? (
          <p className="p-4 text-sm opacity-70">Nenhum evento cadastrado.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-700 bg-zinc-900/50">
              <tr>
                <th className="p-2 text-left">Data</th>
                <th className="p-2 text-left">Horário</th>
                <th className="p-2 text-left">Título</th>
                <th className="p-2 text-left">Visibilidade</th>
                <th className="p-2 text-left">Departamento</th>
                <th className="p-2 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id} className="border-b border-zinc-800">
                  <td className="p-2">{ev.event_date}</td>
                  <td className="p-2">{ev.event_time ? ev.event_time.slice(0, 5) : "—"}</td>
                  <td className="p-2 font-medium">{ev.title}</td>
                  <td className="p-2">{ev.visibility}</td>
                  <td className="p-2">{ev.department_id || "—"}</td>
                  <td className="p-2">
                    <form action={deleteAgendaItem.bind(null, ev.id)}>
                      <button
                        type="submit"
                        className="rounded border border-red-700 px-2 py-1 text-red-300 hover:bg-red-950/40"
                        aria-label={`Excluir ${ev.title}`}
                      >
                        <Trash2 className="inline h-4 w-4" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}