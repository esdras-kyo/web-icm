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

  // server action wrappers must return void/Promise<void>
  const onCreate = async (formData: FormData): Promise<void> => {
    "use server";
    await createAgendaItem(formData);
  };

  const makeDelete = (id: string) => async (): Promise<void> => {
    "use server";
    await deleteAgendaItem(id);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-8">
      <h1 className="text-2xl font-semibold">Agenda — Administração</h1>

      {/* Criar novo evento */}
      <form
  action={onCreate}
  className="
    w-full max-w-xl
    space-y-4
    rounded-2xl border border-white/10 bg-white/5 
    p-5 backdrop-blur-sm
  "
>
  <h2 className="text-lg font-semibold text-white">Novo evento</h2>

  {/* Título */}
  <div className="flex flex-col space-y-1">
    <label className="text-sm text-gray-300">Título *</label>
    <input
      name="title"
      placeholder="Digite o nome do evento"
      required
      className="
        rounded-xl border border-white/20 bg-white/10 
        p-2.5 text-white placeholder:text-gray-400 
        focus:border-emerald-400 focus:outline-none 
      "
    />
  </div>

  {/* Descrição */}
  <div className="flex flex-col space-y-1">
    <label className="text-sm text-gray-300">Descrição</label>
    <textarea
      name="description"
      placeholder="Descrição (opcional)"
      className="
        rounded-xl border border-white/20 bg-white/10 
        p-3 text-white placeholder:text-gray-400 
        focus:border-emerald-400 focus:outline-none 
        min-h-[90px]
      "
    />
  </div>

  {/* Data e Hora */}
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div className="flex flex-col space-y-1">
      <label className="text-sm text-gray-300">Data *</label>
      <input
        type="date"
        name="event_date"
        required
        className="
          rounded-xl border border-white/20 bg-white/10 
          p-2.5 text-white placeholder:text-gray-400
          focus:border-emerald-400 focus:outline-none 
        "
      />
    </div>

    <div className="flex flex-col space-y-1">
      <label className="text-sm text-gray-300">Horário</label>
      <input
        type="time"
        name="event_time"
        className="
          rounded-xl border border-white/20 bg-white/10 
          p-2.5 text-white placeholder:text-gray-400
          focus:border-emerald-400 focus:outline-none
        "
      />
    </div>
  </div>

  {/* Selecões */}
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div className="flex flex-col space-y-1">
      <label className="text-sm text-gray-300">Visibilidade</label>
      <select
        name="visibility"
        defaultValue="GLOBAL"
        className="
          rounded-xl border border-white/20 bg-white/10 
          p-2.5 text-white placeholder:text-gray-400 
          focus:border-emerald-400 focus:outline-none
        "
      >
        <option value="GLOBAL">Global (Público)</option>
        <option value="INTERNAL">Interno (Líderes)</option>
      </select>
    </div>

    <div className="flex flex-col space-y-1">
      <label className="text-sm text-gray-300">Departamento</label>
      <select
        name="department_id"
        defaultValue=""
        className="
          rounded-xl border border-white/20 bg-white/10 
          p-2.5 text-white placeholder:text-gray-400 
          focus:border-emerald-400 focus:outline-none
        "
      >
        <option value="">Sem departamento</option>
        {departments?.map((d) => (
          <option key={d.id} value={d.id} className="text-black">
            {d.name}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* Botão */}
  <button
    type="submit"
    className="
      w-full sm:w-auto 
      rounded-xl bg-emerald-600/80 px-5 py-2 
      text-sm font-medium text-white 
      hover:bg-emerald-500 transition cursor-pointer
    "
  >
    Salvar evento
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
                    <form action={makeDelete(ev.id)}>
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