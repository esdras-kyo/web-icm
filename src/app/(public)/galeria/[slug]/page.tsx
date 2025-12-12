// app/galeria/[slug]/page.tsx
import { notFound } from "next/navigation";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { GallerySectionClient } from "./GallerySectionClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

const PAGE_SIZE = 24;

export default async function GallerySectionPublicPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createSupabaseAdmin();

  const { data: section, error: sectionError } = await supabase
    .from("gallery_sections")
    .select("id, title, description, slug, is_published, created_at")
    .eq("slug", slug)
    .single();

  if (sectionError || !section || !section.is_published) {
    notFound();
  }

  const { data: images, count } = await supabase
    .from("gallery_images")
    .select("id, image_url, alt_text, sort_order, created_at", {
      count: "exact",
    })
    .eq("section_id", section.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
    .range(0, PAGE_SIZE - 1);

  return (
    <div className="bg-page min-h-screen py-10">
      <div className="container-app">
        <GallerySectionClient
          section={{
            id: section.id,
            title: section.title,
            description: section.description,
          }}
          initialImages={images ?? []}
          totalCount={count ?? images?.length ?? 0}
          pageSize={PAGE_SIZE}
        />
      </div>
    </div>
  );
}