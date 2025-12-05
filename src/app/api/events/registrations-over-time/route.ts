import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function POST(req: Request) {
  const body = await req.json();
  const { event_id, from, to } = body;

  if (!event_id) {
    return NextResponse.json(
      { error: "Missing event_id" },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseAdmin();

  // Ajuste o nome da tabela se for diferente
  let query = supabase
    .from("registrations")
    .select("created_at")
    .eq("event_id", event_id)
    .order("created_at", { ascending: true });

  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", to + " 23:59:59");

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching registrations over time:", error);
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }

  if (!data || data.length === 0) return NextResponse.json([]);

  // -------- PROCESSAMENTO DOS DADOS -------- //
  const countsByDay = new Map<string, number>();

  data.forEach((row) => {
    const day = row.created_at.slice(0, 10); // YYYY-MM-DD
    countsByDay.set(day, (countsByDay.get(day) ?? 0) + 1);
  });

  const sortedDays = Array.from(countsByDay.keys()).sort();

  let cumulative = 0;
  const result = sortedDays.map((day) => {
    const registrations_in_day = countsByDay.get(day) ?? 0;
    cumulative += registrations_in_day;

    return {
      day,
      registrations_in_day,
      registrations_cumulative: cumulative,
    };
  });

  return NextResponse.json(result);
}