import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getMonitorAccount } from "@/utils/monitor/monitorAccount";
import MonitorSignOut from "./MonitorSignOut";

// Isola a conta monitor: só o clerk_user_id registrado em monitor_account entra aqui.
export default async function MonitorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/monitor");

  const acc = await getMonitorAccount();
  if (!acc || acc.clerk_user_id !== userId) redirect("/conta");

  return (
    <div className="min-h-dvh bg-zinc-950">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-8">
        <span className="text-sm font-medium text-white/70">Monitor de evento</span>
        <MonitorSignOut />
      </header>
      {children}
    </div>
  );
}
