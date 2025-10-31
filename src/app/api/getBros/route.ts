import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function POST(req: Request) {
  const supabase = createSupabaseAdmin();
  const body = await req.json().catch(() => ({}));
  const bodyObj = body as Record<string, unknown>;
  const id = typeof bodyObj.id === "string" ? bodyObj.id : undefined;

  const baseQuery = supabase
    .from("users")
    .select(
      `
      id,
      name,
      email,
      date_of_birth,
      public_code,
      created_at,
      baptized,
      gender,
      roles:role_assignments (
        id,
        role,
        scope_type,
        department_id,
        department:departments (
          id,
          name
        )
      )
    `
    )
    .order("name", { ascending: true });

  const query = id ? baseQuery.eq("id", id) : baseQuery;

  const { data, error } = await query;

  if (error) {
    console.error("GET users error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  return NextResponse.json(id ? data[0] : data);
}