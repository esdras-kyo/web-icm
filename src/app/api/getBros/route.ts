import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function GET() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select(
      `
    id,
    name,
    email,
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

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
