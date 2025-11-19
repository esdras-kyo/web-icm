import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createSupabaseAdmin();

    // 🔐 Evita inserir lixo inesperado
    const payload = {
      event_id: body.event_id,
      name: body.name,
      cpf: body.cpf ?? null,
      phone: body.phone ?? null,
      email: body.email ?? null,
      payment_status: body.payment_status ?? "pending",

      // extras do registro que você configurou
      shirt_size: body.shirt_size ?? null,
      is_member: body.is_member ?? null,
      age: body.age ?? null,
    };

    const { data, error } = await supabase
      .from("registrations")
      .insert(payload)
      .select("id")        // ← retorna o ID gerado
      .single();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("❌ Unexpected error in add-sub:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}