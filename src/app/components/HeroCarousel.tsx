"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type HeroCarouselProps = {
  images: string[];
  alt: string;
  intervalMs?: number;
  slideDirection?: "left" | "right";
};

export default function HeroCarousel({
  images,
  alt,
  intervalMs = 6000,
  slideDirection = "left",
}: HeroCarouselProps) {
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

  const variants = {
    enter: (dir: "left" | "right") => ({
      x: dir === "left" ? "100%" : "-100%",
    }),
    center: { x: "0%" },
    exit: (dir: "left" | "right") => ({
      x: dir === "left" ? "-100%" : "100%",
    }),
  };

  if (images.length === 0) return null;

  return (
    <div className="absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
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
              alt={alt}
              fill
              priority={false}
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
