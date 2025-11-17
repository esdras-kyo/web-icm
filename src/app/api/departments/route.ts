import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdmin } from "../../../utils/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const supabase = createSupabaseAdmin();

    // pega query param: /api/departments?mode=all
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode"); // "all" ou null

    // 1) pega id interno do usuário
    const { data: userRow, error: userErr } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (userErr || !userRow) {
      // aqui não precisa mais derrubar com 500
      return NextResponse.json(
        { error: "user not found in users table" },
        { status: 404 }
      );
    }

    // 2) Se o modo for "all", exige que seja ADMIN global
    if (mode === "all") {
      const { data: adminRole, error: adminErr } = await supabase
        .from("role_assignments")
        .select("id")
        .eq("user_id", userRow.id)
        .eq("scope_type", "ORG")
        .eq("role", "ADMIN")
        .maybeSingle(); // se não tiver, volta null

      if (adminErr) {
        console.error("adminErr", adminErr);
        return NextResponse.json(
          { error: "error checking admin role", details: adminErr.message },
          { status: 500 }
        );
      }

      if (!adminRole) {
        // não é admin => proibido ver todos
        return NextResponse.json(
          { error: "forbidden: admin only" },
          { status: 403 }
        );
      }

      // ADMIN → pode ver todos os departamentos
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("all departments error", error);
        return NextResponse.json(
          { error: "error fetching all departments", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json(data);
    }

    // 3) Modo padrão → filtra pelos departamentos onde ele é LEADER
    const { data: leaderRoles, error: roleErr } = await supabase
      .from("role_assignments")
      .select("department_id")
      .eq("user_id", userRow.id)
      .eq("scope_type", "DEPARTMENT")
      .eq("role", "LEADER")
      .not("department_id", "is", null);

    if (roleErr) {
      console.error("roleErr", roleErr);
      return NextResponse.json(
        { error: "error fetching leader roles", details: roleErr.message },
        { status: 500 }
      );
    }

    const leaderDeptIds = Array.from(
      new Set(
        (leaderRoles ?? [])
          .map(r => r.department_id)
          .filter(Boolean) as string[]
      )
    );

    if (leaderDeptIds.length > 0) {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .in("id", leaderDeptIds)
        .order("name", { ascending: true });

      if (error) {
        console.error("departments by ids error", error);
        return NextResponse.json(
          { error: "error fetching departments", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json(data);
    }

    // se não for LEADER em nada, devolve lista vazia ou todos? aqui optei vazia
    return NextResponse.json([]);
  } catch (err: unknown) {
    console.error("unexpected error /api/departments", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown" },
      { status: 500 }
    );
  }
}