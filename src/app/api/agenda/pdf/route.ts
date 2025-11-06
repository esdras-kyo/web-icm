import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import AgendaDoc, { type AgendaRow } from "./AgendaDoc";
import { renderToStream, type DocumentProps } from "@react-pdf/renderer";
import { Readable, type Readable as NodeReadable } from "node:stream";
import React from "react";

export const runtime = "nodejs";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const scope = url.searchParams.get("scope") ?? "leader";
    const year = Number(url.searchParams.get("year") || new Date().getFullYear());
  
    // Se for público, não exige auth. Se for líder, exige.
    if (scope !== "public") {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      // aqui você poderia checar role (LEADER/ADMIN) se quiser
    }
  
    const supabase = createSupabaseAdmin();
  
    // Base da query
    let query = supabase
      .from("agenda_events")
      .select("title, description, event_date, event_time")
      .gte("event_date", `${year}-01-01`)
      .lte("event_date", `${year}-12-31`)
      .order("event_date", { ascending: true });
  
    // No modo público, garanta apenas GLOBAL no servidor
    if (scope === "public") {
      query = query.eq("visibility", "GLOBAL");
    }
  
    const { data = [], error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Cria o elemento React do documento PDF (Server-side)
  const element = React.createElement(AgendaDoc, {
    year,
    events: data as AgendaRow[],
  }) as unknown as React.ReactElement<DocumentProps>;

  const nodeStream = await renderToStream(element);
  const webStream = Readable.toWeb(nodeStream as unknown as NodeReadable);

  return new Response(webStream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="agenda-icm-${year}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}