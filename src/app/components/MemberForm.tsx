"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

function isValidCPF(cpfRaw: string) {
  const cpf = onlyDigits(cpfRaw);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calc = (base: string, factor: number) => {
    let total = 0;
    for (let i = 0; i < base.length; i++) total += Number(base[i]) * (factor - i);
    const mod = (total * 10) % 11;
    return mod === 10 ? 0 : mod;
  };

  const d1 = calc(cpf.slice(0, 9), 10);
  const d2 = calc(cpf.slice(0, 10), 11);
  return d1 === Number(cpf[9]) && d2 === Number(cpf[10]);
}

function isValidPhoneBR(phoneRaw: string) {
  // aceita 10 ou 11 dígitos (com/sem DDD)
  const p = onlyDigits(phoneRaw);
  return p.length === 10 || p.length === 11;
}

function maskCPF(value: string) {
  const d = onlyDigits(value).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
}

function maskPhoneBR(value: string) {
  const d = onlyDigits(value).slice(0, 11);

  if (d.length <= 10) {
    return d
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/^(\(\d{2}\)\s\d{4})(\d)/, "$1-$2");
  }

  return d
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/^(\(\d{2}\)\s\d{5})(\d)/, "$1-$2");
}

export function MemberForm() {
  const { getToken } = useAuth();
  const [form, setForm] = useState({
    birth_date: "",
    gender: "",
    baptized: false,

    cpf: "",
    phone: "",
    accept_privacy: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const canSubmit =
    !!form.birth_date &&
    !!form.gender &&
    form.accept_privacy &&
    !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(false);

    if (form.cpf.trim() && !isValidCPF(form.cpf)) {
      setLoading(false);
      setError("CPF inválido. Confira e tente novamente.");
      return;
    }

    if (form.phone.trim() && !isValidPhoneBR(form.phone)) {
      setLoading(false);
      setError("Telefone inválido. Use DDD + número (10 ou 11 dígitos).");
      return;
    }

    if (!form.accept_privacy) {
      setLoading(false);
      setError("Você precisa aceitar a Política de Privacidade para continuar.");
      return;
    }

    const token = await getToken({ template: "member_jwt" });

    const payload = {
      birth_date: form.birth_date,
      gender: form.gender,
      baptized: form.baptized,

      cpf: form.cpf.trim() ? onlyDigits(form.cpf) : null,
      phone: form.phone.trim() ? onlyDigits(form.phone) : null,
      accept_privacy: form.accept_privacy,
      accept_privacy_at: new Date().toISOString(), 
    };

    const res = await fetch("/api/me/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      await fetch("/api/me/upgrade-to-member", { method: "POST" });
      setSuccess(true);

      setTimeout(() => {
        window.location.reload();
      }, 800);
    } else {
      setError("Não foi possível salvar. Tente novamente.");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            <option value="N">Outro</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">
            CPF <span className="text-xs text-white/50">(opcional)</span>
          </label>
          <input
            inputMode="numeric"
            autoComplete="off"
            placeholder="000.000.000-00"
            maxLength={14}
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: maskCPF(e.target.value) })}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/20 focus:bg-black/50"
          />
          <p className="text-xs text-white/50">
            Necessário para identificação e emissão de certificados.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">
            Telefone
          </label>
          <input
            inputMode="tel"
            autoComplete="tel"
            placeholder="(62) 99999-8888"
            value={form.phone}
            maxLength={15}
            onChange={(e) => setForm({ ...form, phone: maskPhoneBR(e.target.value) })}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/20 focus:bg-black/50"
          />
          <p className="text-xs text-white/50">
            Ex: 11999998888
          </p>
        </div>
      </div>

      <div className="flex flex-row items-center">
        <label
          htmlFor="baptized"
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <input
            type="checkbox"
            checked={form.baptized}
            onChange={(e) => setForm({ ...form, baptized: e.target.checked })}
            id="baptized"
            className="h-4 w-4 rounded border-white/20 text-black bg-black/40 accent-black cursor-pointer"
          />

          <div className="flex flex-col">
            <p className="text-sm font-medium text-white/90">Batizado</p>
            <p className="text-xs text-gray-300">Marque se for batizado</p>
          </div>
        </label>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/6 px-4 py-3">
        <label
          htmlFor="accept_privacy"
          className="flex items-start gap-3 cursor-pointer select-none"
        >
          <input
            id="accept_privacy"
            type="checkbox"
            checked={form.accept_privacy}
            onChange={(e) =>
              setForm({ ...form, accept_privacy: e.target.checked })
            }
            className="mt-1 h-4 w-4 rounded border-white/20 text-black bg-black/40 accent-black cursor-pointer"
            required
          />

          <p className="text-sm text-white/90">
            Eu li e aceito a{" "}
            <Link
              href="/politica-de-privacidade"
              target="_blank"
              className="underline underline-offset-4 hover:opacity-90 cursor-pointer"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </label>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3">
          <p className="text-sm text-rose-200">{error}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
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