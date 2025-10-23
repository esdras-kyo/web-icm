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
      // depois de salvar, faz o upgrade
      await fetch("/api/me/upgrade-to-member", { method: "POST" });
      setSuccess(true);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <div>
        <label className="block text-sm font-medium">Data de nascimento</label>
        <input
          type="date"
          value={form.birth_date}
          onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Gênero</label>
        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Selecione</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={form.baptized}
          onChange={(e) => setForm({ ...form, baptized: e.target.checked })}
          id="baptized"
        />
        <label htmlFor="baptized">Batizado</label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Enviando..." : "Salvar e concluir"}
      </button>

      {success && (
        <p className="text-green-600 text-sm mt-2">
          Informações salvas! Você agora é membro 🎉
        </p>
      )}
    </form>
  );
}