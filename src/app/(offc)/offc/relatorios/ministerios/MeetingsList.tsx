"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { } from "../page";

export type MeetingRow = {
  id: string;
  department_id: string | null;
  title: string | null;
  created_at: string | null;
};

export type DepartmentMini = {
  id: string;
  name: string | null;
};

function formatDateTimeBR(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(d);
}

export function MeetingsListClient({
  meetings,
  departments,
}: {
  meetings: MeetingRow[];
  departments: DepartmentMini[];
}) {
  const [q, setQ] = useState("");

  const departmentsById = useMemo(() => {
    return new Map(departments.map((d) => [d.id, d]));
  }, [departments]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return meetings;

    return meetings.filter((m) => {
      const title = (m.title ?? "").toLowerCase();
      const deptName =
        (m.department_id ? departmentsById.get(m.department_id)?.name : "") ?? "";
      return title.includes(query) || deptName.toLowerCase().includes(query);
    });
  }, [q, meetings, departmentsById]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome da reunião ou ministério..."
          className="w-full sm:w-[360px]"
        />

        <div className="text-xs text-muted-foreground">
          {filtered.length} de {meetings.length}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-white/10 p-6 text-center text-sm text-muted-foreground">
          Nenhum relatório encontrado.
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((m) => {
            const deptName =
              (m.department_id ? departmentsById.get(m.department_id)?.name : null) ??
              "Sem ministério";

            const title = m.title?.trim() || "Reunião (sem título)";
            const date = m.created_at ? formatDateTimeBR(m.created_at) : "—";

            return (
              <li
                key={m.id}
                className="rounded-lg border border-white/10 bg-white/e p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{title}</div>
                    <div className="mt-1 text-xs text-muted-foreground truncate">
                      {deptName} • {date}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Link href={`/offc/relatorios/ministerios/${encodeURIComponent(m.id)}`}>
                      <Button size="sm" className="cursor-pointer">
                        Ler
                      </Button>
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}