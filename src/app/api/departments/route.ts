import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdmin } from "../../../utils/supabase/admin"; // ajuste o path se preciso

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdmin();

  try {
    // 1) pega o id interno do seu usuário
    const { data: userRow, error: userErr } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (userErr || !userRow) {
      throw new Error("user not found");
    }

    // 2) pega os departments onde ele é LEADER (escopo DEPARTMENT)
    const { data: leaderRoles, error: roleErr } = await supabase
      .from("role_assignments")
      .select("department_id")
      .eq("user_id", userRow.id)
      .eq("scope_type", "DEPARTMENT")
      .eq("role", "LEADER")
      .not("department_id", "is", null);

    if (roleErr) throw roleErr;

    const leaderDeptIds = Array.from(
      new Set((leaderRoles ?? []).map(r => r.department_id as string))
    );

    if (leaderDeptIds.length > 0) {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .in("id", leaderDeptIds)
        .order("name", { ascending: true });

      if (error) throw error;
      return NextResponse.json(data);
    } else {

      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return NextResponse.json(data);
    }
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "unknown" }, { status: 500 });
  }
}