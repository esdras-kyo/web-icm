"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type HeroMissionProps = {
  churchName: string;
  mission: string;
  imageSrc?: string | string[];
  subtitle?: string;
  intervalMs?: number;
  slideDirection?: "left" | "right"; // opcional
};

export default function HeroMission({
  churchName,
  mission,
  subtitle,
  imageSrc,
  intervalMs = 6000,
  slideDirection = "left",
}: HeroMissionProps) {
  const images = useMemo(() => {
    if (!imageSrc) return [];
    const arr = Array.isArray(imageSrc) ? imageSrc : [imageSrc];
    return arr.filter(Boolean).slice(0, 3);
  }, [imageSrc]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [images.length, intervalMs]);

  useEffect(() => {
    if (index >= images.length) setIndex(0);
  }, [images.length, index]);

  const current = images[index];

  // Variants de slide (arrasto)
  const variants = {
    enter: (dir: "left" | "right") => ({
      x: dir === "left" ? "100%" : "-100%",
    }),
    center: { x: "0%" },
    exit: (dir: "left" | "right") => ({
      x: dir === "left" ? "-100%" : "100%",
    }),
  };

  return (
    <section className="relative w-full h-dvh overflow-hidden">
      {/* Background (slide automático) */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={slideDirection}>
          {current ? (
            <motion.div
              key={current}
              custom={slideDirection}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={current}
                alt={churchName}
                fill
                priority
                className="object-cover"
                sizes="100vw"
                quality={100}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

<div className="pointer-events-none absolute inset-0 bg-black/25" />

      {/* Bottom text */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-6xl px-6 pb-12">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className=" bg-linear-to-r from-blue-600/80 via-red-500/70 to-red-700/60 text-transparent bg-clip-text
            block text-[14px] md:text-md tracking-[0.34em] uppercase "
          >
            {churchName}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
            className=" text-white
            mt-3 md:mt-4 max-w-4xl text-5xl md:text-7xl font-semibold leading-[1.05] md:leading-[1.02] tracking-tight"
          >
            {mission}
          </motion.h1>

          {subtitle ? (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.16 }}
              className="mt-3 md:mt-4 max-w-3xl text-base md:text-2xl font-medium leading-relaxed text-white/80 uppercase"
            >
              {subtitle}
            </motion.p>
          ) : null}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/70 to-transparent" />
    </section>
  );
}