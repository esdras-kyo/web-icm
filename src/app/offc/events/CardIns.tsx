"use client";

import { useState } from "react";

export type Inscrito = {
  id: string;
  name: string;
  cpf: string;
  telefone: string;
  email: string;
  payment_status: "pending" | "paid" | "failed" | string;
  created_at: string;
};

export default function InscritoCard({ inscrito }: { inscrito: Inscrito }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(inscrito.payment_status);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const createdDate = new Date(inscrito.created_at);
  const dataFormatada = createdDate.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusLabel =
    status === "paid"
      ? "Pagamento confirmado"
      : status === "pending"
      ? "Aguardando pagamento"
      : "Pagamento falhou";

  const statusColor =
    status === "paid"
      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40"
      : status === "pending"
      ? "bg-amber-500/10 text-amber-200 border-amber-500/40"
      : "bg-red-500/10 text-red-200 border-red-500/40";

  async function handleChangeStatus(newStatus: "pending" | "paid" | "failed") {
    if (newStatus === status) return;

    setSaving(true);
    setErrorMsg("");

    const prev = status;
    setStatus(newStatus);

    try {
      const res = await fetch("/api/registrations/set-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: inscrito.id,
          payment_status: newStatus,
        }),
      });

      if (!res.ok) {
        setStatus(prev);
        const body = await res.json().catch(() => ({}));
        setErrorMsg(body?.error || "Falha ao atualizar status");
      }
    } catch (err) {
      console.error(err);
      setStatus(prev);
      setErrorMsg("Erro de rede ao atualizar status");
    } finally {
      setSaving(false);
    }
  }

  return (
    <li className="w-full rounded-xl border border-zinc-700 bg-zinc-900/40 p-4 hover:bg-zinc-800/60 transition-all duration-150 text-white">
      <button
        type="button"
        className="w-full flex items-center justify-between gap-3 text-left"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-base md:text-lg font-semibold">
            {inscrito.name}
          </h2>

          <span
            className={`inline-block text-[11px] px-2 py-1 rounded-full border ${statusColor}`}
          >
            {statusLabel}
          </span>
        </div>

        <span className="text-xs text-zinc-400">
          {open ? "Fechar detalhes ▲" : "Ver detalhes ▼"}
        </span>
      </button>

      {open && (
        <div className="mt-3 border-t border-zinc-700/70 pt-3 text-xs md:text-sm space-y-2 text-zinc-200">
          <p>
            <span className="font-semibold text-zinc-300">CPF: </span>
            {inscrito.cpf || "-"}
          </p>
          <p>
            <span className="font-semibold text-zinc-300">Telefone: </span>
            {inscrito.telefone || "-"}
          </p>
          <p>
            <span className="font-semibold text-zinc-300">E-mail: </span>
            {inscrito.email || "-"}
          </p>
          <p>
            <span className="font-semibold text-zinc-300">
              Data da inscrição:{" "}
            </span>
            {dataFormatada}
          </p>

          <div className="mt-3 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide text-zinc-400">
              Status do pagamento
            </span>
            <div className="inline-flex items-center gap-2">
              <select
                value={status}
                disabled={saving}
                onChange={(e) =>
                  handleChangeStatus(
                    e.target.value as "pending" | "paid" | "failed"
                  )
                }
                className="rounded-md bg-black/60 border border-zinc-600 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="pending">Aguardando pagamento</option>
                <option value="paid">Pagamento confirmado</option>
                <option value="failed">Pagamento falhou</option>
              </select>

              {saving && (
                <span className="text-[11px] text-zinc-400">Salvando...</span>
              )}
            </div>
            {errorMsg && (
              <span className="text-[11px] text-red-400">{errorMsg}</span>
            )}
          </div>
        </div>
      )}
    </li>
  );
}