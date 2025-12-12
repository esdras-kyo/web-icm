"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText, CalendarDays } from "lucide-react";

type AgendaRow = {
  id: string;
  title: string;
  description?: string | null;
  event_date: string;       // YYYY-MM-DD
  event_time?: string | null;
  department_id?: string;   // <- use se tiver
  department_name?: string; // <- use se tiver
};

type FileRow = {
  id: string;
  title: string | null;
  file_key: string;
  created_at: string;
};

export default function HomeClient({
  agenda,
  files,
}: {
  agenda: AgendaRow[];
  files: FileRow[];

}) {
  return (
    <div className="min-h-dvh w-full text-white pb-12 ">
      <div className="sticky top-0 z-10 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-5 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Área do Líder</h1>
          </div>

          <div className="flex max-w-sm items-center gap-2 mt-2 md:mt-0">
            <Link href="/leader/agenda" className="cursor-pointer">
              <Button variant="secondary" className="cursor-pointer gap-2">
                <CalendarDays className="h-2 w-2 md:h-4 md:w-4" /> Agenda
              </Button>
            </Link>
            <Link href="/leader/files" className="cursor-pointer">
              <Button variant="secondary" className="cursor-pointer gap-2">
                <FileText className="h-2 w-2 md:h-4 md:w-4" /> Materiais
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 space-y-8">
        {/* KPIs read-only */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<CalendarDays className="h-4 w-4" />} label="Próx. eventos" value={agenda.length} href="/leader/agenda" />
          <StatCard icon={<FileText className="h-4 w-4" />} label="Materiais recentes" value={files.length} href="/leader/files" />
        </div>

        {/* Próximos eventos por departamento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Panel title="Próximos eventos" href="/leader/agenda">
            {agenda.length === 0 ? (
              <Empty mini text="Nenhum evento próximo." actionHref="/leader/agenda" actionText="Ver agenda" />
            ) : (
              <ul className="space-y-2">
                {agenda.map((ev) => {
                  const date = new Date(ev.event_date + "T00:00:00");
                  const ds = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
                  const deptHref = ev.department_id
                    ? `/leader/departments/${ev.department_id}/agenda`
                    : "/leader/agenda";
                  return (
                    <li key={ev.id} className="rounded-lg border border-white/10 p-3 bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-white/10 text-zinc-200">{ds}</Badge>
                        <span className="truncate font-medium">{ev.title}</span>
                        <Link href={deptHref} className="ml-auto text-xs text-zinc-400 hover:underline cursor-pointer">
                          {ev.department_name ? `Agenda • ${ev.department_name}` : "Ver agenda"}
                        </Link>
                      </div>
                      {ev.description ? <p className="mt-1 text-xs text-zinc-400 line-clamp-2">{ev.description}</p> : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          {/* Materiais recentes (somente leitura) */}
          <Panel title="Materiais recentes" href="/leader/files">
            {files.length === 0 ? (
              <Empty mini text="Nenhum material recente." actionHref="/leader/files" actionText="Ver materiais" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <AnimatePresence>
                  {files.map((f, idx) => {
                    const title = f.title || f.file_key;
                    const date = new Date(f.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).replace(/\./g, "");
                    return (
                      <motion.div
                        key={f.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18, delay: idx * 0.03 }}
                        className="rounded-lg border border-white/10 p-3 bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-blue-500/15 text-blue-300">PDF</Badge>
                          <span className="ml-auto text-[11px] text-zinc-400">{date}</span>
                        </div>
                        <div className="mt-1 text-sm truncate" title={title}>{title}</div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: number | string; href: string }) {
  return (
    <Link href={href} className="cursor-pointer">
      <div className="rounded-2xl border border-white/10 p-4 bg-zinc-900/50 hover:bg-zinc-900/70 transition-colors">
        <div className="flex items-center gap-2 text-zinc-300 text-xs">{icon}<span>{label}</span></div>
        <div className="mt-2 text-2xl font-semibold">{value ?? "—"}</div>
      </div>
    </Link>
  );
}

function Panel({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 p-4 bg-zinc-900/40">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg font-medium">{title}</h2>
        <Link href={href} className="ml-auto text-xs text-zinc-400 hover:underline inline-flex items-center gap-1 cursor-pointer">
          Ver tudo <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
      {children}
    </div>
  );
}

function Empty({ text, actionHref, actionText, mini = false }: { text: string; actionHref: string; actionText: string; mini?: boolean }) {
  return (
    <div className={`rounded-xl border border-white/10 ${mini ? "p-6" : "p-10"} text-center text-zinc-400 bg-zinc-900/30`}>
      <p className="text-sm">{text}</p>
      <Link href={actionHref} className="inline-block mt-3 cursor-pointer">
        <Button variant="secondary" className="cursor-pointer gap-2">
          {actionText}
        </Button>
      </Link>
    </div>
  );
}