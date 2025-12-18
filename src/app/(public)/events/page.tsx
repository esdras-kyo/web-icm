'use client'

import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Footer from '@/app/components/Footer'

type Mini = {
  id: string
  title: string | null
  description: string | null
  price: number
  image_key: string
}

export default function Members() {
  const [events, setEvents] = useState<Mini[]>([])
  const [loading, setLoading] = useState(true)
  const route = useRouter()

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/events-on?visibility=ORG&status=ATIVO', {
          method: 'GET',
          cache: 'no-store',
        })
        const data = await res.json()
        setEvents(data)
      } catch (err) {
        console.error('Erro ao carregar eventos:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  if (loading)
    return (
      <div className="min-h-dvh w-full bg-black text-white flex flex-col">
        <main className="flex-1 pt-20 md:pt-24">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
            <p className="text-center py-10">Carregando eventos...</p>
          </div>
        </main>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    )

  return (
    <div className="min-h-dvh w-full bg-black text-white flex flex-col">
      <main className="flex-1 pt-20 md:pt-24 min-h-dvh md:min-h-1/3">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-bold my-8 text-center">
            Próximos Eventos
          </h1>

          <ul className="space-y-4">
            {events.map((event) => (
              <li key={event.id} className="w-full">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ opacity: 0.95, x: 10 }}
                  transition={{ duration: 0.7 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 w-full md:w-1/2"
                >
                  {event.image_key ? (
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={`https://worker-1.esdrascamel.workers.dev/${encodeURIComponent(
                          event.image_key
                        )}`}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-left md:object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        priority={false}
                      />
                      <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors duration-500" />
                      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-transparent to-transparent" />
                    </div>
                  ) : null}

                  <button
                    onClick={() => {
                      route.push(`/events/${event.id}`)
                    }}
                    className="relative z-10 cursor-pointer w-full p-4 flex items-end justify-between bg-transparent"
                  >
                    <div className="flex flex-col items-start justify-start">
                      <p className="text-xl md:text-2xl font-semibold text-white">
                        {event.title || 'Sem nome'}
                      </p>

                      {event.price > 0 ? (
                        <p className="mt-2 text-sm font-semibold text-white/80">
                          R$ {event.price}
                        </p>
                      ) : null}
                    </div>

                    <ChevronRight className="h-10 w-10 text-white/90" />
                  </button>
                </motion.div>
              </li>
            ))}
          </ul>

          {events.length === 0 ? (
            <p className="text-white/60 mt-6 text-center">
              Nenhum Evento encontrado.
            </p>
          ) : null}

          <div className="h-10 md:h-14" />
        </div>
      </main>

      <div className="w-full">
        <Footer />
      </div>
    </div>
  )
}