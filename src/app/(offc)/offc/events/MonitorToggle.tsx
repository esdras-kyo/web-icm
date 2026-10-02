"use client";

import { useEffect, useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { isMonitorOnEvent, setMonitorForEvent } from "./monitorActions";

export default function MonitorToggle({ eventId }: { eventId: string }) {
  const [active, setActive] = useState<boolean | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    isMonitorOnEvent(eventId)
      .then(setActive)
      .catch(() => setActive(false));
  }, [eventId]);

  function toggle() {
    startTransition(async () => {
      try {
        const res = await setMonitorForEvent(active ? null : eventId);
        if (!res.configured) {
          setNotConfigured(true);
          return;
        }
        setActive(res.activeEventId === eventId);
      } catch {
        // erro de autorização/rede — mantém estado atual
      }
    });
  }

  if (notConfigured) {
    return (
      <span className="text-xs text-amber-400">
        Conta monitor não configurada
      </span>
    );
  }

  const label = active ? "Monitor ativo — desativar" : "Ativar monitor";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={active === null || pending}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
        active
          ? "border-emerald-500/50 bg-emerald-600/20 text-emerald-200 hover:bg-emerald-600/30"
          : "border-white/20 text-white hover:bg-white/10"
      }`}
    >
      {active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      {pending ? "Salvando…" : label}
    </button>
  );
}
