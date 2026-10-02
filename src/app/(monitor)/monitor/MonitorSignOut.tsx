"use client";

import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export default function MonitorSignOut() {
  return (
    <SignOutButton redirectUrl="/sign-in">
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/20 px-3 py-1.5 text-sm text-white transition hover:bg-white/10"
      >
        <LogOut className="h-4 w-4" />
        Sair
      </button>
    </SignOutButton>
  );
}
