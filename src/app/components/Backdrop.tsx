"use client";

import { useSidebar } from "@/app/context/SidebarContext";

export default function Backdrop() {
  const { isMobileOpen, closeMobile } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <button
      type="button"
      aria-label="Fechar menu"
      onClick={closeMobile}
      className="fixed inset-0 z-40 bg-black/60 lg:hidden cursor-pointer"
    />
  );
}