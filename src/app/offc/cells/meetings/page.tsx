// /app/leader/cells/meetings/page.tsx
import Link from "next/link";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

function formatYMDToBR(ymd: string) {
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y}`;
}
function formatISOToBRDateTimeUTC(iso: string) {
  const s = new Date(iso).toISOString();
  return s.replace("T", " ").slice(0, 16);
}

type MeetingRow = {
  id: string;
  cell_id: string;
  occurred_at: string;
  theme: string | null;
  notes: string | null;
  created_at: string;
  created_by: string;
  leader_user_id: string | null;
  assistant_user_id: string | null;
  host_user_id: string | null;
  members_count: number | null;
  attendees_count: number | null;
  icebreaker_rate: number | null;
  worship_rate: number | null;
  word_rate: number | null;
  sunday_attendance_count: number | null;
  visitors_count: number | null;

  cell?: { name: string } | null;
};

export default async function AllCellMeetingsPage() {
  const supabase = createSupabaseAdmin();
  const { data: meetingsWithEmbed, error: embedErr } = await supabase
    .from("cell_meetings")
    .select(`
      id,
      cell_id,
      occurred_at,
      theme,
      notes,
      created_at,
      created_by,
      leader_user_id,
      assistant_user_id,
      host_user_id,
      members_count,
      attendees_count,
      icebreaker_rate,
      worship_rate,
      word_rate,
      sunday_attendance_count,
      visitors_count,
      cell:cells(name)
    `)
    .order("occurred_at", { ascending: false });

  let meetings: MeetingRow[] = (meetingsWithEmbed ?? []).map(m => ({
    ...m,
    cell: Array.isArray(m.cell) ? m.cell[0] : m.cell
  }));

  // 2) Fallback: se embed falhar (schema/constraints), resolvemos nome da célula manualmente.
  if (embedErr) {
    const { data: meetingsRaw, error: mtgErr } = await supabase
      .from("cell_meetings")
      .select(
        "id, cell_id, occurred_at, theme, notes, created_at, created_by, leader_user_id, assistant_user_id, host_user_id, members_count, attendees_count, icebreaker_rate, worship_rate, word_rate, sunday_attendance_count, visitors_count"
      )
      .order("occurred_at", { ascending: false });

    if (mtgErr) {
      return (
        <div className="max-w-5xl mx-auto py-8">
          <h1 className="text-2xl font-semibold mb-4">Relatórios de Células</h1>
          <p className="text-red-300">Não foi possível carregar os relatórios.</p>
        </div>
      );
    }

    const cellIds = Array.from(new Set((meetingsRaw ?? []).map((m) => m.cell_id)));
    const { data: cells } = await supabase
      .from("cells")
      .select("id, name")
      .in("id", cellIds);

    const cellNameById = new Map<string, string>(
      (cells ?? []).map((c) => [c.id as string, c.name as string])
    );

    meetings = (meetingsRaw ?? []).map((m) => ({
      ...m,
      cell: { name: cellNameById.get(m.cell_id) ?? "(sem nome)" },
    })) as MeetingRow[];
  }

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Relatórios de Células</h1>
        <Link href="/leader/cells" className="text-sm underline">
          Voltar às células
        </Link>
      </div>

      {!meetings?.length ? (
        <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
          Nenhum relatório cadastrado ainda.
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((m) => (
            <div key={m.id} className="rounded-md border p-3 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-medium">
                  {formatYMDToBR(m.occurred_at)}
                  {m.theme ? ` — ${m.theme}` : ""}
                </div>
                <div className="text-xs text-muted-foreground">
                  Célula:{" "}
                  {m.cell?.name ? (
                    <Link
                      href={`/leader/cells/${encodeURIComponent(m.cell.name)}/meetings`}
                      className="underline"
                    >
                      {m.cell.name}
                    </Link>
                  ) : (
                    "—"
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 text-sm gap-1">
                <div>
                  <b>Líder:</b> {m.leader_user_id ?? "—"}
                </div>
                <div>
                  <b>Assistant:</b> {m.assistant_user_id ?? "—"}
                </div>
                <div>
                  <b>Anfitrião:</b> {m.host_user_id ?? "—"}
                </div>
                <div>
                  <b>Membros (cad.):</b> {m.members_count ?? "—"}
                </div>
                <div>
                  <b>Presentes reunião:</b> {m.attendees_count ?? "—"}
                </div>
                <div>
                  <b>Quebra-gelo:</b> {m.icebreaker_rate ?? "—"}
                </div>
                <div>
                  <b>Louvor:</b> {m.worship_rate ?? "—"}
                </div>
                <div>
                  <b>Palavra:</b> {m.word_rate ?? "—"}
                </div>
                <div>
                  <b>Culto domingo:</b> {m.sunday_attendance_count ?? "—"}
                </div>
                <div>
                  <b>Visitantes:</b> {m.visitors_count ?? "—"}
                </div>
              </div>

              {m.notes && <p className="text-sm whitespace-pre-wrap">{m.notes}</p>}

              <div className="text-xs text-muted-foreground">
                Criado em {formatISOToBRDateTimeUTC(m.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}