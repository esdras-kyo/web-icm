"use client";
import Link from "next/link";
import { MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
/*
ministerios
historia
programaçao
eventos
contribua
contato

*/
export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { href: "/", label: "NOSSA HISTORIA" },
    { href: "/", label: "MINISTÉRIOS" },
    { href: "/", label: "PROGRAMAÇÃO" },
    { href: "/", label: "CONTATO" },
    { href: "/", label: "CONTRIBUA" },
    { href: "/", label: "EVENTOS" },
  ];
  return (
    <div className="fixed top-0 left-0 w-full z-5 shadow-md">
      <div className=" md:bg-transparent  max-w-7xl mx-auto flex items-center justify-between p-6">
        <div className="text-xl font-bold">
          <Link href="/" className="hover:text-gray-300">
            Logo
          </Link>
        </div>
        <div className=" flex md:hidden " onClick={() => setIsOpen(!isOpen)}>
          {!isOpen ? <MenuIcon /> : <X />}
        </div>

        <div className="hidden md:flex space-x-8 text-xs font-mono">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-gray-300">
              {link.label}
            </Link>
          ))}
        </div>
        </div>
      <AnimatePresence initial={false}
      mode="wait">
        {isOpen && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            exit={{ y: -50, opacity: 0 }}
            className="flex flex-col items-center  justify-center  space-y-6  md:hidden bg-black/50 p-4"
          >
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={()=>setIsOpen(!isOpen)}
              className="text-xs text-center font-mono hover:text-gray-300"
            >
              {link.label}
            </Link>
          ))}
          </motion.div>
          
        )}
        </AnimatePresence>
      
    </div>
  );
}
