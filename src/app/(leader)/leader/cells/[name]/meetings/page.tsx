import Link from "next/link";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

function formatYMDToBR(ymd: string) {
  // occurred_at é DATE (YYYY-MM-DD)
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y}`;
}
function formatISOToBRDateTimeUTC(iso: string) {
  // determinístico (UTC) para evitar mismatch
  const s = new Date(iso).toISOString();
  return s.replace("T", " ").slice(0, 16);
}

type Meeting = {
  id: string;
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
};

export default async function CellMeetingsListPage({
  params,
}: {
  // em Next recente, params pode ser Promise
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const cellName = decodeURIComponent(name);

  const supabase = createSupabaseAdmin();

  // 1) Célula
  const { data: cell, error: cellErr } = await supabase
    .from("cells")
    .select("id, name")
    .eq("name", cellName)
    .single();

  if (cellErr || !cell) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-4">
        <div>
          <Link href="/leader/cells" className="underline text-sm">← Voltar</Link>
        </div>
        <p className="text-red-600">Célula não encontrada.</p>
      </div>
    );
  }

  // 2) Relatórios
  const { data: meetings, error: mtgErr } = await supabase
    .from("cell_meetings")
    .select(`
      id, occurred_at, theme, notes, created_at, created_by,
      leader_user_id, assistant_user_id, host_user_id,
      members_count, attendees_count,
      icebreaker_rate, worship_rate, word_rate,
      sunday_attendance_count, visitors_count
    `)
    .eq("cell_id", cell.id)
    .order("occurred_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm">
            <Link href={`/leader/cells/${encodeURIComponent(cell.name)}/manage`} className="underline">
              ← Voltar para a célula
            </Link>
          </div>
          <h1 className="text-2xl font-semibold mt-2">Relatórios da Célula</h1>
          <p className="text-muted-foreground">{cell.name}</p>
        </div>
        <Link href="/leader/cells" className="text-sm underline">Ver todas as células</Link>
      </div>

      {mtgErr && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Não foi possível carregar os relatórios.
        </div>
      )}

      <section className="rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="font-medium">Relatórios</h2>
          <p className="text-xs text-muted-foreground">Mais recentes primeiro.</p>
        </div>

        <div className="p-4 space-y-3">
          {!meetings || meetings.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum relatório cadastrado ainda.</p>
          ) : (
            meetings.map((m: Meeting) => (
              <div key={m.id} className="rounded-md border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {formatYMDToBR(m.occurred_at)}
                    {m.theme ? ` — ${m.theme}` : ""}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 text-sm gap-1">
                  <div><b>Líder:</b> {m.leader_user_id ?? "—"}</div>
                  <div><b>Assistant:</b> {m.assistant_user_id ?? "—"}</div>
                  <div><b>Anfitrião:</b> {m.host_user_id ?? "—"}</div>
                  <div><b>Membros (cad.):</b> {m.members_count ?? "—"}</div>
                  <div><b>Presentes reunião:</b> {m.attendees_count ?? "—"}</div>
                  <div><b>Quebra-gelo:</b> {m.icebreaker_rate ?? "—"}</div>
                  <div><b>Louvor:</b> {m.worship_rate ?? "—"}</div>
                  <div><b>Palavra:</b> {m.word_rate ?? "—"}</div>
                  <div><b>Culto domingo:</b> {m.sunday_attendance_count ?? "—"}</div>
                  <div><b>Visitantes:</b> {m.visitors_count ?? "—"}</div>
                </div>

                {m.notes && <p className="text-sm whitespace-pre-wrap">{m.notes}</p>}

                <div className="text-xs text-muted-foreground">
                  Criado em {formatISOToBRDateTimeUTC(m.created_at)}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}