'use client'

import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Footer from '@/app/components/Footer'

type Mini = {
  id: string
  slug: string
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
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.7 }}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-black w-full md:w-1/2"
                >
                  {/* Imagem — área dedicada */}
                  {event.image_key ? (
                    <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                      <Image
                        src={`https://worker-1.esdrascamel.workers.dev/${encodeURIComponent(
                          event.image_key
                        )}`}
                        alt={event.title || 'Evento'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        priority={false}
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-b from-transparent to-black" />
                    </div>
                  ) : null}

                  {/* Texto — fundo preto, separado da imagem */}
                  <button
                    onClick={() => route.push(`/events/${event.slug}`)}
                    className="cursor-pointer w-full px-4 py-4 sm:px-5 flex items-center justify-between bg-transparent"
                  >
                    <div className="flex flex-col items-start gap-1">
                      <p className="text-base sm:text-lg md:text-xl font-semibold text-white leading-snug">
                        {event.title || 'Sem nome'}
                      </p>
                      {event.price > 0 ? (
                        <p className="text-sm text-white/70">
                          R$ {event.price}
                        </p>
                      ) : null}
                    </div>
                    <ChevronRight className="h-6 w-6 shrink-0 text-white/60 transition-colors group-hover:text-white" />
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