// app/(dashboard)/materials/page.tsx
import { getFilesAction } from "./actions";
import  MateriaisClient  from "./Materiais";

export const dynamic = "force-static";      // ou "auto"
export const revalidate = 300;              // fallback de revalidate para a página

const API = "/api/files/list";
const DEFAULT_VIS: "ORG" | "DEPARTMENT" = "ORG";

export default async function MaterialsPage() {
  const initial = await getFilesAction({ api: API, visibility: DEFAULT_VIS });

  return (
    <MateriaisClient
      api={API}
      defaultVisibility={DEFAULT_VIS}
      initialRows={initial}
    />
  );
}