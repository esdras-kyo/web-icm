"use client";
import Link from "next/link";
import { MenuIcon, X } from "lucide-react";
import { useState } from "react";
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
  return (
    <div className="fixed top-0 left-0 w-full z-5 shadow-md">
      <div className="bg-black/40 md:bg-transparent  max-w-7xl mx-auto flex items-center justify-between p-6">
        <div className="text-xl font-bold">
          <Link href="/" className="hover:text-gray-300">
            Logo
          </Link>
        </div>
        <div className=" flex md:hidden " onClick={()=>setIsOpen(!isOpen)}>
         {!isOpen ?<MenuIcon />: <X/>}
        </div>
        <nav
          className={`flex ${
            !isOpen ? "hidden md:flex" : "flex"
          } space-x-8 space-y-8 flex-col md:flex-row`}
        >
          <div className="text-xs font-mono ">
            <Link href="/" className="hover:text-gray-300">
              NOSSA HISTORIA
            </Link>
          </div>
          <div className="text-xs font-mono ">
            <Link href="/" className="hover:text-gray-300">
              MINISTÉRIOS
            </Link>
          </div>
          <div className="text-xs font-mono ">
            <Link href="/" className="hover:text-gray-300">
              PROGRAMAÇÃO
            </Link>
          </div>
          <div className="text-xs font-mono ">
            <Link href="/" className="hover:text-gray-300">
              CONTATO
            </Link>
          </div>
          <div className="text-xs font-mono ">
            <Link href="/" className="hover:text-gray-300">
              CONTRIBUA
            </Link>
          </div>
          <div className="text-xs font-mono ">
            <Link href="/" className="hover:text-gray-300">
              EVENTOS
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
