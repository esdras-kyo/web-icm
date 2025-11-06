export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const visibility = url.searchParams.get("visibility"); // "ORG" | "DEPARTMENT" | null
    const limit = Number(url.searchParams.get("limit") ?? "100");

    const supabase = createSupabaseAdmin();

    let query = supabase
      .from("files")
      .select("id,title,file_key,visibility,created_at")
      .order("created_at", { ascending: false })
      .limit(Math.min(limit, 500));

    if (visibility === "ORG" || visibility === "DEPARTMENT") {
      query = query.eq("visibility", visibility);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const rows = (data ?? []).filter((r) => r.file_key?.toLowerCase().endsWith(".pdf"));

    return NextResponse.json({ files: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "List error" }, { status: 500 });
  }
}