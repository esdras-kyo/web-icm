import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { createAgendaItem, deleteAgendaItem, updateAgendaItem } from "./actions";
import { ConfirmDeleteButton } from "@/app/components/ConfirmDeleteModal";
import { AgendaEditDialog } from "./_components/AgendaEditDialog";

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

  const deptNameById = new Map(departments?.map((d) => [d.id, d.name]) ?? []);

  // server action wrappers must return void/Promise<void>
  const onCreate = async (formData: FormData): Promise<void> => {
    "use server";
    await createAgendaItem(formData);
  };

  const makeDelete = (id: string) => async (): Promise<void> => {
    "use server";
    await deleteAgendaItem(id);
  };

  const makeUpdate = (id: string) => async (formData: FormData): Promise<void> => {
    "use server";
    await updateAgendaItem(id, formData);
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
      <div className="space-y-3">
        {!events || events.length === 0 ? (
          <p className="rounded-xl border border-zinc-700 p-4 text-sm text-zinc-400">
            Nenhum evento cadastrado.
          </p>
        ) : (
          events.map((ev) => {
            const dateStr = ev.event_date
              ? ev.event_date.split("-").reverse().join("/")
              : "—";
            const timeStr = ev.event_time ? ev.event_time.slice(0, 5) : "—";
            const deptName = ev.department_id
              ? deptNameById.get(ev.department_id) ?? "—"
              : "—";

            return (
              <div
                key={ev.id}
                className="rounded-xl border border-zinc-700 bg-zinc-900/40 p-4"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400">
                  <span>{dateStr}</span>
                  <span>{timeStr}</span>
                  <span>{ev.visibility}</span>
                  <span>{deptName}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-white">{ev.title}</span>
                  <div className="flex items-center gap-2">
                    <AgendaEditDialog
                      event={ev}
                      departments={departments ?? []}
                      onSubmit={makeUpdate(ev.id)}
                    />
                    <ConfirmDeleteButton
                      onConfirm={makeDelete(ev.id)}
                      itemName={ev.title}
                      entityLabel="evento"
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}