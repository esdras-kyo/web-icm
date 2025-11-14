"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  hover: { y: 10, opacity: 0.6, transition: { duration: 0.6 } },
};

export default function Section({
  id,
  title,
  subtitle,
  children,
  img,
  clickable,
  onClick,
}: {
  id: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  img?: string;
  clickable?: boolean;
  onClick?: () => void;
})  {
  const isClickable = !!clickable && !!onClick;

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!isClickable) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  }

  return (
    <section id={id} className="max-w-6xl mx-auto px-4 md:px-6 py-6">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        whileHover={isClickable ? "hover" : ""}
        onClick={isClickable ? onClick : undefined}
        onKeyDown={handleKeyDown}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        className={`relative max-w-6xl mx-auto px-4 md:px-6 pt-16 pb-8 rounded-md bg-gradient-to-bl from-transparent to-black/60 ${
          isClickable ? "cursor-pointer" : ""
        }`}
      >
        {img && (
          <div className="absolute inset-0 z-0">
            <Image
              src={img}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-all duration-500 group-hover:brightness-110 group-hover:scale-100 rounded-2xl"
              priority={false}
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-black/70 via-transparent to-transparent" />
          </div>
        )}

        {title && (
          <div className="mb-8 relative z-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 max-w-2xl text-gray-200">{subtitle}</p>
            )}
          </div>
        )}

        <div className="relative z-10">{children}</div>
      </motion.div>
    </section>
  );
};