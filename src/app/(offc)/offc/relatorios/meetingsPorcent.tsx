"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type OccupancyRadialProps = {
  label?: string;
  percent: number; // 0–100
  helperText?: string;
};

export default function MeetingsRadial({
  label = "",
  percent,
  helperText,
}: OccupancyRadialProps) {
  const safePercent = Math.max(0, Math.min(100, percent));
  const series = [safePercent];

  const options: ApexOptions = {
    theme: {
      mode: "dark",
    },
    colors: ["#60A5FA"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 240,
      width: "100%",            // 👈 garante que respeite o container
      sparkline: { enabled: true },
      background: "transparent",
      foreColor: "#E5E7EB",
    },
    plotOptions: {
      radialBar: {
        startAngle: -100,
        endAngle: 100,
        hollow: {
          size: "70%",
        },
        track: {
          background: "#111827",
          strokeWidth: "100%",
          margin: 4,
        },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "32px",
            fontWeight: 600,
            offsetY: -10,
            color: "#F9FAFB",
            formatter: (val) => `${Math.round(val)}%`,
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#60A5FA"],
    },
    stroke: {
      lineCap: "round",
    },
  };

  return (
    <div className="w-full max-w-full rounded-2xl border border-gray-800 bg-white/5 p-5 shadow-sm md:p-6">
      <div className="flex items-baseline justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-medium uppercase tracking-wide text-gray-400">
            {label}
          </h3>
          {helperText && (
            <p className="mt-1 text-xs text-gray-500 wrap-break-words">
              {helperText}
            </p>
          )}
        </div>
        <span className="shrink-0 text-xs text-gray-400">
          {safePercent.toFixed(0)}% enviaram
        </span>
      </div>

      <div className="mt-4 flex w-full justify-center overflow-hidden">
        <ReactApexChart
          options={options}
          series={series}
          type="radialBar"
          height={240}
          width="100%"  
        />
      </div>
    </div>
  );
}