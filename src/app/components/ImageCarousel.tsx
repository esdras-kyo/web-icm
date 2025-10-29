'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type BlockCarouselProps = {
  /** altura do carrossel (ex.: h-64, h-80, etc.) */
  heightClass?: string;
  /** quantos blocos (placeholders) quer renderizar */
  total?: number;
  /** classes extras pra container */
  className?: string;
};

export default function BlockCarousel({
  heightClass = 'h-64',
  total = 5,
  className = '',
}: BlockCarouselProps) {
  const [index, setIndex] = useState(0);
  const count = Math.max(1, total);

  const goTo = (i: number) => {
    // loop simples
    setIndex(((i % count) + count) % count);
  };
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  return (
    <div
      className={[
        'relative w-full max-w-5xl mx-auto select-none overflow-hidden rounded-3xl',
        'bg-black/5 ring-1 ring-black/10',
        heightClass,
        className,
      ].join(' ')}
    >
      {/* trilho */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-full shrink-0 grow-0 basis-full p-4">
            <BlockPlaceholder n={i + 1} />
          </div>
        ))}
      </div>

      {/* setas */}
      {count > 1 && (
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3">
          <IconButton onClick={prev} label="Anterior">
            <ChevronLeft className="size-6" />
          </IconButton>
          <IconButton onClick={next} label="Próximo">
            <ChevronRight className="size-6" />
          </IconButton>
        </div>
      )}

      {/* dots */}
      {count > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Ir para slide ${i + 1}`}
              className={[
                'h-2 rounded-full transition-all',
                i === index ? 'w-6 bg-white/90' : 'w-2 bg-white/50 hover:bg-white/70',
              ].join(' ')}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function IconButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="pointer-events-auto grid place-items-center rounded-full bg-black/40 backdrop-blur px-3 py-3 text-white hover:bg-black/55 transition shadow"
    >
      {children}
    </button>
  );
}

function BlockPlaceholder({ n }: { n: number }) {
  return (
    <div className="h-full w-full rounded-2xl p-6 bg-gradient-to-br from-zinc-800 to-sky-700 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,255,255,0.15),transparent_70%)]" />
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-2 h-16 w-16 rounded-xl bg-white/20 backdrop-blur grid place-items-center text-white text-2xl font-bold">
            {n}
          </div>
          <p className="text-white/85">Bloco {n}</p>
        </div>
      </div>
    </div>
  );
}