import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { resolveEventAccess } from "@/utils/auth/resolveEventAccess";
import { canDeleteRegistration } from "@/utils/auth/eventAccess";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { id: string };

    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const access = await resolveEventAccess();
    if (!canDeleteRegistration(access)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const supabase = createSupabaseAdmin();

    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", body.id);

    if (error) {
      console.error("❌ Error deleting registration:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("❌ Unexpected error in delete registration:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
