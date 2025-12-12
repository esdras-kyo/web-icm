// app/offc/galeria/[id]/GallerySectionDangerZone.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  sectionId: string;
  sectionTitle: string;
};

export function GallerySectionDangerZone({ sectionId, sectionTitle }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Tem certeza que deseja apagar a seção "${sectionTitle}"?\n\nTodas as imagens desta seção também serão removidas. Essa ação não pode ser desfeita.`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setErrorMsg(null);

      const res = await fetch(`/api/gallery/sections/${sectionId}`, {
        method: "DELETE",
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(body?.error ?? "Falha ao apagar seção.");
      }

      // volta pra lista de seções
      router.push("/offc/galeria");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err?.message ?? "Erro inesperado ao tentar apagar a seção."
      );
      setIsDeleting(false);
    }
  }

  return (
    <section className="mt-8 rounded-xl border border-red-900/60 bg-red-950/50 p-4">
      <h2 className="text-sm font-semibold text-red-200">
        Zona de perigo
      </h2>
      <p className="mt-1 text-xs text-red-200/80">
        Apagar esta seção irá remover também todas as imagens associadas a ela.
        Esta ação é permanente.
      </p>

      {errorMsg && (
        <p className="mt-2 text-xs text-red-300">
          {errorMsg}
        </p>
      )}

      <div className="mt-3">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center rounded-md border border-red-500/80 bg-red-700/80 px-3 py-1.5 text-xs font-semibold text-red-50 shadow-sm hover:bg-red-700 cursor-pointer disabled:opacity-60"
        >
          {isDeleting ? "Apagando..." : "Apagar seção e imagens"}
        </button>
      </div>
    </section>
  );
}