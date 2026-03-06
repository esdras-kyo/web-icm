"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

type ConfirmDeleteModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  title = "Confirmar exclusão",
  description,
  confirmLabel = "Excluir",
  cancelLabel = "Cancelar",
}: ConfirmDeleteModalProps) {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      await onConfirm();
      onClose();
    });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-desc"
    >
      <div className="w-full max-w-sm rounded-2xl border border-red-900/50 bg-zinc-900 p-6 shadow-2xl shadow-black/50">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-950/60 text-red-400">
            <Trash2 className="h-5 w-5" />
          </div>
          <h2
            id="confirm-delete-title"
            className="text-lg font-semibold text-white"
          >
            {title}
          </h2>
        </div>
        <p
          id="confirm-delete-desc"
          className="mb-6 text-sm leading-relaxed text-zinc-300"
        >
          {description}
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-xl border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="rounded-xl bg-red-600/90 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60"
          >
            {isPending ? "Excluindo..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

type ConfirmDeleteButtonProps = {
  onConfirm: () => Promise<void>;
  itemName: string;
  entityLabel: string;
  ariaLabel?: string;
};

export function ConfirmDeleteButton({
  onConfirm,
  itemName,
  entityLabel,
  ariaLabel,
}: ConfirmDeleteButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded border border-red-700 px-2 py-1 text-red-300 hover:bg-red-950/40"
        aria-label={ariaLabel ?? `Excluir ${itemName}`}
      >
        <Trash2 className="inline h-4 w-4" />
      </button>
      <ConfirmDeleteModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        description={`Tem certeza que deseja excluir o ${entityLabel} "${itemName}"? Esta ação não pode ser desfeita.`}
      />
    </>
  );
}
