// /app/leader/cells/[name]/manage/page.tsx
import Link from "next/link";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { addMemberAction } from "./actions/addMember";
import { changeRoleAction } from "./actions/changeRole";
import { removeMemberAction } from "./actions/removeMember";
import { MeetingForm } from "../../_components/MeetingForm";
import { CollapsibleCard } from "../../_components/CollapsibleCard";

type MemberRow = {
  id: string;                 // membership id
  role: "LEADER" | "ASSISTANT" | "MEMBER";
  user: { id: string; name: string; email: string | null };
};

export default async function ManageCellPage({
  params,
}: {
  // 👇 importante: params é Promise agora
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;                  // <-- aguarda params
  const cellName = decodeURIComponent(name);

  const supabase = createSupabaseAdmin();

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
          <Link href="/leader/cells" className="text-sm underline">
            ← Voltar
          </Link>
        </div>
        <p className="text-red-600">Célula não encontrada.</p>
      </div>
    );
  }

  // 2) Buscar TODOS usuários
  const { data: users, error: usersErr } = await supabase
    .from("users")
    .select("id, name, email")
    .order("name", { ascending: true });

  // 3) Buscar membros da célula (com user em join)
  const { data: members, error: membersErr } = await supabase
    .from("cell_memberships")
    .select("id, role, user:users(id, name, email)")
    .eq("cell_id", cell.id)
    .order("role", { ascending: true });

  const memberOptions =
    members?.map((m) => ({
      userId: m.user?.id,
      name: m.user?.name,
    })) ?? [];

    const currentUserId = "14607714-5f33-4be3-97e0-8156a74a8736";

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm">
            <Link href="/leader/cells" className="underline">
              ← Voltar
            </Link>
          </div>
          <h1 className="text-2xl font-semibold mt-2">Gerenciar célula</h1>
          <p className="text-muted-foreground">{cell.name}</p>
        </div>
      </div>

      {/* ERROS SIMPLES */}
      {(usersErr || membersErr) && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Não foi possível carregar {usersErr ? "usuários" : "membros"}.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* COLUNA: TODOS OS USUÁRIOS */}
        <CollapsibleCard
  title="Adicionar membro"
  subtitle="Adicione alguém à célula e escolha o papel."
>
  {/* aqui vem o conteúdo atual do bloco */}


          <div className="p-4 border-b">
            <h2 className="font-medium">Todos os usuários</h2>
            <p className="text-xs text-muted-foreground">
              Adicione alguém à célula e escolha o papel.
            </p>
          </div>

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
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {u.email ?? "sem e-mail"}
                      </div>
                    </div>

                    {/* Form simples para adicionar membro */}
                    <form action={addMemberAction} className="flex items-center gap-2">
                      <input type="hidden" name="cellId" value={cell.id} />
                      <input type="hidden" name="userId" value={u.id} />

                      <select
                        name="role"
                        className="rounded-md border px-2 py-1 text-sm"
                        defaultValue="MEMBER"
                        disabled={alreadyMember}
                      >
                        <option value="LEADER">LEADER</option>
                        <option value="ASSISTANT">ASSISTANT</option>
                        <option value="MEMBER">MEMBER</option>
                      </select>

                      <button
                        type="submit"
                        disabled={alreadyMember}
                        className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                      >
                        {alreadyMember ? "Já é membro" : "Adicionar"}
                      </button>
                    </form>
                  </div>
                );
              })
            )}
          </div>
 
        </CollapsibleCard>

        {/* COLUNA: MEMBROS DA CÉLULA */}
        <CollapsibleCard
  title="Membros da célula"
  subtitle="Altere o papel ou remova da célula."
>

          <div className="p-4 border-b">
            <h2 className="font-medium">Membros da célula</h2>
            <p className="text-xs text-muted-foreground">
              Altere o papel ou remova da célula.
            </p>
          </div>

          <div className="p-4 space-y-3 max-h-[70vh] overflow-auto">
            {!members || members.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem membros.</p>
            ) : (
              members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <div className="font-medium">{m.user?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {m.user?.email ?? "sem e-mail"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Trocar papel */}
                    <form action={changeRoleAction} className="flex items-center gap-2">
                      <input type="hidden" name="membershipId" value={m.id} />
                      <input type="hidden" name="cellId" value={cell.id} />
                      <select
                        name="role"
                        className="rounded-md border px-2 py-1 text-sm"
                        defaultValue={m.role}
                      >
                        <option value="LEADER">LEADER</option>
                        <option value="ASSISTANT">ASSISTANT</option>
                        <option value="MEMBER">MEMBER</option>
                      </select>
                      <button type="submit" className="rounded-md border px-3 py-1 text-sm">
                        Salvar
                      </button>
                    </form>

                    {/* Remover */}
                    <form action={removeMemberAction}>
                      <input type="hidden" name="membershipId" value={m.id} />
                      <input type="hidden" name="cellId" value={cell.id} />
                      <button
                        type="submit"
                        className="rounded-md border px-3 py-1 text-sm"
                      >
                        Remover
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </CollapsibleCard>
      </div>
      <section className="rounded-lg border">
  <div className="p-4 border-b">
    <h2 className="font-medium">Novo relatório</h2>
    <p className="text-xs text-muted-foreground">
      Crie um relatório para a célula {cell.name}.
    </p>
  </div>
  <div className="p-4">
    <MeetingForm
      cellId={cell.id}
      members={memberOptions}
      currentUserId={currentUserId}
    />
  </div>
</section>
    </div>
  );
}