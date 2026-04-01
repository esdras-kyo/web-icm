import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Shield, Crown, User, UserX } from "lucide-react";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { removeRoleAction } from "./rolesActions";
import { AddRoleForm } from "./AddRoleForm";

// ─── helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

interface RoleConfig {
  label: string;
  icon: React.ReactNode;
  className: string;
}

function roleConfig(role: string): RoleConfig {
  switch (role) {
    case "ADMIN":
      return {
        label: "Administrador",
        icon: <Shield size={11} />,
        className: "text-amber-300 border-amber-400/30 bg-amber-400/10",
      };
    case "LEADER":
      return {
        label: "Líder",
        icon: <Crown size={11} />,
        className: "text-blue-300 border-blue-400/30 bg-blue-400/10",
      };
    case "MEMBER":
      return {
        label: "Membro",
        icon: <User size={11} />,
        className: "text-white/70 border-white/20 bg-white/5",
      };
    case "VISITANT":
      return {
        label: "Visitante",
        icon: <User size={11} />,
        className: "text-white/40 border-white/10 bg-white/5",
      };
    default:
      return {
        label: role,
        icon: null,
        className: "text-white/50 border-white/10 bg-white/5",
      };
  }
}

function scopeLabel(scope: string | null | undefined): string {
  if (scope === "DEPARTMENT") return "Ministério";
  return "Organização";
}

// ─── types ───────────────────────────────────────────────────────────────────

type Role = {
  id: string;
  role: string;
  scope_type: "ORG" | "DEPARTMENT" | null;
  department_id: string | null;
  department: { id: string; name: string } | null;
};

type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  public_code: string | number | null;
  created_at: string | null;
  baptized: boolean | null;
  gender: string | null;
  roles: Role[];
};

// ─── page ────────────────────────────────────────────────────────────────────

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createSupabaseAdmin();

  const onRemoveRole = async (formData: FormData): Promise<void> => {
    "use server";
    formData.set("user_id", id);
    await removeRoleAction(formData);
    revalidatePath(`/offc/users/${id}`);
  };

  const [{ data: user }, { data: depts }] = await Promise.all([
    supabase
      .from("users")
      .select(
        `id, name, email, public_code, created_at, baptized, gender,
         roles:role_assignments (
           id, role, scope_type, department_id,
           department:departments (id, name)
         )`
      )
      .eq("id", id)
      .single<UserRow>(),
    supabase
      .from("departments")
      .select("id, name")
      .order("name", { ascending: true }),
  ]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-white">
        <Link href="/offc/users" className="text-sm text-white/50 hover:text-white/80 transition-colors">
          ← Usuários
        </Link>
        <p className="mt-6 text-white/50">Usuário não encontrado.</p>
      </div>
    );
  }

  const genderLabel =
    user.gender === "M" ? "Masculino" : user.gender === "F" ? "Feminino" : null;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8 text-white">
      {/* Back */}
      <Link
        href="/offc/users"
        className="text-sm text-white/50 hover:text-white/80 transition-colors"
      >
        ← Usuários
      </Link>

      {/* Profile card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="shrink-0 w-16 h-16 rounded-full bg-[#0c49ac] flex items-center justify-center text-2xl font-bold select-none">
            {getInitials(user.name)}
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-semibold truncate">{user.name ?? "Sem nome"}</h1>
            <p className="text-sm text-white/50 truncate mt-0.5">{user.email ?? "—"}</p>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-white/35">
              {user.public_code != null && (
                <span>ICM #{user.public_code}</span>
              )}
              {user.created_at && (
                <span>Cadastrado em {formatDate(user.created_at)}</span>
              )}
              {genderLabel && <span>{genderLabel}</span>}
              {user.baptized != null && (
                <span>{user.baptized ? "Batizado" : "Não batizado"}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Current roles */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">
          Permissões
        </h2>

        {!user.roles?.length ? (
          <div className="rounded-2xl border border-dashed border-white/15 p-8 flex flex-col items-center text-center gap-2">
            <UserX size={28} className="text-white/20" />
            <p className="text-sm text-white/40">Nenhuma permissão atribuída.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {user.roles.map((r) => {
              const cfg = roleConfig(r.role);
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </span>
                    <span className="text-sm text-white/50">
                      {scopeLabel(r.scope_type)}
                    </span>
                    {r.department?.name && (
                      <span className="text-sm text-white/35">
                        · {r.department.name}
                      </span>
                    )}
                  </div>

                  <form action={onRemoveRole}>
                    <input type="hidden" name="role_assignment_id" value={r.id} />
                    <button
                      type="submit"
                      className="shrink-0 text-xs text-white/30 hover:text-red-400 cursor-pointer transition-colors"
                    >
                      Remover
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Add role */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">
          Adicionar permissão
        </h2>
        <AddRoleForm userId={user.id} depts={depts ?? []} />
      </section>
    </div>
  );
}
