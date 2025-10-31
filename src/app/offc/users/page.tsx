import Link from "next/link";
import { getBrosAction, type User } from "./getBrosAction";
import { ChevronRight } from "lucide-react";

function primaryRole(roles: User["roles"]) {
  const has = (r: string) => roles?.some(x => x.role === r);
  if (has("ADMIN")) return "ADMIN";
  if (has("LEADER")) return "LEADER";
  if (has("MEMBER")) return "MEMBER";
  return null;
}

function roleLabelPt(role: "ADMIN" | "LEADER" | "MEMBER" | null) {
  if (role === "ADMIN") return "Administrador";
  if (role === "LEADER") return "Líder";
  if (role === "MEMBER") return "Membro";
  return null;
}

export default async function Members() {
  const users = (await getBrosAction()) as User[];

  return (
    <main className="mx-auto w-full md:max-w-7xl px-2 py-2">
      <h1 className="text-xl font-bold text-white mb-6">Lista de Membros</h1>

      <ul className="space-y-3">
        {users.map((user) => {
          const pRole = primaryRole(user.roles);
          const pRoleLabel = roleLabelPt(pRole);

          return (
            <li key={user.id}>
              <Link
                href={`/offc/users/${user.id}`}
                aria-label={`Abrir ${user.name ?? "Usuário"} (${pRoleLabel ?? "Sem função"})`}
                className="block rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 hover:border-white/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between ">
                <div className="flex items-start md:items-center flex-col md:flex-row justify-start ">
                  <div className="min-w-0 pr-2">
                    <p className="text-sm md:text-base font-semibold text-white truncate">
                      {user.name || "Sem nome"}
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

      {!users.length && (
        <p className="text-white/60 mt-6 text-center">Nenhum usuário encontrado.</p>
      )}
    </main>
  );
}