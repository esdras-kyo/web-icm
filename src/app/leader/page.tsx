// app/leader/page.tsx
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
  // MOCKS de dados
  const agenda: AgendaRow[] = [
    {
      id: "1",
      title: "Reunião de planejamento",
      description: "Revisar metas do trimestre e escala de ministério.",
      event_date: "2025-11-03",
      department_name: "Louvor",
      department_id: "dep-louvor",
    },
    {
      id: "2",
      title: "Treinamento de novos líderes",
      description: "Capacitação para novos responsáveis por células.",
      event_date: "2025-11-05",
      department_name: "Discipulado",
      department_id: "dep-discipulado",
    },
  ];

  const files: FileRow[] = [
    {
      id: "f1",
      title: "Manual de Boas Práticas",
      file_key: "manual_boas_praticas.pdf",
      created_at: "2025-10-29T12:00:00Z",
    },
    {
      id: "f2",
      title: "Escala de Louvor - Novembro",
      file_key: "escala_louvor_novembro.pdf",
      created_at: "2025-10-28T09:00:00Z",
    },
  ];

  return (
    <HomeClient
      agenda={agenda}
      files={files}

    />
  );
}