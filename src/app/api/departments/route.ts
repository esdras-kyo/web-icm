// app/api/departments/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"
import { createSupabaseAdmin } from "../../../utils/supabase/admin"; // ajuste o path

type Role = { role: string; scope?: string | null; department_id?: string | null };

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const roles = (session.user as any)?.roles as Role[] | undefined;
  const isAdmin = !!roles?.some(r => r.role === "ADMIN" && (r.scope === "ORG" || r.scope == null));

  const supabase = createSupabaseAdmin();

  try {
    if (isAdmin) {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return NextResponse.json(data);
    }

    // pega os department_ids onde o user tem QUALQUER role vinculada
    const userId = session.user?.id; // garanta que está colocando o id na session
    const { data: ras, error: e1 } = await supabase
      .from("role_assignments")
      .select("department_id")
      .eq("user_id", userId)
      .not("department_id", "is", null);
    if (e1) throw e1;

    const deptIds = Array.from(new Set((ras ?? []).map(r => r.department_id!).filter(Boolean)));
    if (deptIds.length === 0) return NextResponse.json([]);

    const { data, error: e2 } = await supabase
      .from("departments")
      .select("*")
      .in("id", deptIds)
      .order("name", { ascending: true });
    if (e2) throw e2;

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "unknown" }, { status: 500 });
  }
}