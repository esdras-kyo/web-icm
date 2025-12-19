"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createMeetingAction } from "../actions/createMeting";

type MemberOption = { userId: string; name: string };

export function MeetingForm({
  cellId,
  members,
}: {
  cellId: string;
  members: MemberOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);

  function handleSubmit(formData: FormData) {
    setErrorMessage(null);
    setSuccessMessage(null);
    formData.set("cellId", cellId);

    startTransition(async () => {
      const res = await createMeetingAction(formData);
      if (!res.success) {
        setErrorMessage(res.message ?? "Erro ao enviar.");
        return;
      }

      setSuccessMessage("Relatório enviado com sucesso.");
      setIsOpen(false);

      (document.getElementById("meeting-form") as HTMLFormElement | null)?.reset();
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="mb-4 rounded-md border px-3 py-2 text-sm w-full cursor-pointer"
      >
   {!isOpen ? "Novo relatório": "Fechar"}
      </button>
      {successMessage && (
            <p className="text-emerald-600 text-sm sm:col-span-2">
              {successMessage}
            </p>
          )}

      {isOpen && (
        <form id="meeting-form" action={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label className="text-sm font-medium">Data da reunião</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" type="date" name="occurred_at" required />
          </div>

          <div className="sm:col-span-1">
            <label className="text-sm font-medium">Líder</label>
            <select name="leader_user_id" className="mt-1 w-full rounded-md border px-3 py-2 text-sm">
              <option value="">—</option>
              {members.map((m) => (
                <option key={m.userId} value={m.userId}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1">
            <label className="text-sm font-medium">Assistant</label>
            <select name="assistant_user_id" className="mt-1 w-full rounded-md border px-3 py-2 text-sm">
              <option value="">—</option>
              {members.map((m) => (
                <option key={m.userId} value={m.userId}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Anfitrião */}
          <div className="sm:col-span-1">
            <label className="text-sm font-medium">Anfitrião</label>
            <select name="host_user_id" className="mt-1 w-full rounded-md border px-3 py-2 text-sm">
              <option value="">—</option>
              {members.map((m) => (
                <option key={m.userId} value={m.userId}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1">
            <label className="text-sm font-medium">Qtd. de membros (cadastrados)</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" type="number" name="members_count" min={0} />
          </div>
          <div className="sm:col-span-1">
            <label className="text-sm font-medium">Presentes na reunião</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" type="number" name="attendees_count" min={0} />
          </div>

          <div className="sm:col-span-1">
            <label className="text-sm font-medium">Quebra-gelo (0–5)</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" type="number" name="icebreaker_rate" min={0} max={5} />
          </div>
          <div className="sm:col-span-1">
            <label className="text-sm font-medium">Louvor (0–5)</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" type="number" name="worship_rate" min={0} max={5} />
          </div>
          <div className="sm:col-span-1">
            <label className="text-sm font-medium">Palavra (0–5)</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" type="number" name="word_rate" min={0} max={5} />
          </div>

          <div className="sm:col-span-1">
            <label className="text-sm font-medium">Presentes no culto de domingo</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" type="number" name="sunday_attendance_count" min={0} />
          </div>
          <div className="sm:col-span-1">
            <label className="text-sm font-medium">Visitantes</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm" type="number" name="visitors_count" min={0} />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Anotações (opcional)</label>
            <textarea className="mt-1 w-full rounded-md border px-3 py-2 text-sm" name="notes" rows={4} />
          </div>

          {errorMessage && <p className="text-red-600 text-sm sm:col-span-2">{errorMessage}</p>}

          <div className="sm:col-span-2">
            <button type="submit" disabled={isPending} className="w-full rounded-md border px-3 py-2 text-sm">
              {isPending ? "Salvando..." : "Salvar relatório"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}