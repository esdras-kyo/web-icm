import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: false }, { status: 401 });

  const body = await req.json();
  const { birth_date, gender, baptized } = body;

  const { error } = await supabase
    .from("users")
    .update({ date_of_birth: birth_date, gender, baptized })
    .eq("clerk_user_id", userId)
    .select("id")
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}