"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export function MemberForm() {
  const { getToken } = useAuth();
  const [form, setForm] = useState({
    birth_date: "",
    gender: "",
    baptized: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const token = await getToken({ template: "member_jwt" });

    const res = await fetch("/api/me/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      await fetch("/api/me/upgrade-to-member", { method: "POST" });
      setSuccess(true);

      setTimeout(() => {
        window.location.reload();
      }, 800);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">
            Data de nascimento
          </label>
          <div className="relative">
            <input
              type="date"
              value={form.birth_date}
              onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/20 focus:bg-black/50"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">
            Gênero
          </label>
          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/20 focus:bg-black/50"
            required
          >
            <option value="">Selecione</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>
      </div>

      <div className="flex flex-row items-center">
        <label htmlFor="baptized" className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.baptized}
            onChange={(e) => setForm({ ...form, baptized: e.target.checked })}
            id="baptized"
            className="h-4 w-4 rounded border-white/20 text-black bg-black/40 accent-black cursor-pointer"
          />

            <p className="text-sm font-medium text-white/90">Batizado</p>
            <p className="text-xs text-gray-300">Marque se for batizado</p>

        </label>
      </div>

      {/* Ações */}
      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/15 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span className="h-4 w-4 rounded-full border border-white/30 border-t-white/80 animate-spin" />
              Enviando...
            </span>
          ) : (
            "Salvar e concluir"
          )}
        </button>

        {success ? (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
            <p className="text-sm text-emerald-200">
              Informações salvas! Você agora é membro 🎉
            </p>
          </div>
        ) : null}
      </div>
    </form>
  );
}