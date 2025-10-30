import React from "react";
import Sidebar from "./sideBar";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden ">
       <Sidebar />
    <div className="flex-col flex flex-1 overflow-auto">
    <div className="max-w-7xl mx-auto w-full flex flex-col">
      <main className="flex-1 p-6">{children}</main>
    </div>
    </div>
    </div>
  );
}