"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { Pencil } from "lucide-react";

type AgendaEvent = {
  id: string;
  title: string;
  description?: string | null;
  event_date: string;
  event_time?: string | null;
  visibility: "GLOBAL" | "INTERNAL";
  department_id?: string | null;
};

type Department = {
  id: string;
  name: string;
};

type Props = {
  event: AgendaEvent;
  departments: Department[];
  onSubmit: (formData: FormData) => Promise<void>;
};

export function AgendaEditDialog({ event, departments, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await onSubmit(formData);
      setOpen(false);
    });
  };

  const timeValue = event.event_time ? event.event_time.slice(0, 5) : "";

  return (
    <>
      <button
        type="button"
        className="rounded border border-zinc-600 px-2 py-1 text-zinc-200 hover:bg-zinc-800/60"
        onClick={() => setOpen(true)}
        aria-label={`Editar ${event.title}`}
      >
        <Pencil className="inline h-4 w-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Editar evento</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-zinc-400 hover:bg-zinc-800"
              >
                <span className="sr-only">Fechar</span>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-sm text-gray-300">Título *</label>
                <input
                  name="title"
                  defaultValue={event.title}
                  required
                  className="rounded-xl border border-white/20 bg-white/10 p-2.5 text-white placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm text-gray-300">Descrição</label>
                <textarea
                  name="description"
                  defaultValue={event.description ?? ""}
                  className="min-h-[90px] rounded-xl border border-white/20 bg-white/10 p-3 text-white placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-300">Data *</label>
                  <input
                    type="date"
                    name="event_date"
                    defaultValue={event.event_date}
                    required
                    className="rounded-xl border border-white/20 bg-white/10 p-2.5 text-white placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-300">Horário</label>
                  <input
                    type="time"
                    name="event_time"
                    defaultValue={timeValue}
                    className="rounded-xl border border-white/20 bg-white/10 p-2.5 text-white placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-300">Visibilidade</label>
                  <select
                    name="visibility"
                    defaultValue={event.visibility}
                    className="rounded-xl border border-white/20 bg-white/10 p-2.5 text-white placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="GLOBAL">Global (Público)</option>
                    <option value="INTERNAL">Interno (Líderes)</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-300">Departamento</label>
                  <select
                    name="department_id"
                    defaultValue={event.department_id ?? ""}
                    className="rounded-xl border border-white/20 bg-white/10 p-2.5 text-white placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="">Sem departamento</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id} className="text-black">
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-zinc-600 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
                  disabled={isPending}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-emerald-600/80 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-60"
                >
                  {isPending ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

