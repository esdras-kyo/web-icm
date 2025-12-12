// app/galeria/page.tsx
import Link from "next/link";
import Image from "next/image";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export const revalidate = 60; // revalida a cada 1 min, por ex.

export default async function GalleryIndexPage() {
  const supabase = createSupabaseAdmin();

  const { data: sections } = await supabase
    .from("gallery_sections")
    .select("id, title, description, slug")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (!sections || sections.length === 0) {
    return (
      <div className="container-app py-12">
        <h1 className="mb-4 text-3xl font-semibold text-slate-50">
          Galeria
        </h1>
        <p className="text-sm text-slate-400">
          Nenhuma seção de galeria publicada ainda.
        </p>
      </div>
    );
  }

  const { data: images } = await supabase
    .from("gallery_images")
    .select("id, section_id, image_url, alt_text, sort_order")
    .in(
      "section_id",
      sections.map((s) => s.id)
    )
    .order("sort_order", { ascending: true });

  const bySection = new Map<string, typeof images>();
  images?.forEach((img) => {
    const arr = bySection.get(img.section_id) ?? [];
    arr.push(img);
    bySection.set(img.section_id, arr);
  });

  return (
    <div className="bg-page min-h-screen py-10">
      <div className="container-app">
        <h1 className="mb-6 text-3xl font-semibold text-slate-50">
          Galeria
        </h1>
        <p className="mb-8 max-w-2xl text-sm text-slate-300">
          Momentos registrados em fotos das nossas celebrações, eventos e atividades.
        </p>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => {
            const imgs = (bySection.get(section.id) ?? []).slice(0, 3);

            // pega a primeira como “capa”
            const first = imgs[0];

            return (
              <Link
                key={section.id}
                href={`/galeria/${section.slug ?? section.id}`}
                className="card flex flex-col overflow-hidden bg-slate-900/70 transition hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
              >
                <div className="relative h-52 w-full bg-slate-800">
                  {first ? (
                    <Image
                      src={first.image_url}
                      alt={first.alt_text ?? section.title}
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                      Sem imagens ainda
                    </div>
                  )}

                  {/* mini grid com até 3 fotos */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10" />
                </div>

                <div className="flex flex-1 flex-col gap-2 p-4 bg-linear-to-b to-sky-800/80 from-black">
                  <h2 className="text-base font-semibold text-slate-50">
                    {section.title}
                  </h2>
                  {section.description && (
                    <p className="line-clamp-2 text-xs text-slate-300">
                      {section.description}
                    </p>
                  )}
                  <span className="mt-auto text-xs font-medium text-sky-100 ">
                    Ver fotos →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}