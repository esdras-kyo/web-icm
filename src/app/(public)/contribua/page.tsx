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
import Footer from "@/app/components/Footer";
import HeroCenter from "@/app/components/HeroCenter";

type DirectedDonation = {
  name: string;
  contact: string; // telefone/email
  purpose: string;
  method: "PIX" | "Depósito" | "Em espécie";
  amount?: string; // opcional
  message?: string; // opcional
};

const WHATS_NUMBER = process.env.NEXT_PUBLIC_WHATS_NUMBER

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex items-center gap-4 my-10">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white text-center">
        {children}
      </h2>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-white/20 to-transparent" />
    </div>
  );
}

export function CopyableRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-3">
      <div className="md:min-w-28 text-xs md:text-sm text-white/70">{label}</div>
      <div className="flex-1 truncate text-sm md:text-base text-white">
        {value}
      </div>
      <button
        className="inline-flex items-center gap-2 text-xs md:text-sm text-white/60 bg-zinc-900/90 rounded-md px-3 py-2 font-medium cursor-pointer hover:bg-zinc-800 hover:text-white transition"
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
  const pixKey = "04.391.808/0001-06";
  return (
    <div className="rounded-2xl p-6 md:p-8 bg-white/[0.03] ring-1 ring-white/10">
      <div className="flex items-center gap-3 text-white">
        <div className="p-2 rounded-xl bg-white/10">
          <QrCode className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-semibold">
            Contribua via PIX
          </h3>
          <p className="text-xs md:text-sm text-white/60">
            Forma rápida e segura de contribuir de onde você estiver.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {/* QR no topo */}
        <div className="rounded-2xl overflow-hidden bg-black/40 ring-1 ring-white/10 grid place-items-center max-w-xs mx-auto">
          <Image
            src="/images/qrcode.jpeg"
            alt="QR PIX"
            className="w-full h-full object-contain p-4"
            width={430}
            height={400}
          />
        </div>

        <div className="flex flex-col gap-3">
          <CopyableRow label="Chave PIX (CNPJ)" value={pixKey} />
        </div>
      </div>
    </div>
  );
}

// function BankCard() {
//   return (
//     <div className="rounded-2xl p-6 md:p-8 bg-white/[0.03] ring-1 ring-white/10">
//       <div className="flex items-center gap-3 text-white">
//         <div className="p-2 rounded-xl bg-white/10">
//           <Banknote className="w-6 h-6" />
//         </div>
//         <div>
//           <h3 className="text-lg md:text-xl font-semibold">
//             Depósito / Transferência
//           </h3>
//           <p className="text-xs md:text-sm text-white/60">
//             Use os dados bancários abaixo para contribuir.
//           </p>
//         </div>
//       </div>
//       <div className="mt-5 grid grid-cols-1 gap-3">
//         <CopyableRow label="Banco" value="Itaú (341)" />
//         <CopyableRow label="Agência" value="1234" />
//         <CopyableRow label="Conta" value="12345-6" />
//         <CopyableRow label="Titular" value="Igreja de Cristo Maranata" />
//         <CopyableRow label="CNPJ" value="12.345.678/0001-90" />
//       </div>
//     </div>
//   );
// }

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

    try {
      await fetch("/api/directed-donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(form),
      }).catch(() => {});
    } catch {}

    window.open(wa, "_blank");
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/80 to-slate-950/95">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(248,113,113,0.18),transparent_60%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.18),transparent_55%)]" />
      <div className="relative p-6 md:p-8">
        <div className="flex items-center gap-3 text-white">
          <div className="p-2 rounded-xl bg-white/10">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-semibold">
              Oferta direcionada
            </h3>
            <p className="text-xs md:text-sm text-white/70">
              Se você deseja abençoar uma família, projeto social ou propósito
              específico, nos avise por aqui.
            </p>
          </div>
        </div>

        <p className="text-white/75 text-sm mt-4 max-w-2xl">
          Preencha com seus dados e o propósito da oferta. Vamos retornar para
          alinhar a melhor forma de encaminhar a ajuda.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="col-span-1">
            <label className="block text-sm text-white/80 mb-1">Seu nome</label>
            <input
              required
              className="w-full rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm md:text-base text-white outline-none focus:ring-white/30"
              value={form.name}
              onChange={(e) =>
                setForm((s) => ({ ...s, name: e.target.value }))
              }
              placeholder="Seu nome"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm text-white/80 mb-1">
              Contato (whatsapp/email)
            </label>
            <input
              required
              className="w-full rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm md:text-base text-white outline-none focus:ring-white/30"
              value={form.contact}
              onChange={(e) =>
                setForm((s) => ({ ...s, contact: e.target.value }))
              }
              placeholder="(62) 9 9999-9999 ou seu@email"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm text-white/80 mb-1">
              Propósito
            </label>
            <select
              required
              className="w-full rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm md:text-base text-white outline-none focus:ring-white/30"
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

          <div className="col-span-1">
            <label className="block text-sm text-white/80 mb-1">
              Forma pretendida
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["PIX", "Depósito", "Em espécie"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setForm((s) => ({ ...s, method: m }))}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-xs md:text-sm border transition ${
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

          <div className="col-span-1">
            <label className="block text-sm text-white/80 mb-1">
              Valor (opcional)
            </label>
            <input
              className="w-full rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm md:text-base text-white outline-none focus:ring-white/30"
              value={form.amount}
              onChange={(e) =>
                setForm((s) => ({ ...s, amount: e.target.value }))
              }
              placeholder="ex.: R$ 150,00"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm text-white/80 mb-1">
              Mensagem (opcional)
            </label>
            <textarea
              className="w-full rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm md:text-base text-white outline-none focus:ring-white/30 min-h-24"
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
              className="cursor-pointer inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-emerald-400 text-black font-medium text-sm md:text-base hover:bg-emerald-300 transition"
            >
              <Phone className="w-4 h-4" />
              Conversar no WhatsApp
            </a>

            <button
              type="submit"
              className="cursor-pointer inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/15 text-sm md:text-base"
              title="(Opcional) registra os dados e abre o WhatsApp"
            >
              <SendHorizonal className="w-4 h-4" />
              Enviar e abrir WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ContribuicaoPage() {
  return (
    <main className="min-h-dvh w-full bg-slate-950 text-white flex flex-col">
      <HeroCenter 
        churchName="Contribuição"
        mission="Generosidade com propósito"
      /> 

      <div className="mx-auto max-w-6xl px-4 md:px-6 py-10 md:py-16 w-full">
        {/* Card pai das formas de contribuição */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/80 to-slate-950/95 shadow-xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(248,113,113,0.14),transparent_60%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.16),transparent_55%)]" />
          <div className="relative p-6 md:p-10">
            <SectionTitle>Formas de contribuição</SectionTitle>

            <div className="grid grid-cols-1 gap-6">
              <PixCard />
              {/* <BankCard /> */}
            </div>
          </div>
        </div>

        <SectionTitle>Oferta direcionada</SectionTitle>
        <DirectedDonationForm />

        <div className="mt-10 text-center text-white/60 text-xs md:text-sm">
          Dúvidas? Fale com a secretaria:{" "}
          <a
            className="underline underline-offset-4 hover:text-white cursor-pointer"
            href={`https://wa.me/${WHATS_NUMBER}`}
            target="_blank"
          >
            {`WhatsApp ${WHATS_NUMBER}`}
          </a>
        </div>
      </div>
      <Footer />
    </main>
  );
}