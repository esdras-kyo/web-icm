"use client";
import Link from "next/link";
import { MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import ProfBtn from "./ProfBtn";
import Image from "next/image";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { href: "/historia", label: "NOSSA HISTORIA" },
    // { href: "/ministerios", label: "MINISTÉRIOS" },
    { href: "/agenda", label: "PROGRAMAÇÃO" },
    { href: "/contato", label: "CONTATO" },
    { href: "/contribua", label: "CONTRIBUA" },
    { href: "/events", label: "EVENTOS" },
  ];
  return (
    <div className="top-0 left-0 w-full shadow-md sticky text-white  z-40 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className=" md:bg-transparent w-full mx-auto flex items-center justify-between p-6">
        <div className="text-xl font-bold  flex flex-row gap-2">
        <Image alt="" src="/images/logo.png" width={20} height={20} />  
          <Link href="/" className="hover:text-gray-300 cursor-pointer flex flex-row items-center">
          
           <h1 className="ml-2 text-sm md:text-xl">ICM</h1> 
          </Link>
          
        </div>

        <div className="flex items-center gap-4">
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
<ProfBtn/>
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
