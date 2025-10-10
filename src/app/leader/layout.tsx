
import type { Metadata } from "next";
import React from "react";
import Header from "./header";
import Sidebar from "./sidebar";

// export const metadata: Metadata = {
//   title: "Minha Rota",
//   description: "Descrição dessa rota",
// };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden pt-20">
        <Sidebar/>
    <div className="flex-col flex flex-1 overflow-auto">
    <div className="max-w-7xl mx-auto w-full flex flex-col">
        <Header/>
      <main className="flex-1 p-6">{children}</main>
    </div>
    </div>
    </div>
  );
}