"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type HeroMissionProps = {
  churchName: string;
  mission: string;
  imageSrc?: string;
  subtitle?: string;
};

export default function HeroMission({
  churchName,
  mission,
  subtitle,
  imageSrc,
}: HeroMissionProps) {
  return (
    <section className="relative w-full h-dvh overflow-hidden">
      {/* Background */}
      { imageSrc? (
      <Image
        src={imageSrc}
        alt={churchName}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      ): null}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Bottom text */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-6xl px-6 pb-12">
          {/* Church name */}
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="block text-[14px] md:text-md tracking-[0.34em] uppercase text-white/65"
          >
            {churchName}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.08 }}
            className="mt-3 md:mt-4 max-w-4xl text-5xl md:text-7xl font-semibold leading-[1.05] md:leading-[1.02] tracking-tight text-white"
          >
            {mission}
          </motion.h1>

          {subtitle ? (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.16 }}
              className="mt-3 md:mt-4 max-w-3xl text-base md:text-2xl font-medium leading-relaxed text-white/80 uppercase"
            >
              {subtitle}
            </motion.p>
          ) : null}

        </div>
      </div>

      {/* Subtle gradient for text legibility */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent" />
    </section>
  );
}