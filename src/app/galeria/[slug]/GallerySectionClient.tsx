// app/galeria/[slug]/GallerySectionClient.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type GalleryImage = {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number | null;
  created_at: string;
};

type Props = {
  section: {
    id: string;
    title: string;
    description: string | null;
  };
  initialImages: GalleryImage[];
  totalCount: number;
  pageSize: number;
};

export function GallerySectionClient({
  section,
  initialImages,
  totalCount,
  pageSize,
}: Props) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [page, setPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialImages.length < totalCount);

  // LIGHTBOX
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    setHasMore(images.length < totalCount);
  }, [images.length, totalCount]);

  function openLightbox(index: number) {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
  }

  function closeLightbox() {
    setIsLightboxOpen(false);
    setCurrentIndex(null);
  }

  function showPrev() {
    if (currentIndex === null || images.length === 0) return;
    setCurrentIndex((prev) =>
      prev === null ? prev : (prev - 1 + images.length) % images.length
    );
  }

  function showNext() {
    if (currentIndex === null || images.length === 0) return;
    setCurrentIndex((prev) =>
      prev === null ? prev : (prev + 1) % images.length
    );
  }

  // Navegação por teclado na lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isLightboxOpen, currentIndex, images.length]);

  async function handleLoadMore() {
    if (!hasMore || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;

      const params = new URLSearchParams({
        sectionId: section.id,
        page: String(nextPage),
        pageSize: String(pageSize),
      });

      const res = await fetch(`/api/gallery/section-images?${params.toString()}`, {
        method: "GET",
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(body?.error ?? "Erro ao carregar mais imagens");
      }

      const newImages = (body.images ?? []) as GalleryImage[];

      if (newImages.length) {
        setImages((prev) => [...prev, ...newImages]);
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
      // opcional: setar uma msg de erro de load more
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <>
      {/* Header da seção */}
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-50">
          {section.title}
        </h1>
        {section.description && (
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            {section.description}
          </p>
        )}
        <p className="mt-2 text-xs text-slate-500">
          {totalCount} foto{totalCount === 1 ? "" : "s"}
        </p>
      </header>

      {/* Grid de imagens */}
      {images.length === 0 ? (
        <p className="mt-6 text-sm text-slate-400">
          Nenhuma foto cadastrada ainda para esta seção.
        </p>
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img, index) => (
              <button
                key={img.id}
                type="button"
                onClick={() => openLightbox(index)}
                className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 outline-none transition hover:-translate-y-0.5 hover:border-icm-primary cursor-pointer"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={img.image_url}
                    alt={img.alt_text ?? section.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              </button>
            ))}
          </div>

          {/* Botão "Carregar mais" */}
          {hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="rounded-full bg-slate-800 px-4 py-2 text-xs font-medium text-slate-100 shadow hover:bg-slate-700 cursor-pointer disabled:opacity-60"
              >
                {isLoadingMore ? "Carregando..." : "Carregar mais fotos"}
              </button>
            </div>
          )}
        </>
      )}

      {/* LIGHTBOX */}
      {isLightboxOpen && currentIndex !== null && images[currentIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-slate-100 shadow cursor-pointer"
          >
            Fechar ✕
          </button>

          <button
            type="button"
            onClick={showPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-lg text-slate-100 shadow cursor-pointer"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={showNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-lg text-slate-100 shadow cursor-pointer"
          >
            ›
          </button>

          <div className="relative w-[min(90vw,900px)] h-[min(80vh,600px)]">
            <Image
              src={images[currentIndex].image_url}
              alt={
                images[currentIndex].alt_text ??
                `${section.title} - foto ${currentIndex + 1}`
              }
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 60vw, 90vw"
              loading="eager"
            />
          </div>
        </div>
      )}
    </>
  );
}