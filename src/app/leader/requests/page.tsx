'use client'
import { useEffect, useState } from "react";

  type Reques= {
    id: string;
    text: string | null;
    created_at: string | Date
  };
  
export default function Members(){
    const [reques, setReques] = useState<Reques[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
          try {
            const res = await fetch("/api/getRequests", { cache: "force-cache", next: { revalidate: 120 }  });
            const data = await res.json();
            setReques(data);
          } catch (err) {
            console.error("Erro ao carregar pedidos:", err);
          } finally {
            setLoading(false);
          }
        }
        fetchUsers();
      }, []);
      
      if (loading)
        return (
          <main className="p-10 text-white text-center">
            <p>Carregando pedidos...</p>
          </main>
        );
    
    return(
        <main className="mx-auto max-w-7xl px-2 py-2">
     <h1 className="text-xl font-bold text-white mb-8">Lista de Pedidos</h1>
        <ul className="space-y-4">
        {reques.map((reques) => (
          <li
            key={reques.id}
            className="rounded-xl border border-white/10 bg-white/5 hover:bg-gray-600 cursor-pointer"
          >
            <div className="cursor-pointer p-4 w-full flex items-center justify-between">
              <div>
                <p className="text-md font-light font-mono text-gray-300">-  {reques.text || ""} </p>

              </div>

            </div>
          </li>
        ))}
      </ul>
      {reques.length === 0 && (
        <p className="text-white/60 mt-6 text-center">Nenhum Pedido encontrado.</p>
      )}
        </main>
    )
}