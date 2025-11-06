'use client';
import { useEffect, useState, useTransition } from 'react';
import { useParams } from 'next/navigation';
import { addRoleAction, removeRoleAction } from './rolesActions';

type Dept = { id: string; name: string };
type Role = {
  id: string;
  role: string;
  scope_type?: 'ORG' | 'DEPARTMENT';
  department_id?: string | null;
  department?: { id: string; name: string } | null;
};
type User = {
  id: string;
  name: string | null;
  email: string | null;
  roles: Role[];
};

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const userId = params.id;

  const [user, setUser] = useState<User | null>(null);
  const [depts, setDepts] = useState<Dept[]>([]);
  const [pending, startTransition] = useTransition();

  const [role, setRole] = useState<'ADMIN'|'LEADER'|'MEMBER'>('MEMBER');
  const [scope, setScope] = useState<'ORG'|'DEPARTMENT'>('ORG');
  const [deptId, setDeptId] = useState<string>('');

  async function load() {
    const [uRes, dRes] = await Promise.all([
      fetch("/api/getBros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      }),
      fetch(`/api/departments?limit=200`, { cache: "force-cache" }),
    ]);
  
    const uData = await uRes.json();
    const dData = await dRes.json();
  
    setUser(uData);
    setDepts(dData);
  }

  useEffect(() => { load(); }, [userId]);

  async function onAddRole(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const form = new FormData();
      form.set('user_id', userId);
      form.set('role', role);
      form.set('scope_type', scope);
      if (scope === 'DEPARTMENT') form.set('department_id', deptId);
      const res = await addRoleAction(form);
      if (res?.success) await load();
      else alert(res?.message || 'Falha ao adicionar role');
    });
  }

  async function onRemoveRole(roleId: string) {
    startTransition(async () => {
      const form = new FormData();
      form.set('role_assignment_id', roleId);
      form.set('user_id', userId);
      const res = await removeRoleAction(form);
      if (res?.success) await load();
      else alert(res?.message || 'Falha ao remover role');
    });
  }

  if (!user) return <main className="p-8 text-white">Carregando...</main>;

  return (
    <main className="mx-auto max-w-3xl p-6 text-white">
      <h1 className="text-2xl font-bold mb-2">{user.name || 'Sem nome'}</h1>
      <p className="text-white/70 mb-6">{user.email}</p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Papeis atuais</h2>
        {user.roles?.length ? (
          <ul className="space-y-2">
            {user.roles.map((r) => (
              <li key={r.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="space-x-2">
                  <span className="text-sm">{r.role}</span>
                  <span className="text-xs text-white/60">[{r.scope_type || 'ORG'}]</span>
                  {r.department?.name && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                      {r.department.name}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onRemoveRole(r.id)}
                  disabled={pending}
                  className="rounded-md border border-white/20 bg-white/10 px-3 py-1 text-sm hover:bg-white/15 disabled:opacity-50"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white/60">Sem papeis.</p>
        )}
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Adicionar papel</h2>
        <form onSubmit={onAddRole} className="grid gap-3 md:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-white/70">Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'ADMIN' | 'LEADER' | 'MEMBER')}
              className="rounded-md border border-white/20 bg-transparent p-2"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="LEADER">LEADER</option>
              <option value="MEMBER">MEMBER</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-white/70">Escopo</span>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as 'ORG'|'DEPARTMENT')}
              className="rounded-md border border-white/20 bg-transparent p-2"
            >
              <option value="ORG">ORG</option>
              <option value="DEPARTMENT">DEPARTMENT</option>
            </select>
          </label>

          {scope === 'DEPARTMENT' && (
            <label className="flex flex-col gap-1 md:col-span-1">
              <span className="text-xs text-white/70">Departamento</span>
              <select
                value={deptId}
                onChange={(e) => setDeptId(e.target.value)}
                className="rounded-md border border-white/20 bg-transparent p-2"
              >
                <option value="">Selecione...</option>
                {depts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </label>
          )}

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={pending || (scope === 'DEPARTMENT' && !deptId)}
              className="rounded-md border border-white/20 bg-white/10 px-4 py-2 hover:bg-white/15 disabled:opacity-50"
            >
              {pending ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}