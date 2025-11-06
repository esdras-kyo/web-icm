"use client";
import { useMemo, useState } from "react";
import {
  Copy,
  Check,
  QrCode,
  Banknote,
  SendHorizonal,
  Phone,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";

type DirectedDonation = {
  name: string;
  contact: string; // telefone/email
  purpose: string;
  method: "PIX" | "Depósito" | "Em espécie";
  amount?: string; // opcional
  message?: string; // opcional
};

const WHATS_NUMBER = process.env.NEXT_PUBLIC_WHATS_NUMBER || "5562999999999"; // coloque DDI+DDD+numero

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex items-center gap-4 my-8">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white text-center">
        {children}
      </h2>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-white/25 to-transparent" />
    </div>
  );
}

function CopyableRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
      <div className="min-w-28 text-white/70">{label}</div>
      <div className="flex-1 truncate text-white">{value}</div>
      <button
        className="inline-flex items-center gap-2 text-white/50 bg-zinc-800 rounded-md px-3 py-2 text-sm font-medium cursor-pointer"
        onClick={async () => {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? "Copiado!" : "Copiar"}
      </button>
    </div>
  );
}

function PixCard() {
  // substitua pelos dados reais
  const pixKey = "contato@igrejaicm.org.br"; // e.g., e-mail/aleatória/CNPJ
  return (
    <div className="rounded-2xl p-6 md:p-8 bg-white/[0.04] ring-1 ring-white/10 my-8">
      <div className="flex items-center gap-3 text-white">
        <div className="p-2 rounded-xl bg-white/10">
          <QrCode className="w-6 h-6" />
        </div>
        <h3 className="text-lg md:text-xl font-semibold">Contribua via PIX</h3>
      </div>

      {/* Trocar todo o container por este */}
      <div className="mt-5 flex flex-col gap-4">
        {/* QR no topo */}
        <div className="rounded-xl overflow-hidden bg-white/5 ring-1 ring-white/10 grid place-items-center max-w-[260px] mx-auto">
          <Image
            src="/images/pix-qr-exemplo.png"
            alt="QR PIX"
            className="w-full h-full object-contain p-4"
          />
        </div>

        <div className="flex flex-col gap-3">
          <CopyableRow label="Chave PIX" value={pixKey} />
        </div>
      </div>
    </div>
  );
}

function BankCard() {
  return (
    <div className="rounded-2xl p-6 md:p-8 bg-white/[0.04] ring-1 ring-white/10">
      <div className="flex items-center gap-3 text-white">
        <div className="p-2 rounded-xl bg-white/10">
          <Banknote className="w-6 h-6" />
        </div>
        <h3 className="text-lg md:text-xl font-semibold">
          Dados para Depósito/Transferência
        </h3>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3">
        <CopyableRow label="Banco" value="Itaú (341)" />
        <CopyableRow label="Agência" value="1234" />
        <CopyableRow label="Conta" value="12345-6" />
        <CopyableRow label="Titular" value="Igreja de Cristo Maranata" />
        <CopyableRow label="CNPJ" value="12.345.678/0001-90" />
      </div>
    </div>
  );
}

function whatsappHrefFrom(data: DirectedDonation) {
  const lines = [
    "*Oferta direcionada*",
    `Nome: ${data.name}`,
    `Contato: ${data.contact}`,
    `Propósito: ${data.purpose}`,
    `Forma: ${data.method}`,
    data.amount ? `Valor (aprox.): ${data.amount}` : null,
    data.message ? `Mensagem: ${data.message}` : null,
  ].filter(Boolean);
  const txt = lines.join("\n");
  return `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(txt)}`;
}

function DirectedDonationForm() {
  const [form, setForm] = useState<DirectedDonation>({
    name: "",
    contact: "",
    purpose: "",
    method: "PIX",
    amount: "",
    message: "",
  });
  const wa = useMemo(() => whatsappHrefFrom(form), [form]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // (opcional) registre num backend antes de abrir o WhatsApp
    try {
      await fetch("/api/directed-donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(form),
      }).catch(() => {});
    } catch {}

    window.open(wa, "_blank"); // abre o WhatsApp
  }

  return (
    <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-br from-white/[0.06] to-white/[0.02] ring-1 ring-white/10">
      <div className="flex items-center gap-3 text-white">
        <div className="p-2 rounded-xl bg-white/10">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h3 className="text-lg md:text-xl font-semibold">Oferta direcionada</h3>
      </div>

      <p className="text-white/80 text-sm mt-3">
        Se você deseja ofertar para algum propósito específico, nos comunique o
        objetivo e como deseja contribuir.
      </p>
      <p className="text-white/70 text-sm">
        Sua oferta direcionada pode abençoar famílias (alimento, roupas, ajuda
        financeira etc.). Combine conosco a melhor forma de abençoar.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="col-span-1 md:col-span-1">
          <label className="block text-sm text-white/80 mb-1">Seu nome</label>
          <input
            required
            className="w-full rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2 text-white outline-none focus:ring-white/30"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            placeholder="Seu nome"
          />
        </div>

        <div className="col-span-1 md:col-span-1">
          <label className="block text-sm text-white/80 mb-1">
            Contato (whatsapp/email)
          </label>
          <input
            required
            className="w-full rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2 text-white outline-none focus:ring-white/30"
            value={form.contact}
            onChange={(e) =>
              setForm((s) => ({ ...s, contact: e.target.value }))
            }
            placeholder="(62) 9 9999-9999 ou seu@email"
          />
        </div>

        <div className="col-span-1 md:col-span-1">
          <label className="block text-sm text-white/80 mb-1">Propósito</label>
          <select
            required
            className="w-full rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2 text-white outline-none focus:ring-white/30"
            value={form.purpose}
            onChange={(e) =>
              setForm((s) => ({ ...s, purpose: e.target.value }))
            }
          >
            <option value="">Selecione…</option>
            <option value="Família em necessidade">
              Família em necessidade
            </option>
            <option value="Alimento/Roupas">Alimento/Roupas</option>
            <option value="Missões">Missões</option>
            <option value="Reforma/Manutenção do templo">
              Reforma/Manutenção do templo
            </option>
            <option value="Projeto social">Projeto social</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        <div className="col-span-1 md:col-span-1">
          <label className="block text-sm text-white/80 mb-1">
            Forma pretendida
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["PIX", "Depósito", "Em espécie"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setForm((s) => ({ ...s, method: m }))}
                className={`cursor-pointer rounded-lg px-3 py-2 text-sm border ${
                  form.method === m
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-1 md:col-span-1">
          <label className="block text-sm text-white/80 mb-1">
            Valor (opcional)
          </label>
          <input
            className="w-full rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2 text-white outline-none focus:ring-white/30"
            value={form.amount}
            onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))}
            placeholder="ex.: R$ 150,00"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm text-white/80 mb-1">
            Mensagem (opcional)
          </label>
          <textarea
            className="w-full rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2 text-white outline-none focus:ring-white/30 min-h-24"
            value={form.message}
            onChange={(e) =>
              setForm((s) => ({ ...s, message: e.target.value }))
            }
            placeholder="Detalhes, prazos, itens, endereço para doação em espécie etc."
          />
        </div>

        <div className="col-span-1 md:col-span-2 flex flex-wrap items-center gap-3 mt-2">
          <a
            href={wa}
            target="_blank"
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white text-black font-medium"
          >
            <Phone className="w-4 h-4" />
            Conversar no WhatsApp
          </a>

          <button
            type="submit"
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15"
            title="(Opcional) registra os dados e abre o WhatsApp"
          >
            <SendHorizonal className="w-4 h-4" />
            Enviar e abrir WhatsApp
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ContribuicaoPage() {
  return (
    <main className="min-h-dvh w-full bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-10 md:py-14">
        <header className="text-center">
          <p className="text-white/70 text-sm">Generosidade com propósito</p>
          <h1 className="mt-1 text-3xl md:text-5xl font-extrabold tracking-tight">
            Contribuição
          </h1>
          <p className="mt-3 text-white/80 max-w-2xl mx-auto">
            Sua oferta abençoa pessoas, sustenta a obra e amplia o alcance do
            Evangelho. Escolha a forma de contribuir ou fale conosco para uma
            oferta direcionada.
          </p>
        </header>

        <SectionTitle>Formas de contribuição</SectionTitle>
        <div className="grid grid-cols-1 gap-6 md:gap-8">
          <PixCard />
          <BankCard />
        </div>

        <SectionTitle>Oferta direcionada</SectionTitle>
        <DirectedDonationForm />

        <div className="mt-10 text-center text-white/60 text-sm">
          Dúvidas? Fale com a secretaria:{" "}
          <a
            className="underline hover:text-white cursor-pointer"
            href={`https://wa.me/${WHATS_NUMBER}`}
            target="_blank"
          >
            {`WhatsApp ${WHATS_NUMBER}`}
          </a>
        </div>
      </div>
    </main>
  );
}
