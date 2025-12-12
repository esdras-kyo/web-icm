"use client";

import { useEffect, useState } from "react";
import { UserCircle2 } from "lucide-react";
import { HighlightKpiCard } from "../../components/HighlightKpiCard";

type UsersCountResponse = {
  total: number;
  error?: string;
};

type TotalUsersKpiProps = {
  href?: string; // rota para página de usuários
};

export function TotalUsersKpi({ href = "/offc/users" }: TotalUsersKpiProps) {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsersCount() {
      try {
        const res = await fetch("/api/users/count", { cache: "no-store" });
        const json: UsersCountResponse = await res.json();

        if (!res.ok || json.error) {
          setError(json.error || "Erro ao carregar total de usuários.");
          setTotalUsers(0);
          return;
        }

        setTotalUsers(json.total ?? 0);
      } catch (e) {
        console.error(e);
        setError("Erro ao carregar total de usuários.");
        setTotalUsers(0);
      }
    }

    fetchUsersCount();
  }, []);

  if (totalUsers === null && !error) {
    return (
      <div className="w-full max-w-full rounded-2xl border border-gray-800 bg-white/5 p-5 text-sm text-white/70">
        Carregando usuários...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-full rounded-2xl border border-red-700/60 bg-red-950/40 p-5 text-sm text-red-100">
        {error}
      </div>
    );
  }

  return (
    <HighlightKpiCard
      label="Usuários cadastrados"
      value={totalUsers ?? 0}
      description="Quantidade total de perfis no sistema"
      href={href}
      ctaLabel="Ver usuários"
      icon={<UserCircle2 size={18} />}
    />
  );
}