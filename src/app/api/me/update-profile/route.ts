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
  if (!userId) return NextResponse.json({ ok: false }, { status: 401 });

  const body = await req.json();

  const {
    birth_date,
    gender,
    baptized,

    cpf,
    phone,
    accept_privacy,
    accept_privacy_at,
  } = body;

  if (!accept_privacy) {
    return NextResponse.json(
      { ok: false, error: "privacy_not_accepted" },
      { status: 400 }
    );
  }

  const updateData = {
    date_of_birth: birth_date,
    gender,
    baptized: !!baptized,

    cpf: cpf ? onlyDigits(cpf) : null,
    phone: phone ? onlyDigits(phone) : null,

    accept_privacy: true,
    accept_privacy_at: accept_privacy_at
      ? new Date(accept_privacy_at).toISOString()
      : new Date().toISOString(),
  };


  const { error } = await supabase
    .from("users")
    .update(updateData)
    .eq("clerk_user_id", userId)
    .select("id")
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}