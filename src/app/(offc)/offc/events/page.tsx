'use client'
import EventCreateForm, { EventCreatePayload } from "@/app/components/EventCreator";
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

    function slugify(text: string) {
      return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    
    async function handleCreate(payload: EventCreatePayload) {
      const res = await fetch("/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("create event error:", body);
        throw new Error(body?.error ?? "Falha ao criar evento");
      }
  
      const { id } = (await res.json()) as { id: string };
      return id; // isso volta como eventId lá dentro do EventCreateForm
    }
  

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
      <section className="space-y-4">
      <h1 className="text-xl font-bold text-white mb-4">Eventos</h1>
      
        <ul className="space-y-4">
        {events.map((event) => (
          <li
            key={event.id}
            className="rounded-xl border border-white/10 bg-white/5 hover:bg-gray-600 cursor-pointer"
          >
            <button 
           onClick={() => {
            const slug = event.title ? slugify(event.title) : "";
            route.push(`/offc/events/${event.id}?title=${slug}`)
          }}
            className="cursor-pointer p-4 w-full flex items-center justify-between">
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

<div className="mb-8 flex items-start justify-start w-full my-8 border-t-2 border-white/30 py-4">
     <EventCreateForm onCreate={handleCreate} />
     </div>
        </section>
    )
}