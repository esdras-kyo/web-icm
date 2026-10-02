// app/api/registrations/set-status/route.ts
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { resolveEventAccess } from "@/utils/auth/resolveEventAccess";
import { canSetStatus } from "@/utils/auth/eventAccess";

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      id: string;
      payment_status: "pending" | "paid" | "failed";
    };

    if (!body.id || !body.payment_status) {
      return NextResponse.json(
        { error: "Missing id or payment_status" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Escopo é por evento; set-status só recebe o id do inscrito,
    // então busca o event_id do registro antes de autorizar.
    const { data: reg, error: regErr } = await supabase
      .from("registrations")
      .select("event_id")
      .eq("id", body.id)
      .maybeSingle();

    if (regErr) {
      return NextResponse.json({ error: regErr.message }, { status: 500 });
    }
    if (!reg) {
      return NextResponse.json({ error: "Registro não encontrado" }, { status: 404 });
    }

    const access = await resolveEventAccess();
    if (!canSetStatus(access, reg.event_id)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { error } = await supabase
      .from("registrations")
      .update({ payment_status: body.payment_status })
      .eq("id", body.id);

    if (error) {
      console.error("❌ Error updating payment_status:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("❌ Unexpected error in set-status:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
