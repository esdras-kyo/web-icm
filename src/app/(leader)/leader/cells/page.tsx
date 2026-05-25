import Link from "next/link";
import { Crown, Shield } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { Button } from "@/components/ui/button";

interface CellMembership {
  role: string;
  cell: {
    id: string;
    name: string;
    location: string | null;
  };
}

export default async function CellsPage() {
  const user = await currentUser();
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <p className="text-red-500">Usuário não autenticado.</p>
      </div>
    );
  }

  const supabase = createSupabaseAdmin();

  const { data: appUser } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_user_id", user.id)
    .single();

  if (!appUser) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-semibold mb-6">Células</h1>
        <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
          Usuário não encontrado no sistema.
        </div>
      </div>
    );
  }

  const { data: memberships, error } = await supabase
    .from("cell_memberships")
    .select("role, cell:cells(id, name, location)")
    .eq("user_id", appUser.id)
    .in("role", ["LEADER", "ASSISTANT"])
    .order("role", { ascending: true });

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-semibold mb-6">Células</h1>
        <p className="text-red-500">Erro ao carregar suas células.</p>
      </div>
    );
  }

  const cells = (memberships ?? []) as unknown as CellMembership[];

  if (cells.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-semibold mb-6">Células</h1>
        <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
          Você não lidera nenhuma célula.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">Células</h1>

      <ul className="space-y-3">
        {cells.map((m) => (
          <li
            key={m.cell.id}
            className="text-white flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div>
                <div className="font-medium">{m.cell.name}</div>
                {m.cell.location && (
                  <div className="text-xs text-muted-foreground">{m.cell.location}</div>
                )}
              </div>

              {m.role === "LEADER" ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                  <Crown size={10} />
                  Líder
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 text-[10px] font-medium text-sky-300">
                  <Shield size={10} />
                  Co-líder
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/leader/cells/${encodeURIComponent(m.cell.name)}/manage`}>
                <Button size="sm" className="cursor-pointer">Gerenciar</Button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
