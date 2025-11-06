'use client'
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

type EventItem = {
  id: string | number
  title: string
  description?: string
  starts_at: string | Date
  ends_at?: string | Date
  department?: {
    name?: string
  }

}
  
  function EventsCarouselSimple({ events }: { events: EventItem[] }) {
    const route = useRouter()
    const viewportRef = useRef<HTMLDivElement>(null)
  
    const scrollByPage = (dir: "prev" | "next") => {
      const el = viewportRef.current
      if (!el) return
      const amount = el.clientWidth
      el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" })
    }
  
    const fmt = (d: string | Date) =>
      new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
  
    return (
      <div className="relative w-full">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Próximos eventos</h2>
          <div className="flex gap-2">
            <Button  size="icon" onClick={() => scrollByPage("prev")} aria-label="Anterior">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="icon" onClick={() => scrollByPage("next")} aria-label="Próximo">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
  
        {/* VIEWPORT */}
        <div
          ref={viewportRef}
          className="
            grid grid-flow-col
            auto-cols-[100%] md:auto-cols-[50%] xl:auto-cols-[33.333%]
            gap-4 overflow-x-auto scroll-smooth
            snap-x snap-mandatory
            pb-2
            px-4
          "
        >
          {events.map((e) => (
            <div key={e.id} className="snap-start">
              <Card className="h-full bg-sky-800/50 border-none">
                <CardHeader className="pb-3 flex-1">
                  <CardTitle className="line-clamp-1 text-white font-mono font-light">{e.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {fmt(e.starts_at)}{e.ends_at ? ` — ${fmt(e.ends_at)}` : ""}
                  </p>
                  <p className="text-gray-400 ">{e.department?.name}</p>
                </CardHeader>
                <CardContent>
                  {/* <p className="text-sm line-clamp-3">{e.description}</p> */}
                  <Button onClick={()=>{route.push(`/events/${e.id}`)}} className="mt-auto w-full ">Ver detalhes</Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
export default function EventsAcive(){
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);

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
        <main className="mx-auto flex items-center flex-col w-full px-2 py-2">
     <h1 className="text-xl font-bold text-white mb-8">Eventos</h1>
     <section className="p-4">
      <EventsCarouselSimple events={events} />
    </section>
      {events.length === 0 && (
        <p className="text-white/60 mt-6 text-center">Nenhum Evento encontrado.</p>
      )}
        </main>
    )
}