import Link from "next/link";
import { Crown, UserX } from "lucide-react";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { assignLeaderAction } from "./actions/assignLeader";
import { removeLeaderAction } from "./actions/removeLeader";
import { ActionForm } from "./ActionForm";
import { LeaderCandidatesList } from "./LeaderCandidatesList";
import type { PostgrestError } from "@supabase/supabase-js";

type LeaderMembership = {
  id: string;
  user: { id: string; name: string | null; email: string };
};

function getInitials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function ManageCellPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const cellName = decodeURIComponent(name);
  const supabase = createSupabaseAdmin();

  const onAssignLeader = async (formData: FormData): Promise<void> => {
    "use server";
    await assignLeaderAction(formData);
  };

  const onRemoveLeader = async (formData: FormData): Promise<void> => {
    "use server";
    await removeLeaderAction(formData);
  };

  const { data: cell, error: cellErr } = await supabase
    .from("cells")
    .select("id, name")
    .eq("name", cellName)
    .single();

  if (cellErr || !cell) {
    return (
      <div className="max-w-2xl mx-auto py-8 text-white">
        <Link href="/offc/cells" className="text-sm underline">← Voltar</Link>
        <p className="mt-4 text-red-400">Célula não encontrada.</p>
      </div>
    );
  }

  const { data: leaderRow } = await supabase
    .from("cell_memberships")
    .select("id, user:users(id, name, email)")
    .eq("cell_id", cell.id)
    .eq("role", "LEADER")
    .limit(1)
    .maybeSingle() as { data: LeaderMembership | null; error: PostgrestError | null };

  const { data: users } = await supabase
    .from("users")
    .select("id, name, email")
    .order("name", { ascending: true });

  const hasLeader = !!leaderRow;

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8 text-white px-4">
      {/* Header */}
      <div>
        <Link href="/offc/cells" className="text-sm text-white/50 hover:text-white/80 transition-colors">
          ← Voltar
        </Link>
        <h1 className="text-2xl font-semibold mt-3">Liderança da Célula</h1>
        <p className="text-white/50 mt-0.5">{cell.name}</p>
      </div>

      {hasLeader ? (
        <>
          {/* Leader card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col items-center text-center space-y-5">
            <div className="w-20 h-20 rounded-full bg-[#0c49ac] flex items-center justify-center text-3xl font-bold text-white select-none">
              {getInitials(leaderRow.user.name)}
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{leaderRow.user.name ?? "—"}</h2>
              <p className="text-sm text-white/50">{leaderRow.user.email}</p>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
              <Crown size={12} />
              Líder da Célula
            </span>
          </div>

          {/* Remove — subtle */}
          <div className="flex justify-end">
            <ActionForm action={onRemoveLeader} successLabel="Removido" statusPlacement="inline-end">
              <input type="hidden" name="membershipId" value={leaderRow.id} />
              <input type="hidden" name="cellName" value={cell.name} />
              <button
                type="submit"
                className="text-xs text-white/30 hover:text-red-400 cursor-pointer transition-colors underline underline-offset-2"
              >
                Remover líder
              </button>
            </ActionForm>
          </div>
        </>
      ) : (
        <>
          {/* Empty state */}
          <div className="rounded-2xl border border-dashed border-white/15 p-8 flex flex-col items-center text-center space-y-2">
            <UserX size={32} className="text-white/20 mb-1" />
            <h2 className="font-medium text-white/80">Nenhum líder definido</h2>
            <p className="text-sm text-white/40 max-w-xs">
              Escolha um membro abaixo para assumir a liderança desta célula.
            </p>
          </div>

          {/* Candidates */}
          {!users || users.length === 0 ? (
            <p className="text-sm text-white/40 text-center">Nenhum membro cadastrado no sistema.</p>
          ) : (
            <LeaderCandidatesList
              users={users}
              cell={cell}
              action={onAssignLeader}
            />
          )}
        </>
      )}
    </div>
  );
}
