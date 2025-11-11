"use server";

import { unstable_cache as cache } from "next/cache";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

type Role = {
  id: string;
  role: string;
  scope_type?: "ORG" | "DEPARTMENT";
  department_id?: string | null;
  department?: { id: string; name: string } | null;
};
export type User = {
  id: string;
  name: string | null;
  email: string | null;
  public_code: string
  gender: string | null
  date_of_birth: string | null
  roles: Role[];
};

type DbDepartment = { id: string; name: string } | { id: string; name: string }[] | null;
type DbRoleRow = {
  id: string;
  role: string;
  scope_type?: "ORG" | "DEPARTMENT";
  department_id?: string | null;
  department?: DbDepartment;
};
type DbUserRow = {
  id: string;
  name: string | null;
  email: string | null;
  public_code: string
  gender: string | null
  date_of_birth: string | null
  roles?: DbRoleRow[];
};

async function fetchFromDB(id?: string): Promise<User[] | User | null> {
  const supabase = createSupabaseAdmin();

  const base = supabase
    .from("users")
    .select(`
      id,
      name,
      email,
      gender,
      date_of_birth,
      public_code,
      roles:role_assignments (
        id,
        role,
        scope_type,
        department_id,
        department:departments ( id, name )
      )
    `)
    .order("name", { ascending: true });

  const q = id ? base.eq("id", id) : base;
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  const normalizeUser = (u: DbUserRow): User => ({
    id: u.id,
    name: u.name,
    email: u.email,
    gender: u.gender,
    date_of_birth: u.date_of_birth,
    public_code: u.public_code,
    roles: (u.roles ?? []).map((r: DbRoleRow) => ({
      id: r.id,
      role: r.role,
      scope_type: r.scope_type,
      department_id: r.department_id,
      department: Array.isArray(r.department)
        ? (r.department[0] ? { id: r.department[0].id, name: r.department[0].name } : null)
        : r.department ?? null,
    })),
  });

  if (id) {
    const u = data?.[0];
    return u ? normalizeUser(u) : null;
  }
  return (data ?? []).map(normalizeUser);
}

// lista completa (revalidate 500s)
const _getAll = cache(
  async () => (await fetchFromDB()) as User[],
  ["users:list"],
  { tags: ["users"], revalidate: 500 }
);

// usuário único (revalidate 500s)
const _getById = (id: string) =>
  cache(
    async () => (await fetchFromDB(id)) as User | null,
    [`user:${id}:key`],
    { tags: [`user:${id}`], revalidate: 500 }
  )();

/** getBrosAction: se passar id, retorna 1 usuário; senão, lista completa */
export async function getBrosAction(id?: string) {
  if (id) return _getById(id);
  return _getAll();
}