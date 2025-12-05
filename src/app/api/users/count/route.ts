import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function GET() {
  const supabase = await createSupabaseAdmin();

  // Troca "profiles" pelo nome da tua tabela de usuários se for diferente
  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error counting users:", error);
    return NextResponse.json(
      { error: "Erro ao contar usuários" },
      { status: 500 }
    );
  }

  return NextResponse.json({ total: count ?? 0 });
}