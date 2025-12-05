"use client";

import React from "react";
import Link from "next/link";

type HighlightKpiCardProps = {
  label: string;
  value: string | number;
  description?: string;
  href?: string;
  ctaLabel?: string;
  icon?: React.ReactNode;
  className?: string;
};

export function HighlightKpiCard({
  label,
  value,
  description,
  href,
  ctaLabel = "Ver mais",
  icon,
  className = "",
}: HighlightKpiCardProps) {
  const content = (
    <div
      className={`w-full max-w-full rounded-2xl border border-gray-800 bg-white/5 p-5 shadow-sm md:p-6 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-xs font-medium uppercase tracking-wide text-sky-100">
            {label}
          </span>
          <div className="mt-2 flex items-center gap-3">
            {icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                {icon}
              </div>
            )}
            <h2 className="text-3xl font-semibold text-white/90 sm:text-4xl">
              {value}
            </h2>
          </div>
          {description && (
            <p className="mt-2 text-xs text-gray-400 sm:text-sm break-words">
              {description}
            </p>
          )}
        </div>
        {href && (
          <span className="hidden text-xs text-gray-500 sm:inline">
            {/* espaço pro future info se quiser */}
          </span>
        )}
      </div>

      {href && (
        <div className="mt-4">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-sky-100 hover:text-sky-200">
            {ctaLabel} →
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block w-full max-w-full">
        {content}
      </Link>
    );
  }

  return content;
}