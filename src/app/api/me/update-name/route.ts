import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json<{ ok: boolean }>({ ok: false }, { status: 401 });

  const body = await req.json();
  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";

  if (!firstName && !lastName) {
    return NextResponse.json<{ ok: boolean; error: string }>(
      { ok: false, error: "name_required" },
      { status: 400 }
    );
  }

  try {
    await (await clerkClient()).users.updateUser(userId, { firstName, lastName });
  } catch (e) {
    console.error("Erro ao atualizar nome no Clerk:", e);
    return NextResponse.json<{ ok: boolean }>({ ok: false }, { status: 500 });
  }

  const name = [firstName, lastName].filter(Boolean).join(" ");
  const { error } = await supabase
    .from("users")
    .update({ name })
    .eq("clerk_user_id", userId);

  if (error) {
    console.error("Erro ao atualizar nome no Supabase:", error);
    return NextResponse.json<{ ok: boolean }>({ ok: false }, { status: 500 });
  }

  return NextResponse.json<{ ok: boolean }>({ ok: true });
}
