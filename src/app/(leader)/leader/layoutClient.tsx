"use client";

import React from "react";
import Backdrop from "@/app/components/Backdrop";
import { SidebarProvider, useSidebar } from "@/app/context/SidebarContext";
import OffcHeader from "@/app/components/OffcHeader";
import LeaderSidebar from "@/app/components/LeaderSidebar";

function Content({ children }: { children: React.ReactNode }) {
  const { isExpanded, isMobile } = useSidebar();

  return (
    <div
      className={`
        flex h-dvh flex-col transition-[padding] duration-300 ease-in-out
        ${isMobile ? "" : isExpanded ? "pl-64" : "pl-20"}
      `}
    >
      <OffcHeader title="Liderança" />

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 mx-auto max-w-7xl md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function LeaderClientShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="h-dvh overflow-hidden bg-zinc-950 relative text-white">
        <LeaderSidebar />
        <Backdrop />
        <Content>{children}</Content>
      </div>
    </SidebarProvider>
  );
}