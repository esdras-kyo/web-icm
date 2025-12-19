import Link from "next/link";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { addMemberAction } from "./actions/addMember";
import { changeRoleAction } from "./actions/changeRole";
import { removeMemberAction } from "./actions/removeMember";
import { CollapsibleCard } from "../../_components/CollapsibleCard";
import type { PostgrestError } from "@supabase/supabase-js";
import { ActionForm } from "./ActionForm";
import { RoleField } from "./RoleField";

const rowCard =
  "rounded-md border p-3 bg-white/5 ring-1 ring-white/10 text-white";
const titleTxt = "font-medium break-words";
const metaTxt = "text-xs text-muted-foreground break-words";
const actionBar =
  "mt-3 sm:mt-0 flex flex-col sm:flex-row gap-2 sm:gap-2 sm:items-center w-full sm:w-auto";
const actionRow =
  "flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto";
const selectBase =
  "rounded-md border px-2 py-1 text-sm w-full sm:w-[160px] bg-transparent";
const btnBase =
  "cursor-pointer rounded-md border px-3 py-1 text-sm disabled:opacity-50 w-full sm:w-auto";

export type MemberUser = {
  id: string;    
  email: string;    
  name: string | null; 
};

export type CellRole = "LEADER" | "ASSISTANT" | "MEMBER";

export type CellMembershipWithUser = {
  id: string; 
  role: CellRole;  
  user: MemberUser;   
};

export default async function ManageCellPage({
  params,
}: {

  params: Promise<{ name: string }>;
}) {
  const { name } = await params;                  // <-- aguarda params
  const cellName = decodeURIComponent(name);

  const supabase = createSupabaseAdmin();


  const onAddMember = async (formData: FormData): Promise<void> => {
    "use server";
    await addMemberAction(formData);
  };

  const onChangeRole = async (formData: FormData): Promise<void> => {
    "use server";
    await changeRoleAction(formData);
  };

  const onRemoveMember = async (formData: FormData): Promise<void> => {
    "use server";
    await removeMemberAction(formData);
  };

  // 1) Buscar célula por name
  const { data: cell, error: cellErr } = await supabase
    .from("cells")
    .select("id, name")
    .eq("name", cellName)
    .single();

  if (cellErr || !cell) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <div className="mb-4">
          <Link href="/offc/cells" className="text-sm underline">
            ← Voltar
          </Link>
        </div>
        <p className="text-red-600">Célula não encontrada.</p>
      </div>
    );
  }

  const { data: users, error: usersErr } = await supabase
    .from("users")
    .select("id, name, email")
    .order("name", { ascending: true });

  const { data: members, error: membersErr } = await supabase
    .from("cell_memberships")
    .select("id, role, user:users(id, name, email)")
    .eq("cell_id", cell.id)
    .order("role", { ascending: true }) as {
      data: CellMembershipWithUser[] | null;
      error: PostgrestError | null;
    };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm">
            <Link href="/offc/cells" className="underline">
              ← Voltar
            </Link>
          </div>
          <h1 className="text-2xl font-semibold mt-2">Gerenciar</h1>
          <p className="text-muted-foreground">{cell.name}</p>
        </div>
      </div>

      {(usersErr || membersErr) && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Não foi possível carregar {usersErr ? "usuários" : "membros"}.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
        <CollapsibleCard
  title="Adicionar membro"
  subtitle="Adicione alguém e escolha o papel."
>
          <div className="p-4 space-y-3 max-h-[70vh] overflow-auto">
            {!users || users.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum usuário.</p>
            ) : (
              users.map((u) => {
                const alreadyMember = (members ?? []).some(
                  (m) => m.user?.id === u.id
                );

                return (
          <div
            key={u.id}
            className={`${rowCard} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}
          >
            <div className="min-w-0">
              <div className={titleTxt}>{u.name}</div>
              <div className={metaTxt}>{u.email ?? "sem e-mail"}</div>
            </div>

            <ActionForm action={onAddMember} className={`${actionBar}`} statusPlacement="inline-end">
              <div className={actionRow}>
                <input type="hidden" name="cellId" value={cell.id} />
                <input type="hidden" name="cellName" value={cell.name} />
                <input type="hidden" name="userId" value={u.id} />

                <select
                  name="role"
                  className={selectBase}
                  defaultValue="MEMBER"
                  disabled={alreadyMember}
                >
                  <option value="LEADER">Líder</option>
                  <option value="ASSISTANT">Co-líder</option>
                  <option value="MEMBER">Membro</option>
                </select>

                <button
                  type="submit"
                  disabled={alreadyMember}
                  className={btnBase}
                >
                  {alreadyMember ? "Já é membro" : "Adicionar"}
                </button>
              </div>
            </ActionForm>
          </div>
                );
              })
            )}
          </div>
 
        </CollapsibleCard>
        </div>

        {/* COLUNA: MEMBROS DA CÉLULA */}
        <div>
        <CollapsibleCard
  title="Membros"
  subtitle="Altere o papel ou remova"
>

          <div className="p-4 space-y-3 max-h-[70vh] overflow-auto">
            {!members || members.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem membros.</p>
            ) : (
              members.map((m) => (
                <div
                key={m.id}
                className={`${rowCard} flex flex-col gap-3`}
              >
                <div className="min-w-0">
                  <div className={titleTxt}>{m.user?.name}</div>
                  <div className={metaTxt}>{m.user?.email ?? "sem e-mail"}</div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  {/* Trocar papel */}
                  <ActionForm action={onChangeRole} className={`${actionRow}`} statusPlacement="inline-end">
                    <input type="hidden" name="membershipId" value={m.id} />
                    <input type="hidden" name="cellId" value={cell.id} />
                    <input type="hidden" name="cellName" value={cell.name} />
                    <RoleField initial={m.role} />
                  </ActionForm>

                  {/* Remover */}
                  <ActionForm action={onRemoveMember} className={`${actionRow}`} statusPlacement="inline-end" successLabel="Removido">
                    <input type="hidden" name="membershipId" value={m.id} />
                    <input type="hidden" name="cellId" value={cell.id} />
                    <input type="hidden" name="cellName" value={cell.name} />
                    <button type="submit" className={`${btnBase} border-red-400/50 hover:border-red-400/80 md:-ml-8`}>
                      Remover
                    </button>
                  </ActionForm>
                </div>
              </div>
              ))
            )}
          </div>
        </CollapsibleCard>
        </div>
      </div>
    </div>
  );
}