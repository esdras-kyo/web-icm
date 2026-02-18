"use client";

import { ShieldUser, User2 } from "lucide-react";
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
                label="Área do Líder"
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
        <button
          type="button"
          className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-sm font-mono text-white/85 transition hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          <span className="">Entrar</span>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15">
            <User2 className="h-4 w-4 text-white" />
          </span>
        </button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}