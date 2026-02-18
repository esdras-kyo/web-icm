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
  const updatedAt = meeting.updated_at ? formatDateTimeBR(meeting.updated_at) : null;
  const authorLabel = pickUserLabel(author ?? null);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-8 sm:py-10 text-white space-y-4 sm:space-y-6">
      <header className="space-y-3">
        <Link
          href="/offc/relatorios/ministerios"
          className="cursor-pointer inline-flex text-sm underline underline-offset-4 text-white/90 hover:text-white"
        >
          ← Voltar
        </Link>
  
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold wrap-break-words">
            {title}
          </h1>
  
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <span className="text-white/80">Ministério:</span>{" "}
              {deptName}
            </p>
  
            <p>
              <span className="text-white/80">Criado em:</span>{" "}
              {createdAt}
            </p>
  
            <p>
              <span className="text-white/80">Por:</span>{" "}
              {authorLabel}
            </p>
  
            {updatedAt ? (
              <p className="text-xs">
                Atualizado em: {updatedAt}
              </p>
            ) : null}
          </div>
        </div>
  
        <p className="text-xs text-muted-foreground break-all">
          ID: {meeting.id}
        </p>
      </header>

      <section className="grid gap-4 sm:gap-6">
        <div className="rounded-lg border border-white/10 bg-white/3 p-4 sm:p-5">
          <h2 className="text-sm font-semibold mb-2">Descrição</h2>
          {meeting.description?.trim() ? (
            <p className="text-sm whitespace-pre-wrap wrap-break-words text-white/95">
              {meeting.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Sem descrição.</p>
          )}
        </div>

        <div className="rounded-lg border border-white/10 bg-white/3 p-4">
        <h2 className="text-sm font-semibold mb-2">Membros Presentes</h2>
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
      </section>
    </div>
  );
}