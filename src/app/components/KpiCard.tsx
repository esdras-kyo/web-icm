"use client";

import React from "react";

type TrendDirection = "up" | "down" | "neutral";

type KpiCardProps = {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  helperText?: string;
  trendValue?: string;
  trendDirection?: TrendDirection;
  className?: string;
};

export function KpiCard({
  label,
  value,
  icon,
  helperText,
  trendValue,
  trendDirection = "neutral",
  className = "",
}: KpiCardProps) {
  const trendColors =
    trendDirection === "up"
      ? "bg-emerald-500/10 text-emerald-400"
      : trendDirection === "down"
      ? "bg-rose-500/10 text-rose-400"
      : "bg-slate-500/10 text-slate-300";

  const trendArrow =
    trendDirection === "up"
      ? "↑"
      : trendDirection === "down"
      ? "↓"
      : "•";

  return (
    <div
      className={`w-full max-w-full rounded-2xl border border-gray-800 bg-white/5 p-5 shadow-sm md:p-6 ${className}`}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
          <span className="text-xl text-white/90">{icon}</span>
        </div>
      )}

      <div className="mt-5 flex items-end justify-between gap-3">
        {/* bloco de texto precisa conseguir encolher */}
        <div className="min-w-0">
          <span className="block text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </span>
          <h4 className="mt-2 text-2xl font-semibold text-white/90 break-words">
            {value}
          </h4>
          {helperText && (
            <p className="mt-1 text-xs text-gray-500 break-words">
              {helperText}
            </p>
          )}
        </div>

        {trendValue && (
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${trendColors}`}
          >
            <span>{trendArrow}</span>
            <span>{trendValue}</span>
          </span>
        )}
      </div>
    </div>
  );
}