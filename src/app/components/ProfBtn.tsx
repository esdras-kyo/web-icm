"use client";

import { FlaskConical, ShieldUser, User2 } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useUserClaims } from "../hooks/useUserClaims";

export default function ProfBtn() {
  const { claims } = useUserClaims();
  const isLeader = claims?.roles?.some((r) => r.role === "LEADER");
  const isAdmin = claims?.roles?.some((r) => r.role === "ADMIN");

  return (
    <div>
      <SignedIn>
        <UserButton userProfileUrl="/conta">
          <UserButton.MenuItems>
            {(isLeader || isAdmin) && (
              <UserButton.Link
                label="Painel do Líder"
                href="/leader"
                labelIcon={<User2 className="w-4 h-4" />}
              />
            )}

            {isAdmin && (
              <UserButton.Link
                label="Painel Administrativo"
                href="/offc"
                labelIcon={<ShieldUser className="w-4 h-4" />}
              />
            )}

            {isAdmin && (
              <UserButton.Link
                label="Historia - teste"
                href="/historia"
                labelIcon={<FlaskConical className="w-4 h-4" />}
              />
            )}

            {isAdmin && (
              <UserButton.Link
                label="Agenda - teste"
                href="/agenda"
                labelIcon={<FlaskConical className="w-4 h-4" />}
              />
            )}

            {isAdmin && (
              <UserButton.Link
                label="Celulas - teste"
                href="/celulas"
                labelIcon={<FlaskConical className="w-4 h-4" />}
              />
            )}

            {isAdmin && (
              <UserButton.Link
                label="Home - teste"
                href="/teste"
                labelIcon={<FlaskConical className="w-4 h-4" />}
              />
            )}

            <UserButton.Link
              label="Área do Membro"
              href="/conta/personal"
              labelIcon={<User2 className="w-4 h-4" />}
            />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>

      <SignedOut>
        <SignInButton>
          <button className="flex cursor-pointer rounded-full border w-7 h-7 justify-center items-center">
            <User2 className="w-4 h-4 text-white" />
          </button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}