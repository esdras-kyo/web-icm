"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import EventInscricoesView from "../EventInscricoesView";
import MonitorToggle from "../MonitorToggle";

// useParams/useSearchParams em rota dinâmica → dentro de <Suspense> (regra de build).
function AdminEventContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id?.toString();
  const title = searchParams.get("title") ?? undefined;

  if (!id) return null;

  return (
    <EventInscricoesView
      eventId={id}
      titleFallback={title}
      canEdit
      canDelete
      headerExtra={<MonitorToggle eventId={id} />}
    />
  );
}

export default function InscricoesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex items-center gap-3 text-zinc-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Carregando…</span>
          </div>
        </div>
      }
    >
      <AdminEventContent />
    </Suspense>
  );
}
