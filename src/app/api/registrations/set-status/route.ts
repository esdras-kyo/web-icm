// app/api/registrations/set-status/route.ts
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

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