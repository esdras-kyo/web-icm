"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

interface EditProfileFormProps {
  initialPhone: string | null;
}

function formatPhone(digits: string): string {
  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3").replace(/-$/, "");
  }
  return digits.replace(/^(\d{2})(\d{5})(\d{0,4})$/, "($1) $2-$3").replace(/-$/, "");
}

function onlyDigits(v: string): string {
  return v.replace(/\D/g, "");
}

export function EditProfileForm({ initialPhone }: EditProfileFormProps) {
  const { user } = useUser();

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [nameStatus, setNameStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const [phone, setPhone] = useState(
    initialPhone ? formatPhone(initialPhone) : ""
  );
  const [phoneStatus, setPhoneStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleNameSave(e: React.FormEvent) {
    e.preventDefault();
    setNameStatus("loading");
    try {
      const res = await fetch("/api/me/update-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName }),
      });
      if (!res.ok) throw new Error();
      await user?.reload();
      setNameStatus("success");
      setTimeout(() => setNameStatus("idle"), 3000);
    } catch {
      setNameStatus("error");
      setTimeout(() => setNameStatus("idle"), 3000);
    }
  }

  async function handlePhoneSave(e: React.FormEvent) {
    e.preventDefault();
    setPhoneStatus("loading");
    try {
      const res = await fetch("/api/me/update-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) throw new Error();
      setPhoneStatus("success");
      setTimeout(() => setPhoneStatus("idle"), 3000);
    } catch {
      setPhoneStatus("error");
      setTimeout(() => setPhoneStatus("idle"), 3000);
    }
  }

  return (
    <div className="space-y-6 text-white">
      <h2 className="text-lg font-medium">Editar Dados</h2>

      {/* Nome */}
      <form
        onSubmit={handleNameSave}
        className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 space-y-4"
      >
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Nome</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm text-white/60">Primeiro nome</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
              placeholder="Seu primeiro nome"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-white/60">Sobrenome</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
              placeholder="Seu sobrenome"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          {nameStatus === "success" && (
            <p className="text-sm text-green-400">Nome atualizado com sucesso!</p>
          )}
          {nameStatus === "error" && (
            <p className="text-sm text-red-400">Erro ao salvar. Tente novamente.</p>
          )}
          {nameStatus === "idle" && <span />}

          <button
            type="submit"
            disabled={nameStatus === "loading"}
            className="shrink-0 rounded-xl px-5 py-2.5 text-sm font-medium bg-[#0c49ac] hover:bg-[#0c49ac]/80 disabled:opacity-50 cursor-pointer transition-colors"
          >
            {nameStatus === "loading" ? "Salvando..." : "Salvar nome"}
          </button>
        </div>
      </form>

      {/* Telefone */}
      <form
        onSubmit={handlePhoneSave}
        className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 space-y-4"
      >
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Contato</h3>

        <div className="space-y-1">
          <label className="text-sm text-white/60">Telefone (WhatsApp)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              const digits = onlyDigits(e.target.value).slice(0, 11);
              setPhone(digits ? formatPhone(digits) : "");
            }}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
            placeholder="(11) 91234-5678"
          />
        </div>

        <div className="flex items-center justify-between">
          {phoneStatus === "success" && (
            <p className="text-sm text-green-400">Telefone atualizado com sucesso!</p>
          )}
          {phoneStatus === "error" && (
            <p className="text-sm text-red-400">Erro ao salvar. Tente novamente.</p>
          )}
          {phoneStatus === "idle" && <span />}

          <button
            type="submit"
            disabled={phoneStatus === "loading"}
            className="shrink-0 rounded-xl px-5 py-2.5 text-sm font-medium bg-[#0c49ac] hover:bg-[#0c49ac]/80 disabled:opacity-50 cursor-pointer transition-colors"
          >
            {phoneStatus === "loading" ? "Salvando..." : "Salvar telefone"}
          </button>
        </div>
      </form>
    </div>
  );
}
