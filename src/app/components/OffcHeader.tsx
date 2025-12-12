"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useSidebar } from "@/app/context/SidebarContext";
import ProfBtn from "./ProfBtn";

export default function OffcHeader({title}: {title: string}) {
  const { toggleMobile } = useSidebar();

  return (
    <header className="h-14 border-b border-white/10 bg-black/30 backdrop-blur px-3 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleMobile}
          className="lg:hidden p-2 rounded-full hover:bg-white/10 cursor-pointer"
          aria-label="Abrir menu"
        >
          <Menu size={20} className="text-white" />
        </button>
        <span className="text-white font-semibold">{title}</span>
      </div>

      <div className="flex flex-row gap-8 items-center justify-center">
        <Link href="/" className="text-xs text-white/70 hover:text-white cursor-pointer">
          {`< Voltar ao site`}
        </Link>

        <ProfBtn />
      </div>
    </header>
  );
}