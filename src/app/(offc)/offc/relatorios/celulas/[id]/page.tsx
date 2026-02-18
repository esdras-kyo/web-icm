import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

function formatDateBR(isoDate: string) {
  // isoDate vem tipo "2026-01-28"
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}

type EmbeddedUser = { id: string; name: string } | null;

export type CellMeeting = {
  id: string;
  cell_id: string | null;
  occurred_at: string | null;
  notes: string | null;

  leader: EmbeddedUser | null;

  assistant_user_id: string | null;
  host_user_id: string | null;
  members_count: number | null;
  attendees_count: number | null;
  icebreaker_rate: number | null;
  worship_rate: number | null;
  word_rate: number | null;
  sunday_attendance_count: number | null;
  visitors_count: number | null;
  created_at: string;
};

function Stars({ value }: { value: number | null }) {
  const v = Math.max(0, Math.min(5, Number(value ?? 0)));
  const filled = "★".repeat(v);
  const empty = "☆".repeat(5 - v);
  return (
    <span className="text-lg leading-none" aria-label={`${v} de 5`}>
      {filled}
      <span className="opacity-40">{empty}</span>
    </span>
  );
}
export default async function CellMeetingReadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createSupabaseAdmin();
  const { id } = await params;

  if (!id) notFound();

  const { data, error } = await supabase
    .from("cell_meetings")
    .select(
      `
      id,
      cell_id,
      occurred_at,
      notes,
      leader:leader_user_id (
        id,
        name
      ),
      assistant_user_id,
      host_user_id,
      members_count,
      attendees_count,
      icebreaker_rate,
      worship_rate,
      word_rate,
      sunday_attendance_count,
      visitors_count,
      created_at
    `
    )
    .eq("id", id)
    .maybeSingle();

    const meeting = data as CellMeeting | null;

  if (error) {
    // log server-side; na UI só mostra "não encontrado"
    console.error("cell_meetings read error:", error);
  }

  if (!meeting) notFound();

  const { data: cell } = await supabase
    .from("cells")
    .select("id, name")
    .eq("id", meeting.cell_id)
    .maybeSingle();

  const occurredAtTxt = meeting.occurred_at
    ? formatDateBR(String(meeting.occurred_at))
    : "-";

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6 text-white">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm">
            <Link href="/offc/relatorios/celulas" className="underline">
              ← Voltar
            </Link>
          </div>

          <h1 className="text-2xl mt-2 wrap-break-words">
            Célula{cell?.name ? ` - ${cell.name}` : ""}
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Data da reunião: <span className="text-white">{occurredAtTxt}</span>
          </p>
        </div>

        <span className="text-xs text-muted-foreground whitespace-nowrap">
          #{meeting.id}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-white/10 bg-white/3 p-4">
          <h2 className="text-sm font-semibold mb-3">Pessoas</h2>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Líder</span>
              <span className="text-white text-right wrap-break-words">
                {meeting.leader?.name ?? "-"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Líder em treinamento</span>
              <span className="text-white text-right wrap-break-words">
                {meeting.assistant_user_id ?? "-"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Anfitrião</span>
              <span className="text-white text-right wrap-break-words">
                {meeting.host_user_id ?? "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-white/10 bg-white/3 p-4">
          <h2 className="text-sm font-semibold mb-3">Números</h2>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Qtd. de membros</span>
              <span>{meeting.members_count ?? "-"}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Presentes na reunião</span>
              <span>{meeting.attendees_count ?? "-"}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Presentes no culto (domingo)</span>
              <span>{meeting.sunday_attendance_count ?? "-"}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Visitantes</span>
              <span>{meeting.visitors_count ?? "-"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-white/10 bg-white/3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Avaliações</h2>
            <p className="text-xs text-muted-foreground mt-1">De 0 a 5 estrelas.</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Quebra-gelo</p>
            <div className="mt-1">
              <Stars value={meeting.icebreaker_rate} />
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Louvor</p>
            <div className="mt-1">
              <Stars value={meeting.worship_rate} />
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Palavra</p>
            <div className="mt-1">
              <Stars value={meeting.word_rate} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-white/10 bg-white/3 p-4">
        <h2 className="text-sm font-semibold mb-2">Anotações</h2>
        {meeting.notes ? (
          <p className="text-sm whitespace-pre-wrap wrap-break-words">{meeting.notes}</p>
        ) : (
          <p className="text-sm text-muted-foreground">Sem anotações.</p>
        )}
      </div>
    </div>
  );
}