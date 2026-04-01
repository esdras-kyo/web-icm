import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function onlyDigits(v: unknown) {
  return String(v ?? "").replace(/\D/g, "");
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json<{ ok: boolean }>({ ok: false }, { status: 401 });

  const body = await req.json();
  const phone = onlyDigits(body.phone);

  if (!phone) {
    return NextResponse.json<{ ok: boolean; error: string }>(
      { ok: false, error: "phone_required" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("users")
    .update({ phone })
    .eq("clerk_user_id", userId);

  if (error) {
    console.error("Erro ao atualizar telefone no Supabase:", error);
    return NextResponse.json<{ ok: boolean }>({ ok: false }, { status: 500 });
  }

  return NextResponse.json<{ ok: boolean }>({ ok: true });
}
