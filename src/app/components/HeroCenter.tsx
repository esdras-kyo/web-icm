import Image from "next/image";
import {motion} from "framer-motion"

type HeroMissionProps = {
  churchName: string;
  mission: string;
  imageSrc?: string;
};

export default function HeroCenter({
  churchName,
  mission,
  imageSrc,
}: HeroMissionProps) {
  return (
    <section className="relative w-full h-dvh overflow-hidden">
      {/* Background */}
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={churchName}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      ) : null}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Centered content */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-6">
        <div className="max-w-4xl">
          {/* Church name */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-3xl md:text-5xl font-semibold tracking-tight text-white"
          >
            {churchName}
          </motion.h1>

          {/* Mission */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: 0.12,
            }}
            className="mt-4 text-sm md:text-lg tracking-wide uppercase text-white/75"
          >
            {mission}
          </motion.p>
        </div>
      </div>

      {/* Subtle gradient for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/60" />
    </section>
  );
}