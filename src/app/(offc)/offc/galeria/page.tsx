import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { GallerySectionsList } from "./GallerySectionsList";
import Link from "next/link";

export const revalidate = 0;

export default async function GallerySectionsPage() {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase
    .from("gallery_sections")
    .select("id, title, description, slug, is_published, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Galeria — Seções</h1>
        <p className="mt-4 text-sm text-red-300">
          Erro ao carregar seções: {error.message}
        </p>
      </div>
    );
  }

  const sections = data ?? [];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Galeria — Seções</h1>
          <p className="mt-1 text-sm text-slate-400">
            Gerencie os agrupamentos de fotos (álbuns) da galeria.
          </p>
        </div>

        <Link
          href="/offc/galeria/new"
          className="rounded-lg hover:bg-emerald-200/30 border-white/40 border px-4 py-2 text-sm font-medium text-white cursor-pointer"
        >
          Nova seção +
        </Link>
      </header>

      <GallerySectionsList sections={sections} />
    </div>
  );
}