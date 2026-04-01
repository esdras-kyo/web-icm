"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { ActionForm } from "./ActionForm";

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface LeaderCandidatesListProps {
  users: User[];
  cell: { id: string; name: string };
  action: (formData: FormData) => Promise<void>;
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function LeaderCandidatesList({ users, cell, action }: LeaderCandidatesListProps) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? users.filter((u) => {
        const q = query.toLowerCase();
        return (
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
        );
      })
    : users;

  return (
    <div className="space-y-3">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nome ou e-mail..."
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
      />

      <div className="space-y-2 max-h-[55vh] overflow-auto pr-1">
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-sm text-white/40">Nenhum membro encontrado.</p>
        ) : (
          filtered.map((u) => (
            <div
              key={u.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="shrink-0 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white/70">
                  {getInitials(u.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{u.name ?? "—"}</p>
                  <p className="text-xs text-white/40 break-all">{u.email}</p>
                </div>
              </div>

              <ActionForm
                action={action}
                successLabel="Definido!"
                statusPlacement="inline-end"
                className="sm:ml-auto flex items-center justify-center sm:justify-end gap-2"
              >
                <input type="hidden" name="cellId" value={cell.id} />
                <input type="hidden" name="cellName" value={cell.name} />
                <input type="hidden" name="userId" value={u.id} />

                <button
                  type="submit"
                  className="shrink-0 flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 px-3 py-1.5 text-xs font-medium text-white/80 cursor-pointer transition-colors"
                >
                  <ShieldCheck size={13} />
                  Tornar Líder
                </button>
              </ActionForm>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
