// app/(dashboard)/materials/page.tsx
import { getFilesAction } from "./actions";
import  MateriaisClient  from "./Materiais";

export const dynamic = "force-dynamic"; // 👈 impede prerender no build
export const revalidate = 0;             // fallback de revalidate para a página

const API = "/api/files/list";
const DEFAULT_VIS: "ORG" | "DEPARTMENT" = "ORG";

export default async function MaterialsPage() {
  let initial: Awaited<ReturnType<typeof getFilesAction>> = [];
  try {
    initial = await getFilesAction({ api: API, visibility: DEFAULT_VIS });
  } catch (e) {
    console.error(e);
    // não derruba o build/SSR — mostra vazio e segue
    initial = [];
  }

  return (
    <MateriaisClient
      api={API}
      defaultVisibility={DEFAULT_VIS}
      initialRows={initial}
    />
  );
}