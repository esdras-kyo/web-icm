"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

type TopBannerProps = {
  badgeText?: string;
  title: string;
  subtitle?: string;
  backgroundImage?: string; // ex: "images/bg.jpeg"
  bannerHeight?: string;    // ex: "70vh"
  showLogo?: boolean;
  logoSrc?: string;
  logoAlt?: string;
  showButton?: boolean;
  buttonLabel?: string;
  onButtonClick?: () => void;
  children?: React.ReactNode;
};

export default function TopBanner({
  badgeText = "",
  title,
  subtitle,
  backgroundImage = "",
  bannerHeight = "70vh",
  showLogo = false,
  logoSrc = "/images/logo.png",
  logoAlt = "Logo",
  showButton = false,
  buttonLabel = "",
  onButtonClick,
  children,
}: TopBannerProps) {
  const hasBackgroundImage = Boolean(backgroundImage);

  return (
    <section
      className={`relative overflow-hidden mb-24 ${
        hasBackgroundImage ? "bg-cover bg-center" : "bg-gradient-to-b from-black/80 to-black"
      }`}
      style={{
        ...(hasBackgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : {}),
        height: bannerHeight,   // controla a altura total
      }}
    >
      {/* overlay escuro */}
      <div className="absolute inset-0 before:absolute before:inset-0 before:bg-gradient-to-br before:from-black/80 before:to-sky-800/60 before:z-10" />
      {/* glow radial */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(99,102,241,0.20),transparent_70%)]" />

      {/* wrapper para centralizar verticalmente */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 md:px-6 h-full">
        <div className="flex h-full items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-3xl text-center"
          >
            {badgeText && (
              <Badge className="mb-4 gap-2 bg-transparent rounded-full px-3 py-1">
                {badgeText}
              </Badge>
            )}

            {showLogo && (
              <div className="items-center justify-center mb-2 w-full flex">
                <Image src={logoSrc} alt={logoAlt} width={64} height={64} />
              </div>
            )}

            <h1 className="text-4xl md:text-7xl font-semibold leading-tight">
              {title}
            </h1>

            {subtitle && (
              <p className="text-muted-foreground mt-4 max-w-prose mx-auto">
                {subtitle}
              </p>
            )}

            {showButton && (
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <Button
                  size="lg"
                  onClick={onButtonClick}
                  className="rounded-2xl cursor-pointer hover:text-gray-300 hover:from-black/50 hover:to-black/70 bg-gradient-to-tl from-[#8B0101] to-black/20"
                >
                  {buttonLabel}
                </Button>
              </div>
            )}

            {children && <div className="mt-6">{children}</div>}
          </motion.div>
        </div>
      </div>
    </section>
  );
}