"use client";

import { Menu, X, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSidebar } from "@/app/context/SidebarContext";

export type SidebarItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

type SidebarTheme = {
  bg: string;
  border: string;
  hover: string;
  active: string;
  text?: string;
};

type DashboardSidebarProps = {
  items: SidebarItem[];
  theme: SidebarTheme;
};

export default function DashboardSidebar({
  items,
  theme,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { isMobileOpen, closeMobile, toggleExpanded, isExpanded } =
    useSidebar();

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const isOpen = isDesktop ? true : isMobileOpen;
  const showText = isDesktop ? isExpanded : true;

  const pointer =
    !isDesktop && !isOpen ? "pointer-events-none" : "pointer-events-auto";

  const desktopWidth = isExpanded ? "w-64" : "w-20";

  const wrapperClass = `fixed inset-y-0 left-0 z-50 ${
    isDesktop ? desktopWidth : "w-72 max-w-[85vw]"
  }`;

  const panelClass = isDesktop
    ? "translate-x-0"
    : isOpen
    ? "translate-x-0"
    : "-translate-x-full";

  return (
    <aside className={`${wrapperClass} ${pointer}`} aria-hidden={!isDesktop && !isOpen}>
      <div
        className={[
          "h-dvh p-4 flex flex-col transition-[transform,width] duration-300 ease-in-out",
          theme.bg,
          theme.border,
          theme.text ?? "text-white",
          panelClass,
        ].join(" ")}
      >
        {/* topo */}
        <div className="flex items-center justify-between">
          {!isDesktop ? (
            <button
              type="button"
              onClick={closeMobile}
              className={`p-2 rounded-full ${theme.hover} cursor-pointer transition-colors`}
              aria-label="Fechar menu"
            >
              <X />
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleExpanded}
              className={`p-2 rounded-full ${theme.hover} cursor-pointer transition-colors`}
              aria-label="Alternar sidebar"
            >
              <Menu />
            </button>
          )}
        </div>

        {/* menu */}
        <nav className="mt-8 grow overflow-y-auto pr-1">
          {items.map((item) => {
            const Icon = item.icon;
            const normalize = (p: string) =>
              p.length > 1 ? p.replace(/\/+$/, "") : p;

            const href = normalize(item.href);
            const path = normalize(pathname);

            const isRoot = href === "/offc" || href === "/leader";

            const active = isRoot
              ? path === href
              : path === href || path.startsWith(href + "/");

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (!isDesktop) closeMobile();
                }}
                className={[
                  "flex items-center p-4 text-sm font-bold rounded-lg transition-colors mb-2",
                  theme.hover,
                  active ? theme.active : "",
                  isDesktop && !showText ? "justify-center" : "justify-start",
                ].join(" ")}
              >
                <Icon size={20} className="shrink-0" style={{ minWidth: 20, minHeight: 20 }} />
                {showText && (
                  <span className="ml-4 whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}