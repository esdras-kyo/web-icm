"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type HeroMissionProps = {
  churchName: string;
  mission: string;
  imageSrc?: string;
};

export default function HeroMission({
  churchName,
  mission,
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
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="block text-xs md:text-sm tracking-[0.3em] uppercase text-white/70"
          >
            {churchName}
          </motion.span>

          {/* Mission */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
              delay: 0.08,
            }}
            className="mt-4 max-w-4xl text-3xl md:text-5xl font-semibold leading-tight tracking-tight text-white"
          >
            {mission}
          </motion.h1>
        </div>
      </div>

      {/* Subtle gradient for text legibility */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent" />
    </section>
  );
}