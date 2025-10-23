"use client";

import { UserProfile } from "@clerk/nextjs";
import { HouseIcon, SwordsIcon } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useUserClaims } from "@/app/hooks/useUserClaims";
import { MemberForm } from "@/app/components/MemberForm";

export default function ContaPage() {
  const { claims, loading } = useUserClaims();

  const isLeader = claims?.roles?.some((r) => r.role === "LEADER");
  const isMember = claims?.roles?.some((r) => r.role === "MEMBER");
  return (
    <div className="max-w-4xl mx-auto p-6">
      <UserProfile
        routing="path"
        path="/conta"
        appearance={{

          variables: {
            colorPrimary: "#0c49ac",
            
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
      <h2>Bem-vindo!</h2>

      <p>Seu ID interno: {claims?.app_user_id}</p>

      {/* <h3>Suas roles:</h3>
      <ul>
        {claims?.roles?.map((r, i) => (
          <li key={i}>
            {r.role} — {r.scope_type}
            {r.department_id ? ` (Departamento ${r.department_id})` : ""}
          </li>
        ))}
      </ul> */}

      {isLeader && <div className="mt-4">🎯 Área do Líder habilitada!</div>}
      {isMember && <div className="mt-2">👥 Área de Membros disponível!</div>}
    </div>
    <MemberForm />

          </div>
        </UserProfile.Page>
       {isLeader ? <UserProfile.Link url="/leader" label="Area do Líder" labelIcon={<SwordsIcon size={16}/>}></UserProfile.Link> : null}

      </UserProfile>
    </div>
  );
}