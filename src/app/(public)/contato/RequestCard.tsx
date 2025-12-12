"use client";

import { useFormStatus } from "react-dom";
import { createHolyRequest } from "./actions";
import { MessageCircleHeart } from "lucide-react";
import { useActionState } from "react";

const initialState = { ok: false, error: undefined as string | undefined };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="
        mt-1 inline-flex items-center justify-center
        rounded-lg bg-sky-500/60 hover:bg-sky-700
        disabled:opacity-60 disabled:cursor-not-allowed
        transition px-4 py-2 text-sm font-medium cursor-pointer
      "
    >
      {pending ? "Enviando..." : "Enviar pedido"}
    </button>
  );
}

export function HolyRequestCard() {
  const [state, formAction] = useActionState(createHolyRequest, initialState);

  return (
    <div className="grid gap-6">
      <form
        action={formAction}
        className="rounded-2xl border border-white/10 bg-black/20 p-5 flex flex-col gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <MessageCircleHeart className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-sm md:text-base">
              Pedidos
            </p>
          </div>
        </div>

        <p className="text-xs md:text-sm text-white/60">
          Os pedidos são anônimos. Se quiser se identificar, escreva junto ao texto:
        </p>

        <textarea
          name="text"
          placeholder="Digite seu pedido aqui..."
          className="
            w-full min-h-28 rounded-xl bg-white/5 border border-white/10
            p-3 text-sm text-white placeholder-white/40
            focus:outline-none focus:ring-2 focus:ring-red-300/40
            resize-none
          "
        />

          <SubmitButton />

        {state.ok && !state.error && (
          <p className="text-xs text-emerald-400 mt-1">
            Pedido enviado com sucesso! 🙏
          </p>
        )}

        {state.error && (
          <p className="text-xs text-red-400 mt-1">
            {state.error}
          </p>
        )}
      </form>
    </div>
  );
}