"use client";

import Link from "next/link";
import Image from "next/image";
import { MenuIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useScroll } from "framer-motion";
import ProfBtn from "./ProfBtn";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (y) => {
      setScrolled(y > 40);
    });
  }, [scrollY]);

  const links = [
    { href: "/contato", label: "CONTATO" },
    { href: "/contribua", label: "CONTRIBUA" },
    { href: "/events", label: "EVENTOS" },
    { href: "/historia", label: "HISTORIA" },
    { href: "/celulas", label: "CÉLULAS" },
    { href: "/agenda", label: "AGENDA" },

  ];

  useEffect(() => {
    if (!isOpen) return;
    const unsub = scrollY.on("change", () => setIsOpen(false));
    return () => unsub();
  }, [isOpen, scrollY]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{
          backgroundColor: scrolled ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0)",
          backdropFilter: scrolled ? "blur(10px)" : "blur(0px)",
          borderColor: scrolled ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0)",
        }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="h-16 flex items-center justify-between">

            <Link
              href="/"
              className="cursor-pointer flex items-center gap-2 select-none"
              onClick={() => setIsOpen(false)}
            >
              <Image
                alt="ICM"
                src="/images/logo.png"
                width={22}
                height={22}
                priority
              />
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-8 text-xs font-mono tracking-wider text-white/85">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="cursor-pointer hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="ml-2">
                <ProfBtn />
              </div>
            </nav>

            <div className="flex items-center gap-3 md:hidden">
              <ProfBtn />

              <button
                type="button"
                className="cursor-pointer inline-flex items-center justify-center rounded-xl px-2 py-2 text-white/90 hover:text-white transition"
                aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
                onClick={() => setIsOpen((v) => !v)}
              >
                {!isOpen ? <MenuIcon size={22} /> : <X size={22} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence initial={false} mode="wait">
          {isOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-6 pb-5 pt-2 bg-black/55 backdrop-blur supports-backdrop-filter:bg-black/40">
                <div className="flex flex-col gap-4 text-xs font-mono tracking-wider text-white/85">
                  {links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="cursor-pointer py-2 hover:text-white transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer opcional:
          Se você NÃO quiser que a navbar cubra conteúdo nas páginas internas,
          coloque esse spacer apenas em layouts internos (não na home com hero). */}
      {/* <div className="h-16" /> */}
    </>
  );
}