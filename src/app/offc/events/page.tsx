'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

  type Mini = {
    id: string;
    title: string | null;
    description: string | null;
  };
  
export default function Members(){
    const [events, setEvents] = useState<Mini[]>([]);
    const [loading, setLoading] = useState(true);
    const route = useRouter()

    useEffect(() => {
        async function fetchUsers() {
          try {
            const res = await fetch("/api/getEventus", { cache: "no-store" });
            const data = await res.json();
            setEvents(data);
          } catch (err) {
            console.error("Erro ao carregar eventos:", err);
          } finally {
            setLoading(false);
          }
        }
        fetchUsers();
      }, []);
      
      if (loading)
        return (
          <main className="p-10 text-white text-center">
            <p>Carregando eventos...</p>
          </main>
        );
    
    return(
        <main className="mx-auto max-w-7xl px-2 py-2">
     <h1 className="text-xl font-bold text-white mb-8">Eventos</h1>
        <ul className="space-y-4">
        {events.map((event) => (
          <li
            key={event.id}
            className="rounded-xl border border-white/10 bg-white/5 hover:bg-gray-600 cursor-pointer"
          >
            <button onClick={()=>{route.push(`/offc/events/${event.id}`)}} className="cursor-pointer p-4 w-full flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-white">
                  {event.title || "Sem nome"}
                </p>

              </div>

            </button>
          </li>
        ))}
      </ul>
      {events.length === 0 && (
        <p className="text-white/60 mt-6 text-center">Nenhum Evento encontrado.</p>
      )}
        </main>
    )
}