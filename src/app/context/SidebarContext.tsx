"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type SidebarContextType = {
  isExpanded: boolean;      // estado "fixo" (desktop)
  isMobileOpen: boolean;    // drawer no mobile
  isHovered: boolean;       // hover expand (desktop quando recolhido)
  isMobile: boolean;

  setIsHovered: (v: boolean) => void;
  toggleExpanded: () => void;
  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const api = useMemo<SidebarContextType>(() => {
    return {
      isExpanded: isMobile ? false : isExpanded,
      isMobileOpen,
      isHovered,
      isMobile,

      setIsHovered,
      toggleExpanded: () => setIsExpanded((v) => !v),
      openMobile: () => setIsMobileOpen(true),
      closeMobile: () => setIsMobileOpen(false),
      toggleMobile: () => setIsMobileOpen((v) => !v),
    };
  }, [isExpanded, isHovered, isMobileOpen, isMobile]);

  return <SidebarContext.Provider value={api}>{children}</SidebarContext.Provider>;
}