"use client";

import { Clock } from "lucide-react";
import { motion } from "motion/react";

type ScheduleItem = {
  day: string;
  title: string;
  time?: string;
};

const SCHEDULE: ScheduleItem[] = [
  {
    day: "Segunda",
    title: "Visitas e Orações nas Casas",
  },
  {
    day: "Terça",
    title: "Discipulado",
  },
  {
    day: "Quarta",
    title: "Células",
  },
  {
    day: "Quinta",
    title: "Escola de Líderes e Ensaios",
  },
  {
    day: "Sexta",
    title: "Casas de Paz",
  },
  {
    day: "Sábado",
    title: "Cultos de Jovens",
    time: "Todo último sábado do mês",
  },
  {
    day: "Domingo",
    title: "Culto",
    time: "09h (manhã) · 19h (noite)",
  },
];

export default function WeeklySchedule() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      className="w-full py-16 px-6 bg-linear-to-tl from-black via-black to-sky-800/40"
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

                  <span className="text-sm text-white/80">
                    {item.title}
                  </span>

                  {item.time && (
                    <span className="text-xs text-white/60">
                      {item.time}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}