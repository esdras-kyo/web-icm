"use client";
import { User2 } from "lucide-react";
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
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  );
}
