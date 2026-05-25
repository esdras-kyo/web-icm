import Link from "next/link";
import { Crown, UserX, Shield } from "lucide-react";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { assignLeaderAction } from "./actions/assignLeader";
import { removeLeaderAction } from "./actions/removeLeader";
import { assignAssistantAction } from "./actions/assignAssistant";
import { removeAssistantAction } from "./actions/removeAssistant";
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

  const onAssignAssistant = async (formData: FormData): Promise<void> => {
    "use server";
    await assignAssistantAction(formData);
  };

  const onRemoveAssistant = async (formData: FormData): Promise<void> => {
    "use server";
    await removeAssistantAction(formData);
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

  const { data: assistantRow } = await supabase
    .from("cell_memberships")
    .select("id, user:users(id, name, email)")
    .eq("cell_id", cell.id)
    .eq("role", "ASSISTANT")
    .limit(1)
    .maybeSingle() as { data: LeaderMembership | null; error: PostgrestError | null };

  const { data: users } = await supabase
    .from("users")
    .select("id, name, email")
    .order("name", { ascending: true });

  const hasLeader = !!leaderRow;
  const hasAssistant = !!assistantRow;

  const excludedIds = new Set<string>();
  if (leaderRow) excludedIds.add(leaderRow.user.id);
  if (assistantRow) excludedIds.add(assistantRow.user.id);
  const availableUsers = users?.filter((u) => !excludedIds.has(u.id)) ?? [];

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

      {/* ── Líder ── */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Crown size={18} className="text-amber-400" />
          Líder
        </h2>

        {hasLeader ? (
          <>
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
            <div className="rounded-2xl border border-dashed border-white/15 p-8 flex flex-col items-center text-center space-y-2">
              <UserX size={32} className="text-white/20 mb-1" />
              <h2 className="font-medium text-white/80">Nenhum líder definido</h2>
              <p className="text-sm text-white/40 max-w-xs">
                Escolha um membro abaixo para assumir a liderança desta célula.
              </p>
            </div>

            {availableUsers.length === 0 ? (
              <p className="text-sm text-white/40 text-center">Nenhum membro cadastrado no sistema.</p>
            ) : (
              <LeaderCandidatesList
                users={availableUsers}
                cell={cell}
                action={onAssignLeader}
              />
            )}
          </>
        )}
      </section>

      {/* ── Co-líder ── */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Shield size={18} className="text-sky-400" />
          Co-líder
        </h2>

        {hasAssistant ? (
          <>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col items-center text-center space-y-5">
              <div className="w-20 h-20 rounded-full bg-[#0c49ac] flex items-center justify-center text-3xl font-bold text-white select-none">
                {getInitials(assistantRow.user.name)}
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-semibold">{assistantRow.user.name ?? "—"}</h2>
                <p className="text-sm text-white/50">{assistantRow.user.email}</p>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-300">
                <Shield size={12} />
                Co-líder da Célula
              </span>
            </div>

            <div className="flex justify-end">
              <ActionForm action={onRemoveAssistant} successLabel="Removido" statusPlacement="inline-end">
                <input type="hidden" name="membershipId" value={assistantRow.id} />
                <input type="hidden" name="cellName" value={cell.name} />
                <button
                  type="submit"
                  className="text-xs text-white/30 hover:text-red-400 cursor-pointer transition-colors underline underline-offset-2"
                >
                  Remover co-líder
                </button>
              </ActionForm>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-dashed border-white/15 p-8 flex flex-col items-center text-center space-y-2">
              <Shield size={32} className="text-white/20 mb-1" />
              <h2 className="font-medium text-white/80">Nenhum co-líder definido</h2>
              <p className="text-sm text-white/40 max-w-xs">
                Escolha um membro abaixo para ser co-líder desta célula.
              </p>
            </div>

            {availableUsers.length === 0 ? (
              <p className="text-sm text-white/40 text-center">Nenhum membro disponível.</p>
            ) : (
              <LeaderCandidatesList
                users={availableUsers}
                cell={cell}
                action={onAssignAssistant}
                buttonLabel="Tornar Co-líder"
                buttonIcon={<Shield size={13} />}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}
