import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { Button } from "@/components/ui/button";

export default async function CellsPage() {
  const user = await currentUser();
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <p className="text-red-500">Usuário não autenticado.</p>
      </div>
    );
  }

  const meta = user.publicMetadata as {
    cell_role?: "LEADER" | "ASSISTANT" | "MEMBER" | "VISITANT" | string;
    primary_cell_id?: string;
  };

  const cellRole = meta?.cell_role;
  const primaryCellId = meta?.primary_cell_id;

  if (cellRole !== "LEADER" || !primaryCellId) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-semibold mb-6">Célula</h1>
        <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
          Você não lidera nenhuma célula.
        </div>
      </div>
    );
  }

  const supabase = createSupabaseAdmin();
  const { data: cell, error } = await supabase
    .from("cells")
    .select("id, name, location, created_at")
    .eq("id", primaryCellId)
    .single();

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-semibold mb-6">Célula</h1>
        <p className="text-red-500">Erro ao carregar sua célula.</p>
      </div>
    );
  }

  if (!cell) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-semibold mb-6">Célula</h1>
        <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
          Nenhuma célula encontrada para o seu usuário.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">Célula</h1>

      <ul className="space-y-3">
        <li className="text-white flex items-center justify-between rounded-lg border p-4">
          <div>
            <div className="font-medium">{cell.name}</div>
            {cell.location && (
              <div className="text-xs text-muted-foreground">{cell.location}</div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/leader/cells/${encodeURIComponent(cell.name)}/manage`}>
              <Button size="sm" className="cursor-pointer">Gerenciar</Button>
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
}