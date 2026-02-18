"use client";

import { ArrowRight, Clock } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

type ScheduleItem = {
  day: string;
  title: string | string[];
  time?: string;
};

const SCHEDULE: ScheduleItem[] = [
  {
    day: "Segunda",
    title: "Visitas e Orações nas Casas",
  },
  {
    day: "Terça",
    title: "Estudos | Discipulados",
  },
  {
    day: "Quarta",
    title: "Células",
  },
  {
    day: "Quinta",
    title: "Escola de Líderes | Cursos | Ensaios",
  },
  {
    day: "Sexta",
    title: [
      "Visitas e Orações nas Casas",
      "1ª sexta do mês: Empreendendo com Cristo",
      "Toda última sexta do mês: Culto de Homens",
      "3ª sexta do mês: Culto das Mulheres"
    ],
  },
  {
    day: "Sábado",
    title: [
      "4º Sábado do mês: Culto de Jovens"
    ],
  },
  {
    day: "Domingo",
    title: ["09h - Culto de Celebração",
      "19h - Culto Resgate",
      "Culto de Ceia todo primeiro domingo do mês"],
  },
];

export default function WeeklySchedule() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      viewport={{ once: true, amount: 0.2 }}
      className="w-full py-36 px-6 "
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-white/60">
            Programação semanal
          </p>
          <h2 className="mt-3 text-2xl md:text-4xl font-semibold tracking-tight text-white">
            Nossos encontros
          </h2>
          <p className="mt-2 text-sm md:text-base text-white/70">
            Caminhe conosco durante a semana.
          </p>
        </div>

        {/* Schedule */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SCHEDULE.map((item) => (
              <div
                key={item.day}
                className="flex items-start gap-4 rounded-xl border border-white/10 bg-black/30 p-4"
              >
                {/* Icon */}
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                  <Clock className="h-5 w-5 text-white/80" />
                </div>

                {/* Text */}
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-white">
                    {item.day}
                  </span>

                  {Array.isArray(item.title) ? (
                    <ul className="list-disc list-inside marker:text-white/40 text-sm text-white/80 space-y-1">
                      {item.title.map((t, index) => (
                        <li key={index}>{t}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm text-white/80">
                      {item.title}
                    </span>
                  )}

  {item.time && (
    <span className="text-xs text-white/60">
      {item.time}
    </span>
  )}
</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col w-full p-2 items-center justify-center mt-4 md:mt-12">
          <Link
                href="/agenda"
                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-xs md:text-sm font-semibold text-black bg-zinc-200 hover:bg-zinc-100 transition"
              >
                <p>Ver agenda</p>
                <ArrowRight className="w-4 h-4" />
              </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}