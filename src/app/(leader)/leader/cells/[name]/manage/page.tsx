import Link from "next/link";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { addInformalMemberAction } from "./actions/addInformalMember";
import { removeInformalMemberAction } from "./actions/removeInformalMember";
import { CollapsibleCard } from "../../_components/CollapsibleCard";
import type { PostgrestError } from "@supabase/supabase-js";
import { ActionForm } from "./ActionForm";
import { MeetingForm } from "../../_components/MeetingForm";

const rowCard =
  "rounded-md border p-3 bg-white/5 ring-1 ring-white/10 text-white";
const titleTxt = "font-medium break-words min-w-0";
const btnBase =
  "cursor-pointer rounded-md border px-2 py-1 text-sm disabled:opacity-50 shrink-0";

export default async function ManageCellPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const cellName = decodeURIComponent(name);

  const supabase = createSupabaseAdmin();

  const onAddInformalMember = async (formData: FormData): Promise<void> => {
    "use server";
    await addInformalMemberAction(formData);
  };

  const onRemoveInformalMember = async (formData: FormData): Promise<void> => {
    "use server";
    await removeInformalMemberAction(formData);
  };

  const { data: cell, error: cellErr } = await supabase
    .from("cells")
    .select("id, name")
    .eq("name", cellName)
    .single();

  if (cellErr || !cell) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <div className="mb-4">
          <Link href="/leader/cells" className="text-sm underline">
            ← Voltar
          </Link>
        </div>
        <p className="text-red-600">Célula não encontrada.</p>
      </div>
    );
  }

  const { data: members } = await supabase
    .from("cell_memberships")
    .select("role, user:users(id, name)")
    .eq("cell_id", cell.id)
    .eq("role", "LEADER")
    .limit(1) as {
      data: { role: string; user: { id: string; name: string | null } }[] | null;
      error: PostgrestError | null;
    };

  const { data: informalMembers } = await supabase
    .from("cell_informal_members")
    .select("id, name")
    .eq("cell_id", cell.id)
    .order("name", { ascending: true }) as {
      data: { id: string; name: string }[] | null;
      error: PostgrestError | null;
    };

  const leaderUserId = members?.[0]?.user?.id ?? undefined;
  const leaderName = members?.[0]?.user?.name ?? undefined;
  const informalCount = informalMembers?.length ?? 0;

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm">
            <Link href="/leader/cells" className="underline">
              ← Voltar
            </Link>
          </div>
          <h1 className="text-2xl font-semibold mt-2">{cell.name}</h1>
        </div>
      </div>

      <MeetingForm
        cellId={cell.id}
        leaderName={leaderName}
        leaderUserId={leaderUserId}
        defaultMembersCount={informalCount > 0 ? informalCount : undefined}
      />

      <CollapsibleCard
        title="Membros"
        subtitle={`${informalCount} membro(s) cadastrado(s)`}
      >
        <div className=" space-y-3">
          <ActionForm action={onAddInformalMember} className="flex gap-2" statusPlacement="inline-end">
            <input type="hidden" name="cellId" value={cell.id} />
            <input type="hidden" name="cellName" value={cell.name} />
            <input
              type="text"
              name="name"
              required
              placeholder="Nome do membro"
              className="flex-1 rounded-md border border-white/10 bg-transparent px-3 py-1 text-sm"
            />
            <button type="submit" className={btnBase}>
              Adicionar
            </button>
          </ActionForm>

          <div className="max-h-[60vh] overflow-auto space-y-2 pt-1">
            {!informalMembers || informalMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum membro adicionado ainda.</p>
            ) : (
              informalMembers.map((im) => (
                <div key={im.id} className={`${rowCard} flex items-center justify-between gap-3`}>
                  <span className={`${titleTxt} flex-1 truncate min-w-2/3`}>{im.name}</span>
                  <ActionForm action={onRemoveInformalMember} className=" ml-auto flex items-center justify-center" statusPlacement="inline-end" successLabel="Removido">
                    <input type="hidden" name="informalMemberId" value={im.id} />
                    <input type="hidden" name="cellName" value={cell.name} />
                    <button type="submit" className={`${btnBase} border-red-400/50 hover:border-red-400/80`}>
                      Remover
                    </button>
                  </ActionForm>
                </div>
              ))
            )}
          </div>
        </div>
      </CollapsibleCard>
    </div>
  );
}
