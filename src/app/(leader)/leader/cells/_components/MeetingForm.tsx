"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createMeetingAction } from "../actions/createMeting";
import { StarRating } from "./starrating";

export function MeetingForm({
  cellId,
  leaderUserId,
  leaderName,
}: {
  cellId: string;
  leaderUserId?: string; 
  leaderName?: string;   
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [icebreakerRate, setIcebreakerRate] = useState<number>(0);
  const [worshipRate, setWorshipRate] = useState<number>(0);
  const [wordRate, setWordRate] = useState<number>(0);


  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);

  function handleSubmit(formData: FormData) {
    console.log(formData)
    setErrorMessage(null);
    setSuccessMessage(null);
    formData.set("cellId", cellId);

    formData.set("icebreaker_rate", String(icebreakerRate));
    formData.set("worship_rate", String(worshipRate));
    formData.set("word_rate", String(wordRate));


    startTransition(async () => {
      const res = await createMeetingAction(formData);
      if (!res.success) {
        setErrorMessage(res.message ?? "Erro ao enviar.");
        return;
      }

      setSuccessMessage("Relatório enviado com sucesso.");
      setIsOpen(false);

      (document.getElementById("meeting-form") as HTMLFormElement | null)?.reset();

      setIcebreakerRate(0);
      setWorshipRate(0);
      setWordRate(0);

      router.refresh();
    });
  }

  return (
    <div
      className={`rounded-md ${
        isOpen ? "border border-white/10 bg-white/3" : ""
      }`}
    >
      <div className={`flex w-full ${isOpen? "justify-start":"justify-center" }`}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={` cursor-pointer rounded-md border px-3 py-2 text-sm font-medium transition hover:bg-white/5 ${
          isOpen ? "border-transparent" : "border-white/10 w-full"
        }`}
      >
        {!isOpen ? "+ Novo relatório" : "X Fechar"}
      </button>
      </div>

      {successMessage && (
        <div className="mt-3 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
          <p className="text-emerald-300 text-sm">{successMessage}</p>
        </div>
      )}

      {isOpen && (
        <form
          id="meeting-form"
          action={handleSubmit}
          className="mt-4 grid gap-4 p-3 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <h3 className="text-sm font-semibold">Informações da reunião</h3>
            <p className="text-xs text-muted-foreground">
              Preencha os dados principais e avalie os momentos da reunião.
            </p>
          </div>

          <div className="sm:col-span-1">
            <label className="text-sm font-medium">Data da reunião</label>
            <input
              className="mt-1 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm"
              type="date"
              name="occurred_at"
              required
            />
          </div>

          <div className="sm:col-span-1">
            <label className="text-sm font-medium">Líder</label>
            <input
              className="mt-1 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm"
              readOnly
              type="text"
              value={leaderName ?? ""}
              placeholder="Sem líder definido"
            />
            <input
              type="hidden"
              name="leader_user_id"
              value={leaderUserId ?? ""}
            />
          </div>

          <div className="sm:col-span-1">
            <label className="text-sm font-medium">Líder em treinamento</label>
            <input
              className="mt-1 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm"
              type="text"
              name="assistant_user_id"
              placeholder="Nome do aprendiz"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="text-sm font-medium">Anfitrião</label>
            <input
              className="mt-1 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm"
              type="text"
              name="host_user_id"
              placeholder="Nome do anfitrião"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="text-sm font-medium">Qtd. de membros</label>
            <input
              className="mt-1 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm"
              type="number"
              name="members_count"
              min={0}
              placeholder="0"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="text-sm font-medium">Presentes na reunião</label>
            <input
              className="mt-1 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm"
              type="number"
              name="attendees_count"
              min={0}
              placeholder="0"
            />
          </div>

          <div className="sm:col-span-2 mt-2">
            <div className="rounded-md border border-white/10 bg-white/[0.02] p-3">
              <div className="mb-3">
                <h4 className="text-sm font-semibold">Avaliações</h4>
                <p className="text-xs text-muted-foreground">De 0 a 5 estrelas.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-sm font-medium">Quebra-gelo</label>
                  <div className="mt-2">
                    <StarRating value={icebreakerRate} onChange={setIcebreakerRate} />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Louvor</label>
                  <div className="mt-2">
                    <StarRating value={worshipRate} onChange={setWorshipRate} />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Palavra</label>
                  <div className="mt-2">
                    <StarRating value={wordRate} onChange={setWordRate} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:col-span-1">
            <label className="text-sm font-medium">
              Presentes no culto de domingo
            </label>
            <input
              className="mt-1 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm"
              type="number"
              name="sunday_attendance_count"
              min={0}
              placeholder="0"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="text-sm font-medium">Visitantes</label>
            <input
              className="mt-1 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm"
              type="number"
              name="visitors_count"
              min={0}
              placeholder="0"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Anotações (opcional)</label>
            <textarea
              className="mt-1 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm"
              name="notes"
              rows={4}
            />
          </div>

          {errorMessage && (
            <div className="sm:col-span-2 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2">
              <p className="text-red-300 text-sm">{errorMessage}</p>
            </div>
          )}

          <div className="sm:col-span-2 pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="w-full cursor-pointer bg-blue-500/10 rounded-md border border-white/10 px-3 py-2 text-sm font-medium transition hover:bg-blue-500/30 disabled:opacity-50"
            >
              {isPending ? "Enviando..." : "Enviar relatório"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}