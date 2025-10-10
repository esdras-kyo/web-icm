'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

  type Mini = {
    id: string;
    name: string | null;
  };


  
export default function Members(){
    const { data } = useSession()
    const [minis, setMinis] = useState<Mini[]>([]);
    const [loading, setLoading] = useState(true);
    const route = useRouter()

    function useRoles() {
        const roles = (data?.user as any)?.roles as Array<{ role: string; scope?: string }> | undefined
        const isAdmin = !!roles?.some(r => r.role === 'ADMIN' && (r.scope === 'ORG' || r.scope == null))
        const isLeader = !!roles?.some(r => r.role === 'LEADER')
        return { isAdmin, isLeader }
      }

    useEffect(() => {
        async function fetchUsers() {
          try {
            const res = await fetch("/api/departments", { cache: "no-store" });
            const data = await res.json();
            setMinis(data);
          } catch (err) {
            console.error("Erro ao carregar departamentos:", err);
          } finally {
            setLoading(false);
          }
        }
        fetchUsers();
      }, []);
      
      if (loading)
        return (
          <main className="p-10 text-white text-center">
            <p>Carregando departamentos...</p>
          </main>
        );
    
    return(
        <main className="mx-auto max-w-7xl px-2 py-2">
     <h1 className="text-xl font-bold text-white mb-8">Lista de Departamentos</h1>
        <ul className="space-y-4">
        {minis.map((mini) => (
          <li
            key={mini.id}
            className="rounded-xl border border-white/10 bg-white/5 hover:bg-gray-600 cursor-pointer"
          >
            <button onClick={()=>{route.push(`/leader/departments/${mini.id}`)}} className="cursor-pointer p-4 w-full flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-white">
                  {mini.name || "Sem nome"}
                </p>

              </div>

            </button>
          </li>
        ))}
      </ul>
      {minis.length === 0 && (
        <p className="text-white/60 mt-6 text-center">Nenhum Departamento encontrado.</p>
      )}
        </main>
    )
}