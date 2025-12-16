"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  Drama,
  GraduationCap,
  Flame,
  Users,
  Music,
  BriefcaseBusiness,
  HandHeart,
  Sparkles,
} from "lucide-react";

type Ministry = {
  name: string;
  description?: string;
  imageSrc: string; // mock por enquanto
  icon: React.ReactNode;
  badge?: string;
};

const MINISTRIES: Ministry[] = [
  {
    name: "Teatro",
    description: "Arte que comunica o evangelho.",
    imageSrc: "/images/teatro.png",
    icon: <Drama className="h-5 w-5" />,
  },
  {
    name: "Escola de Líderes",
    description: "Formação e preparo para servir com excelência.",
    imageSrc: "/images/escola-lideres.png",
    icon: <GraduationCap className="h-5 w-5" />,
    badge: "Formação",
  },
  {
    name: "Rede Fire",
    description: "Discipulado e avivamento para os jovens.",
    imageSrc: "/images/rede-fire.png",
    icon: <Flame className="h-5 w-5" />,
  },
  {
    name: "Rede de Mulheres",
    description: "Edificação, cuidado e fortalecimento.",
    imageSrc: "/images/mulheres.png",
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: "Ministério de Adoração APE",
    description: "Louvor e adoração na presença de Deus.",
    imageSrc: "/images/adoracao.png",
    icon: <Music className="h-5 w-5" />,
    badge: "Adoração",
  },
  {
    name: "Empreendendo com Cristo",
    description: "Trabalho com princípios.",
    imageSrc: "/images/empreendendo.png",
    icon: <BriefcaseBusiness className="h-5 w-5" />,
  },
  {
    name: "Casas de Paz",
    description: "Evangelismo e cuidado nas casas.",
    imageSrc: "/images/casas-de-paz.png",
    icon: <HandHeart className="h-5 w-5" />,
    badge: "Missão",
  },
  {
    name: "Acolhimento & Integração",
    description: "Receber bem e conectar pessoas.",
    imageSrc: "/images/acolhimento.png",
    icon: <Sparkles className="h-5 w-5" />,
  },
];

export default function MinistriesGrid() {
  return (
    <section className="w-full bg-black py-16 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-white/60">
            Aqui você encontra
          </p>
          <h2 className="mt-3 text-2xl md:text-4xl font-semibold tracking-tight text-white">
            Ministérios & Departamentos
          </h2>
          <p className="mt-2 text-sm md:text-base text-white/70">
            Descubra onde você pode se envolver e servir na igreja.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {MINISTRIES.map((m) => (
            <motion.div
              key={m.name}
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40"
            >

              <div className="relative w-full aspect-4/5 md:aspect-16/10">
                <Image
                  src={m.imageSrc}
                  alt={m.name}
                  fill
                  priority={false}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 360px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-500" />

                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 text-white/90 backdrop-blur">
                      {m.icon}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm md:text-base font-semibold text-white truncate">
                        {m.name}
                      </p>
                      {m.badge ? (
                        <span className="mt-1 inline-flex w-fit rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold text-white/80 ring-1 ring-white/15">
                          {m.badge}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {m.description ? (
                  <p className="mt-3 text-sm text-white/75 leading-relaxed line-clamp-2">
                    {m.description}
                  </p>
                ) : null}
              </div>

              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background:
                    "radial-gradient(700px circle at 20% 20%, rgba(255,255,255,0.10), transparent 45%)",
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}