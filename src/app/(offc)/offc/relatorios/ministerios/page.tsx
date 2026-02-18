import Link from "next/link";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { MeetingsListClient } from "./MeetingsList";

export type MeetingRow = {
  id: string;
  department_id: string | null;
  title: string | null;
  created_at: string | null;
};

export type DepartmentMini = {
  id: string;
  name: string | null;
};

export default async function MeetingsPage() {
  const supabase = createSupabaseAdmin();

  // 1) buscar meetings (lista simples)
  const { data: meetings, error } = await supabase
    .from("meetings")
    .select("id, department_id, title, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-6">
        <Link href="/offc/relatorios" className="text-sm underline">
          ← Voltar
        </Link>
        <p className="mt-4 text-red-500">Erro ao carregar relatórios de ministérios.</p>
        <p className="mt-2 text-xs text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  const rows = (meetings ?? []) as MeetingRow[];

  // 2) enriquecer com departments em lote (se tiver department_id)
  const departmentIds = Array.from(
    new Set(rows.map((m) => m.department_id).filter(Boolean))
  ) as string[];

  const { data: departments, error: dptErr } = departmentIds.length
    ? await supabase.from("departments").select("id, name").in("id", departmentIds)
    : { data: [] as DepartmentMini[], error: null };

  if (dptErr) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-6">
        <Link href="/offc/relatorios" className="text-sm underline">
          ← Voltar
        </Link>
        <p className="mt-4 text-red-500">Erro ao carregar ministérios.</p>
        <p className="mt-2 text-xs text-muted-foreground">{dptErr.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="mb-6 flex flex-col gap-3">
        <Link href="/offc/relatorios" className="text-sm underline">
          ← Voltar
        </Link>

        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold">
            Relatórios de Ministérios
          </h1>
        </div>
      </div>

      <MeetingsListClient meetings={rows} departments={(departments ?? []) as DepartmentMini[]} />
    </div>
  );
}