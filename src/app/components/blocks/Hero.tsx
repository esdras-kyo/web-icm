"use client";
import { motion } from "framer-motion";
import { Container } from "../../../components/ui/Container";
import { Section } from "../../../components/ui/Section";
import Image from "next/image";

type HeroProps = {
  title: string;
  subtitle?: string;
  cta?: React.ReactNode;
  bgImage?: string;      // ex: "/images/bg.jpeg"
  logoSrc?: string;      // ex: "/images/logo.png"
  height?: number;       // ex: 70 => vh
};

export function Hero({ title, subtitle, cta, bgImage, logoSrc, height = 70 }: HeroProps) {
  return (
    <Section pad="lg" tint="subtle" bgImage={bgImage} overlay className="mb-24" style={{ height: `${height}vh` }}>
      <Container className="h-full flex items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {logoSrc && (
            <div className="items-center justify-center mb-3 w-full flex">
              <Image src={logoSrc} alt="Logo" width={64} height={64} />
            </div>
          )}
          <h1 className="text-4xl md:text-7xl font-semibold leading-tight">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-4 max-w-prose mx-auto">{subtitle}</p>}
          {cta && <div className="mt-6 flex flex-wrap gap-3 justify-center">{cta}</div>}
        </motion.div>
      </Container>
    </Section>
  );
}