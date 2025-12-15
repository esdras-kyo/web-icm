"use client";
import { FlaskConical, ShieldUser, User, User2 } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useUserClaims } from "../hooks/useUserClaims";

export default function ProfBtn() {
  const { claims } = useUserClaims();
  const isLeader = claims?.roles?.some((r) => r.role === "LEADER");
  // const isMember = claims?.roles?.some((r) => r.role === "MEMBER");
  // const isVisitant = claims?.roles?.some((r) => r.role === "VISITANT");
  const isAdmin = claims?.roles?.some((r) => r.role === "ADMIN");

  return (
    <div className="">
      <SignedIn>
        <UserButton
          userProfileUrl="/conta" // possivel rota de perfil
        >
          <UserButton.MenuItems>
            {isLeader || isAdmin ? (
              <UserButton.Link
                label="Painel do Líder"
                href="/leader"
                labelIcon={<User2 className="w-4" />}
              />
            ) : null}
            {isAdmin ? ( 
              <UserButton.Link
                label="Painel Administrativo"
                href="/offc"
                labelIcon={
                  <div className="flex flex-col items-start justify-start">
                    <ShieldUser className="w-5" />
                  </div>
                } />) : null} 

            {isAdmin ? (

              <UserButton.Link
                label="Historia - teste"
                href="/historia"
                labelIcon={<FlaskConical className="w-4" />}
              />
            ) : null} {isAdmin ? (
              
              <UserButton.Link
                label="Agenda - teste"
                href="/agenda"
                labelIcon={<FlaskConical className="w-4" />}
              />
            ) : null} {isAdmin ? (

              <UserButton.Link
                label="Celulas - teste"
                href="/celulas"
                labelIcon={<FlaskConical className="w-4" />}
              />
              ) : null}

            <UserButton.Link
              label="Área do Membro"
              href="/conta/personal"
              labelIcon={<User2 className="w-4" />}
            />

          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <button className="flex cursor-pointer rounded-full border w-7 h-7 justify-center">
            <User2 className="w-4 text-white" />
          </button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
