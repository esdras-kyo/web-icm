import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

type Meeting = {
  id: string;
  department_id: string | null;
  title: string | null;
  description: string | null;
  members: unknown[] | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type Department = { id: string; name: string | null };
type UserMini = { id: string; name: string | null; email: string | null };

function formatDateTimeBR(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(d);
}

function pickUserLabel(u: UserMini | null) {
  return u?.name ?? u?.email ?? "—";
}

export default async function MinistryMeetingReadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createSupabaseAdmin();

  if (!id) notFound();

  const { data: meeting, error } = await supabase
    .from("meetings")
    .select("id, department_id, title, description, members, created_by, created_at, updated_at")
    .eq("id", id)
    .maybeSingle<Meeting>();

  if (error) console.error("meetings read error:", error);
  if (!meeting) notFound();

  const [{ data: department }, { data: author }] = await Promise.all([
    meeting.department_id
      ? supabase
          .from("departments")
          .select("id, name")
          .eq("id", meeting.department_id)
          .maybeSingle<Department>()
      : Promise.resolve({ data: null as Department | null }),
    meeting.created_by
      ? supabase
          .from("users")
          .select("id, name, email")
          .eq("id", meeting.created_by)
          .maybeSingle<UserMini>()
      : Promise.resolve({ data: null as UserMini | null }),
  ]);

  const title = meeting.title?.trim() || "Reunião (sem título)";
  const deptName = department?.name ?? "Sem ministério";
  const createdAt = meeting.created_at ? formatDateTimeBR(meeting.created_at) : "—";
  const authorLabel = pickUserLabel(author ?? null);

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 text-white space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link href="/offc/relatorios/ministerios" className="text-sm underline">
            ← Voltar
          </Link>

          <h1 className="mt-2 text-2xl font-semibold wrap-break-word">{title}</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {deptName} • {createdAt} • <span className="text-white/80">Por:</span>{" "}
            {authorLabel}
          </p>

          {meeting.updated_at ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Atualizado em: {formatDateTimeBR(meeting.updated_at)}
            </p>
          ) : null}
        </div>

        <div className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
          #{meeting.id}
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/3 p-4">
        <h2 className="text-sm font-semibold mb-2">Descrição</h2>
        {meeting.description?.trim() ? (
          <p className="text-sm whitespace-pre-wrap wrap-break-words">{meeting.description}</p>
        ) : (
          <p className="text-sm text-muted-foreground">Sem descrição.</p>
        )}
      </div>

      <div className="rounded-lg border border-white/10 bg-white/3 p-4">
        <h2 className="text-sm font-semibold mb-2">Membros</h2>
        {Array.isArray(meeting.members) && meeting.members.length ? (
          <ul className="list-disc pl-5 text-sm space-y-1">
            {meeting.members.map((x, idx) => (
              <li key={idx} className="wrap-break-words">
                {typeof x === "string" ? x : JSON.stringify(x)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Sem membros listados.</p>
        )}
      </div>
    </div>
  );
}