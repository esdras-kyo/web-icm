import Image from "next/image";

type HeroFirstPaintProps = {
  firstImageSrc: string;
  churchName: string;
  mission: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export default function HeroFirstPaint({
  firstImageSrc,
  churchName,
  mission,
  subtitle,
  children,
}: HeroFirstPaintProps) {
  return (
    <section className="relative w-full h-dvh overflow-hidden">
      {/* LCP: primeira imagem renderizada no servidor */}
      <div className="absolute inset-0 z-0">
        <Image
          src={firstImageSrc}
          alt={churchName}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 bg-black/25" />

      {/* Texto estático (evita esperar hidratação para LCP de texto) */}
      <div className="absolute inset-x-0 bottom-0 z-[2]">
        <div className="mx-auto max-w-6xl px-6 pb-12">
          <span
            className="block text-[14px] md:text-base tracking-[0.34em] uppercase bg-linear-to-r from-blue-600/80 via-red-500/70 to-red-700/60 text-transparent bg-clip-text"
          >
            {churchName}
          </span>
          <h1 className="mt-3 md:mt-4 max-w-4xl text-5xl md:text-7xl font-semibold leading-[1.05] md:leading-[1.02] tracking-tight text-white">
            {mission}
          </h1>
          {subtitle ? (
            <p className="mt-3 md:mt-4 max-w-3xl text-base md:text-2xl font-medium leading-relaxed text-white/80 uppercase">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 z-0 bg-linear-to-t from-black/70 to-transparent" />
      {children}
    </section>
  );
}
