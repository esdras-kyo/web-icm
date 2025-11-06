'use client';

import Link from "next/link";
import { useState, useMemo } from "react";
import { type User } from "./getBrosAction";
import { ChevronRight } from "lucide-react";

function primaryRole(roles: User["roles"]) {
  const has = (r: string) => roles?.some(x => x.role === r);
  if (has("ADMIN")) return "ADMIN";
  if (has("LEADER")) return "LEADER";
  if (has("MEMBER")) return "MEMBER";
  return null;
}

function roleLabelPt(role: string | null) {
  if (role === "ADMIN") return "Administrador";
  if (role === "LEADER") return "Líder";
  if (role === "MEMBER") return "Membro";
  return null;
}

function genderLabelPt(g: string | null) {
  if (g === "M") return "Masculino";
  if (g === "F") return "Feminino";
  return "Sem info";
}

export default function MembersClient({ users }: { users: User[] }) {
  const [q, setQ] = useState("");
  const [gender, setGender] = useState("ALL");
  const [birthThisMonth, setBirthThisMonth] = useState(false);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    const currentMonth = new Date().getMonth(); // 0–11

    return users.filter((u) => {
      const byName = !term || u.name?.toLowerCase().includes(term);
      const byGender = gender === "ALL" || u.gender === gender;
      const byBirth =
        !birthThisMonth ||
        (!!u.date_of_birth &&
          new Date(u.date_of_birth).getMonth() === currentMonth);

      return byName && byGender && byBirth;
    });
  }, [q, gender, birthThisMonth, users]);

  return (
    <main className="mx-auto w-full md:max-w-7xl px-2 py-2">
      <h1 className="text-xl font-bold text-white mb-4">Lista de Membros</h1>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Pesquisar por nome..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder-white/50 focus:outline-none"
        />

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full md:w-48 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white focus:outline-none cursor-pointer"
        >
          <option value="ALL">Todos</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </select>

        <label className="inline-flex items-center gap-2 text-white/90 cursor-pointer">
          <input
            type="checkbox"
            checked={birthThisMonth}
            onChange={(e) => setBirthThisMonth(e.target.checked)}
            className="h-4 w-4"
          />
          Aniversariantes do mês
        </label>
      </div>

      <ul className="space-y-3">
        {filtered.map((user) => {
          const pRole = primaryRole(user.roles);
          const pRoleLabel = roleLabelPt(pRole);
          return (
            <li key={user.id}>
              <Link
                href={`/offc/users/${user.id}`}
                className="block rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 hover:border-white/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between ">
                  <div className="flex items-start md:items-center flex-col md:flex-row justify-start ">
                    <div className="min-w-0 pr-2">
                      <p className="text-sm md:text-base font-semibold text-white truncate">
                        {user.name || "Sem nome"}
                      </p>
                      <p className="text-xs text-white/50">
                        {genderLabelPt(user.gender)}
                        {user.date_of_birth ? ` • ${user.date_of_birth}` : ""}
                      </p>
                    </div>
                    {pRoleLabel && (
                      <span className="shrink-0 border-l pl-2 mt-1 md:mt-0 border-white/40 text-xs text-white/60">
                        {pRoleLabel}
                      </span>
                    )}
                  </div>
                  <ChevronRight />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {!filtered.length && (
        <p className="text-white/60 mt-6 text-center">
          Nenhum usuário encontrado.
        </p>
      )}
    </main>
  );
}