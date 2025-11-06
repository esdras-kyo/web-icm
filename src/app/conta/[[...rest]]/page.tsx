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
    <div className="max-w-4xl mx-auto p-6">
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
          label="Informações de membro"
          labelIcon={<HouseIcon size={16} />}
          url="/personal"
        >

          <div className="space-y-4 text-black">
            <h2 className="text-lg font-medium">Informações</h2>
            <div className="p-6">

      
      {!isVisitant
      ?
      <div>
        <p>Seu ICM_ID: {claims?.public_code}</p>
        <h1>Cargo: {isLeader? "Líder" :isAdmin? "Administrador": "Membro"}</h1>
      </div>:null}

      {isAdmin ? <button onClick={()=>{router.push("/offc")}} className="rounded-md p-2 border border-black/20 bg-zinc-400 hover:bg-transparent cursor-pointer"> Painel </button> : null}

      {/* <h3>Suas roles:</h3>
      <ul>
        {claims?.roles?.map((r, i) => (
          <li key={i}>
            {r.role} — {r.scope_type}
            {r.department_id ? ` (Departamento ${r.department_id})` : ""}
          </li>
        ))}
      </ul> */}

    </div>
    {isVisitant
    ? <div className="rounded-lg p-2 border border-zinc-300">
    <h1 className="pb-2 font-bold">Complete seu cadastro de Membro!</h1>
    <MemberForm /> 
    </div>
    : null}

          </div>
        </UserProfile.Page>
       {isLeader ? <UserProfile.Link url="/leader" label="Area do Líder" labelIcon={<SwordsIcon size={16}/>}></UserProfile.Link> : null}

      </UserProfile>
    </div>
  );
}