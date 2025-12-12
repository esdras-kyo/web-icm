// app/leader/page.tsx
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import HomeClient from "./HomeClient";

// tipos só pra consistência
type Visibility = "ORG" | "DEPARTMENT";
type AgendaRow = {
  id: string;
  title: string;
  description?: string | null;
  event_date: string;
  event_time?: string | null;
  department_id?: string;
  department_name?: string;
};
type FileRow = {
  id: string;
  title: string | null;
  file_key: string;
  visibility?: Visibility;
  created_at: string;
};

// como ainda não há endpoints, usamos mocks locais
export const revalidate = 120; // 2 minutos de cache opcional

export default async function LeaderHomePage() {
  const supabase = createSupabaseAdmin();

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10); // "YYYY-MM-DD"

  const { data: agendaData, error: agendaError } = await supabase
    .from("agenda_events")
    .select("id, title, description, event_date, event_time")
    .gte("event_date", todayStr)
    .order("event_date", { ascending: true })
    .order("event_time", { ascending: true })
    .limit(5); // pega só os próximos 5 pra home

  if (agendaError) {
    console.error("Erro ao carregar agenda para área do líder:", agendaError);
  }

  const agenda =
    agendaData?.map((ev: AgendaRow) => ({
      id: ev.id as string,
      title: ev.title as string,
      description: ev.description as string | null,
      event_date: ev.event_date as string, // "YYYY-MM-DD"
      event_time: (ev.event_time as string | null) ?? null,

    })) ?? [];



    const { data: filesData, error: filesError } = await supabase
    .from("files")
    .select("id, title, file_key, created_at")
    .order("created_at", { ascending: false })
    .limit(8);

  if (filesError) {
    console.error("Erro ao carregar arquivos para área do líder:", filesError);
  }

  const files =
    filesData?.map((f) => ({
      id: f.id as string,
      title: f.title as string | null,
      file_key: f.file_key as string,
      created_at: f.created_at as string,
    })) ?? [];

  return (
    <HomeClient
      agenda={agenda}
      files={files}

    />
  );
}