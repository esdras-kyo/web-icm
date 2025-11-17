import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircleHeart } from "lucide-react";
import { HolyRequestCard } from "./RequestCard";

export default function ContactPage() {
  return (
    <div className="min-h-dvh w-full bg-slate-950 text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/70 to-slate-950/90 shadow-xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.18),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.2),_transparent_55%)]" />

          <div className="relative p-6 md:p-10 flex flex-col gap-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                Fale Conosco
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Entre em contato
              </h1>
              <p className="text-sm md:text-base text-white/70 max-w-xl">
                Use um dos canais abaixo, será um prazer falar com você.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/50">
                      E-mail
                    </p>
                    <p className="font-semibold text-sm md:text-base">
                      esdrascamel@gmail.com
                    </p>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-white/60">
                  Assuntos gerais, pedidos de oração, dúvidas sobre cultos e
                  departamentos.
                </p>
                <Link
                  href="mailto:contato@icmsede.com.br"
                  className="inline-flex cursor-pointer items-center text-xs md:text-sm font-medium text-blue-400 hover:text-red-200 underline-offset-4 hover:underline"
                >
                  Enviar e-mail
                </Link>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/50">
                      Telefone / WhatsApp
                    </p>
                    <p className="font-semibold text-sm md:text-base">
                      (62) 9 9328-8894
                    </p>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-white/60">
                  Atendimento em horário comercial e também antes/após os
                  cultos.
                </p>
                <Link
                  href="https://wa.me/5562993288894"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex cursor-pointer items-center text-xs md:text-sm font-medium text-emerald-300 hover:text-emerald-200 underline-offset-4 hover:underline"
                >
                  Chamar no WhatsApp
                </Link>
              </div>
            </div>

            <HolyRequestCard />

            <div className="border-t border-white/10 pt-5 mt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-3 text-xs md:text-sm text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div>
                  <p className="font-medium">
                    Av. Abel Coimbra, Quadra 86, Lote 09 — Cidade Jardim
                  </p>
                  <p>Goiânia – GO</p>
                </div>
              </div>

              <Link
                href="/localizacao"
                className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs md:text-sm font-medium text-white/90 hover:bg-white/10 transition"
              >
                Ver mapa e como chegar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
