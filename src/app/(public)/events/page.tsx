'use client'
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

  type Mini = {
    id: string;
    title: string | null;
    description: string | null;
    price: number
    image_key: string
  };
  
export default function Members(){
    const [events, setEvents] = useState<Mini[]>([]);
    const [loading, setLoading] = useState(true);
    const route = useRouter()

    useEffect(() => {
        async function fetchUsers() {
          try {
            const res = await fetch("/api/events-on?visibility=ORG&status=ATIVO", {
                method: "GET", cache: 'no-store'
              });;
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
        <main className="mx-auto max-w-7xl px-2 py-2 ">
     <h1 className="text-4xl font-bold text-white mb-8"> Proximos Eventos</h1>
        <ul className="space-y-4">
        {events.map((event) => (
              
          <li
           key={event.id} 
            className=""
          >
            <motion.div  initial={{ opacity: 0, y: 30 }} whileHover={{ opacity: 0.8, x: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                    className="relative rounded-xl border border-white/10 flex w-full md:w-1/2 bg-black/50 hover:bg-transparent cursor-pointer">
                        {event.image_key && ( <div className="absolute inset-0 z-0">
                <Image 
                  src={`https://worker-1.esdrascamel.workers.dev/${encodeURIComponent(event.image_key)}`}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-all duration-500 group-hover:brightness-110 group-hover:scale-100 rounded-2xl"
                  priority={false}
                />
                {/* Scrim leve só embaixo para legibilidade */}
                <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-black/70 via-transparent to-transparent" />
              </div>
)}
            <button onClick={()=>{route.push(`/events/${event.id}`)}} className="relative z-10 cursor-pointer bg-black/50 hover:bg-black/30 p-4 w-full flex items-end justify-between">
              <div className="items-start flex justify-start flex-col ">
                <p className="text-2xl font-semibold text-white mb-4">
                  {event.title || "Sem nome"}
                </p>
                {event.price>0 && (<p className="text-sm font-semibold text-gray-300">
                  R$ {event.price}
                </p>)}



              </div>
              <ChevronRight width={40} height={40} color="white"/>

            </button>
            </motion.div>
          </li>
          
        ))}
      </ul>
      {events.length === 0 && (
        <p className="text-white/60 mt-6 text-center">Nenhum Evento encontrado.</p>
      )}
        </main>
    )
}