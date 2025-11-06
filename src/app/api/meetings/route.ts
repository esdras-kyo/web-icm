import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { decodeJwt } from "jose";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

type MemberJwtClaims = {
    claims?: {
      app_user_id?: string; 
      roles?: Array<{ role: string }>;
    };
    sub?: string;
  };

export async function POST(req: Request) {

  const { userId, getToken } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  try {
    const body = await req.json();

    const { title, description, members, department_id} = body;

    if (!department_id) {
      return NextResponse.json(
        { error: "O id do departamento é obrigatório." },
        { status: 400 }
      );
    }
    const jwt = await getToken({ template: "member_jwt" });
    if (!jwt) {
      return NextResponse.json({ error: "Token ausente." }, { status: 401 });
    }

    const decoded = decodeJwt(jwt) as MemberJwtClaims;
    const appUserId = decoded?.claims?.app_user_id;

    const { data, error } = await supabase
      .from("meetings")
      .insert([
        {
          title,
          description,
          members,
          department_id,
          created_by: appUserId,
        },
      ])
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    console.error("Erro ao criar meeting:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown" },
      { status: 500 }
    );
  }
}