'use client'

import { useAuth } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

export default function BemVindoPage(): React.JSX.Element {
  const router = useRouter()
  const params = useSearchParams()
  const from = params.get('from') // 'signin' | 'signup' | null

  const { isLoaded, isSignedIn } = useAuth()
  const ready = isLoaded && isSignedIn

  const isSignIn = from === 'signin'

  const title = isSignIn ? 'Bem-vindo de volta' : 'Conta criada com sucesso'
  const desc = isSignIn
    ? 'Que bom te ver novamente.'
    : (
      <>
        Acesse a <span className='font-semibold text-white'>Área do Membro</span> e preencha o formulário para concluir o cadastro.
      </>
    )

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center w-full px-4 py-14 md:py-20">
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-white/10 bg-black/40 p-6 md:p-8 backdrop-blur-sm">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-white/70">Boas-vindas</p>
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            {title}
          </h1>
          <p className="mt-1 text-sm md:text-base text-white/80 leading-relaxed">
            {desc}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isLoaded ? (
            <div
              aria-label="Carregando"
              className="h-5 w-5 rounded-full border border-white/30 border-t-white/80 animate-spin"
            />
          ) : null}
          <p className="text-sm text-white/70">
            {!isLoaded ? 'Carregando…' : ''}
          </p>
        </div>

        {ready && isLoaded && (
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => router.replace('/conta/personal')}
              className="cursor-pointer w-full rounded-xl hover:text-white bg-red-800/70 text-white flex flex-row justify-center items-center pl-4 gap-2 font-medium py-3 hover:bg-black transition"
            >
              <p>Área do membro</p> <ArrowRight />
            </button>

            <button
              onClick={() => router.replace('/')}
              className="cursor-pointer w-full rounded-xl border border-white/15 bg-transparent text-white/90 px-4 py-3 hover:bg-white/5 transition"
            >
              Voltar para o início
            </button>
          </div>
        )}
      </div>
    </main>
  )
}