// /app/leader/cells/_components/CreateCellDialog.tsx
"use client";

import { useState, useTransition } from "react";
import { createCellAction } from "../actions/createCell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function CreateCellDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await createCellAction(formData);
      if (result.success) setOpen(false);
      else setErrorMessage(result.message);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Criar célula</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar nova célula</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <Input name="name" placeholder="Ex: Célula João e Maria" required />
          </div>

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Criando..." : "Criar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}