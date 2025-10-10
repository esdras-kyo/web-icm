'use client'
import { useEffect, useState } from "react";

type Role = {
    id: string;
    role: string;
    scope_type?: string;
    department_id?: string | null;
    department:{
        id: string
        name: string
    }
  };
  
  type User = {
    id: string;
    name: string | null;
    email: string | null;
    roles: Role[];

  };
  
export default function Members(){
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
          try {
            const res = await fetch("/api/getBros", { cache: "no-store" });
            const data = await res.json();
            setUsers(data);
          } catch (err) {
            console.error("Erro ao carregar usuários:", err);
          } finally {
            setLoading(false);
          }
        }
        fetchUsers();
      }, []);

      if (loading)
        return (
          <main className="p-10 text-white text-center">
            <p>Carregando usuários...</p>
          </main>
        );
    
    return(
        <main className="mx-auto max-w-7xl px-2 py-2">
     <h1 className="text-xl font-bold text-white mb-8">Lista de Usuários</h1>
        <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user.id}
            className="rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-white">
                  {user.name || "Sem nome"}
                </p>
                <p className="text-sm text-white/70">{user.email}</p>
              </div>

              <div className="flex gap-2">
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map((r) => (
                    <span
                      key={r.id}
                      className={`rounded-full ${r.department?.name ? "bg-white/10 border border-white/20 px-3 py-1" : "" } text-xs text-white`}
                    >
                      {r.department?.name ?? ""}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-white/50">Sem role</span>
                )}
              </div>
              
            </div>
          </li>
        ))}
      </ul>
      {users.length === 0 && (
        <p className="text-white/60 mt-6 text-center">Nenhum usuário encontrado.</p>
      )}
        </main>
    )
}