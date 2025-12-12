import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { EditGallerySectionForm } from "./EditGallerySectionForm";
import { GalleryImagesManager } from "./GalleryImagesManager";
import { GallerySectionDangerZone } from "./GallerySectionDangerZone";
import { use } from "react";


type PageProps = {
  params: Promise<{ id: string }>;
};

export const revalidate = 0;

export default function GallerySectionDetailPage({ params }: PageProps) {
  const { id } = use(params) 
  const supabase = createSupabaseAdmin();
  const sectionId = id;

  const sectionPromise = supabase
  .from("gallery_sections")
  .select("id, title, description, slug, is_published, created_at")
  .eq("id", sectionId)
  .single();

const imagesPromise = supabase
  .from("gallery_images")
  .select("id, image_url, alt_text, sort_order, created_at")
  .eq("section_id", sectionId)
  .order("sort_order", { ascending: true })
  .order("created_at", { ascending: true });

// Usa o React.use pra resolver as Promises
const [
  { data: section, error: sectionError },
  { data: images, error: imagesError },
] = use(Promise.all([sectionPromise, imagesPromise]));

if (sectionError || !section) {
  if (sectionError) {
    console.error("Erro ao carregar seção da galeria:", sectionError);
  }
  notFound();
}

if (imagesError) {
  console.error("Erro ao carregar imagens da galeria:", imagesError);
}

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">
            Editar seção da galeria
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Ajuste as informações da seção e gerencie as fotos vinculadas.
          </p>
        </div>

        <Link
          href="/offc/galeria"
          className="inline-flex cursor-pointer items-center rounded-lg border border-slate-600 px-3 py-2 text-xs font-medium text-slate-200 hover:border-slate-400"
        >
          ← Voltar para lista
        </Link>
      </header>

      <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-50">
              Informações da seção
            </h2>
            <p className="text-xs text-slate-500">
              ID:{" "}
              <span className="font-mono text-[11px] text-slate-400">
                {section.id}
              </span>
            </p>
          </div>

          <span className="hidden text-xs text-slate-500 sm:inline">
            Criado em{" "}
            {new Date(section.created_at).toLocaleDateString("pt-BR")}
          </span>
        </div>

        <EditGallerySectionForm section={section} />
      </section>

      <section
        id="imagens"
        className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6"
      >
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-50">
              Imagens da seção
            </h2>
            <p className="text-sm text-slate-400">
              Adicione, remova ou reordene as fotos deste álbum.
            </p>
          </div>

          <span className="text-xs text-slate-500">
            {images?.length ?? 0} foto
            {images && images.length === 1 ? "" : "s"}
          </span>
        </div>

        <GalleryImagesManager sectionId={section.id} initialImages={images ?? []} />
      </section>
      <GallerySectionDangerZone
        sectionId={section.id}
        sectionTitle={section.title}
      />
    </div>
  );
}