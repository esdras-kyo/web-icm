"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, AlertCircle } from "lucide-react";

type Feedback = { success: boolean; message?: string } | void;

export function ActionForm({
  action,
  children,
  successLabel = "Salvo",
  className,
  statusPlacement = "below", // "inline-end" | "below"
}: {
  action: (fd: FormData) => Promise<Feedback>;
  children: React.ReactNode;
  successLabel?: string;
  className?: string;
  statusPlacement?: "inline-end" | "below";
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [ok, setOk] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function handle(fd: FormData) {
    setPending(true);
    setErr(null);
    try {
      const res = await action(fd);
      const success = (res as { success?: boolean })?.success ?? true;
      if (success) {
        setOk(true);
        setTimeout(() => setOk(false), 1400);
      } else {
        const m = (res as { message?: string })?.message ?? "Não foi possível concluir.";
        setErr(m);
      }
    } catch {
      setErr("Falha inesperada.");
    } finally {
      setPending(false);
      router.refresh();
    }
  }

  return (
    <form
      className={className}
      action={handle}
    >
      <fieldset disabled={pending} className="contents">
        {children}
      </fieldset>

      {/* status inline (ao lado do botão) ou abaixo, conforme necessidade */}
      <div
        className={
          statusPlacement === "below"
            ? "mt-2"
            : "inline-flex items-center gap-2 ml-2 align-middle"
        }
      >
        <span
          aria-live="polite"
          className={`flex items-center gap-1 text-emerald-500 text-xs transition-opacity duration-200 ${
            ok ? "opacity-100" : "opacity-0"
          }`}
        >
          <Check className="w-4 h-4" />
          {successLabel}
        </span>

        {err && (
          <span className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {err}
          </span>
        )}
      </div>
    </form>
  );
}