"use client";

import { UserProfile } from "@clerk/nextjs";
import { HouseIcon, SwordsIcon } from "lucide-react";
// import { useAuth } from "@clerk/nextjs";
import { useUserClaims } from "@/app/hooks/useUserClaims";
import { MemberForm } from "@/app/components/MemberForm";
import { useRouter } from "next/navigation";

export default function ContaPage() {
  const { claims } = useUserClaims();
  const router = useRouter()

  const isLeader = claims?.roles?.some((r) => r.role === "LEADER");
  // const isMember = claims?.roles?.some((r) => r.role === "MEMBER");
  const isVisitant = claims?.roles?.some((r) => r.role === "VISITANT");
  const isAdmin = claims?.roles?.some((r) => r.role === "ADMIN");
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center mx-auto pt-24 px-6">
      <UserProfile
        routing="path"
        path="/conta"
        appearance={{
          variables: {
            colorPrimary: "#0c49ac",
            colorBackground:""
            
          },
        }}
      >

<UserProfile.Page
  label='Área de Membro'
  labelIcon={<HouseIcon size={16} />}
  url='/personal'
>
  <div className='text-white'>
    <h2 className='text-lg font-medium'>Informações</h2>

    {!isVisitant ? (
      <div className='rounded-2xl border mt-8 border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-8 space-y-4'>
        <div>
          <p className='text-white/80'>Seu ICM ID: <span className='font-semibold text-white'>{claims?.public_code}</span></p>
          <p className='text-white/80'>
            Cargo:{' '}
            <span className='font-semibold text-white'>
              {isLeader ? 'Líder' : isAdmin ? 'Administrador' : 'Membro'}
            </span>
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={() => router.push('/offc')}
            className='mt-2 w-full rounded-xl px-4 py-3 border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer'
          >
            Painel Administrativo
          </button>
        ) : null}

    {isLeader ? (
          <button
            onClick={() => router.push('/leader')}
            className='mt-2 w-full rounded-xl px-4 py-3 border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer'
          >
            Área do Líder
          </button>
        ) : null}
      </div>
    ) : (
      <div className='space-y-3'>
        <p className='text-sm text-white/70'>
          Falta pouco pra liberar tudo da área do membro.
        </p>

        <div className='rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-8'>
          <div className='flex items-start justify-between gap-4 mb-5'>
            <div>
              <h1 className='text-base md:text-lg font-semibold text-white'>
                Complete seu cadastro de Membro
              </h1>
              <p className='mt-1 text-sm text-white/70'>
                Preencha os dados abaixo para concluir.
              </p>
            </div>
          </div>

          <MemberForm />
        </div>
      </div>
    )}
  </div>
</UserProfile.Page>
       {isLeader ? <UserProfile.Link url="/leader" label="Area do Líder" labelIcon={<SwordsIcon size={16}/>}></UserProfile.Link> : null}

      </UserProfile>
    </div>
  );
}