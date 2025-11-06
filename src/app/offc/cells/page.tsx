// /app/leader/cells/page.tsx
import Link from "next/link";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { CreateCellDialog } from "./_components/CreateCellDialog";
import { Button } from "@/components/ui/button";

type Cell = {
  id: string;
  name: string;
  location: string | null;
  created_at: string;
};

export default async function CellsPage() {
  const supabase = createSupabaseAdmin();

  const { data: cells, error } = await supabase
    .from("cells")
    .select("id, name, location, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">celps</h1>
          <CreateCellDialog />
        </div>
        <p className="text-red-500">Erro ao carregar células.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Celps</h1>
        <CreateCellDialog />
      </div>

      {!cells || cells.length === 0 ? (
        <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
          Nenhuma célula cadastrada ainda.
        </div>
      ) : (
        <ul className="space-y-3">
          {cells.map((cell: Cell) => (
            <li key={cell.id} className=" text-white flex items-center justify-between rounded-lg border p-4">
              <div>
                <div className="font-medium">{cell.name}</div>
                {cell.location && (
                  <div className="text-xs text-muted-foreground">{cell.location}</div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/offc/cells/${encodeURIComponent(cell.name)}/manage`}>
                  <Button size="sm" className="cursor-pointer">Gerenciar</Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}