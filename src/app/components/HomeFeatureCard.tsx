"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ChevronRight } from "lucide-react";

type HomeFeatureCardProps = {
  href: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  imageSrc?: string;
  align?: "left" | "center";
  height?: "sm" | "md";
  variant?: "soft" | "sky";
  ctaLabel?: string;
};

export default function HomeFeatureCard({
  href,
  kicker,
  title,
  subtitle,
  imageSrc,
  align = "left",
  height = "md",
  variant = "soft",

}: HomeFeatureCardProps) {
  const h = height === "sm"
  ? "h-28 sm:h-32 md:h-44"
  : "h-32 sm:h-40 md:h-60";
  const textAlign = align === "center" ? "text-center" : "text-left";

  const bg =
    variant === "sky"
      ? "bg-linear-to-tr from-black via-black to-sky-800/45"
      : "bg-trasparent";

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.35 }}
      className={`w-full py-8 md:py-12 ${bg}]`}
    >
      <div className="mx-auto max-w-6xl px-6">
        <Link href={href} className="cursor-pointer block">
          <motion.div
            whileHover={{ opacity: 0.98, x: 10 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/50"
          >
            <div className="absolute inset-0">
              { imageSrc ? (<Image
                src={imageSrc}
                alt={title}
                fill
                priority={false}
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover object-left md:object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />) : null}
              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors duration-500" />
              <div className="absolute inset-0 bg-linear-to-b from-black/70 via-transparent to-transparent" />
            </div>

            <div className={`relative z-10 flex flex-col gap-4 p-5 md:p-8 ${textAlign}`}>
              {kicker ? (
                <p className="text-[11px] md:text-xs uppercase tracking-[0.28em] text-white/60">
                  {kicker}
                </p>
              ) : null}

              <div className="max-w-2xl">
                <h3 className="text-xl md:text-3xl font-semibold tracking-tight text-white">
                  {title}
                </h3>
                {subtitle ? (
                  <p className="mt-2 text-sm md:text-base text-white/75 leading-relaxed">
                    {subtitle}
                  </p>
                ) : null}
              </div>

              <div className="absolute bottom-4 right-4 md:static md:mt-2 md:flex md:w-full md:flex-row-reverse">
                <ChevronRight className="h-7 w-7 md:h-10 md:w-10 text-white/90" />
              </div>
            </div>

            {/* <div className={h} /> */}

            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background:
                  "radial-gradient(700px circle at 20% 20%, rgba(255,255,255,0.10), transparent 45%)",
              }}
            />
          </motion.div>
        </Link>
      </div>
    </motion.section>
  );
}