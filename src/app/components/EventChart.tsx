"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export type RegistrationPoint = {
  day: string; // "2025-01-01"
  registrations_in_day: number;
  registrations_cumulative: number;
};

type StatisticsChartProps = {
  data: RegistrationPoint[];
};

export default function StatisticsChart({ data }: StatisticsChartProps) {
  // Se não tiver dados ainda, evita quebrar
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border px-5 pb-5 pt-5 border-gray-800 bg-white/5 sm:px-6 sm:pt-6">
        <h3 className="text-lg font-semibold text-white/90 mb-2">
          Inscrições ao longo do tempo
        </h3>
        <p className="text-sm text-gray-400">Nenhuma inscrição encontrada.</p>
      </div>
    );
  }

  const categories = data.map((point) => point.day); // ex: ["2025-01-01", "2025-01-02", ...]

  const options: ApexOptions = {
    theme: {
      mode: "dark", // força o tema do gráfico para dark
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      labels: {
        colors: "#E5E7EB", // texto da legenda bem claro

      },
    },
    // cores das séries (linhas / áreas / legenda / tooltip)
    colors: ["#60A5FA", "#A5B4FC"], // azul claro + lilás claro
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
      foreColor: "#E5E7EB", // cor padrão dos textos do chart
      background: "transparent", 
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#FFFFFF",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      borderColor: "#4B5563", // linhas do grid discretas no dark
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      x: {
        // se você formatar no back (ex: "01 Jan 2025"), pode deixar só category
        format: "dd MMM yyyy",
      },
    },
    xaxis: {
      type: "category", // pode trocar para "datetime" se quiser
      categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        rotate: -45,
        style: {
          colors: "#D1D5DB", // texto do eixo X claro
          fontSize: "11px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#DCE1EA"], // já estava claro, deixei
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Inscritos no dia",
      data: data.map((point) => point.registrations_in_day),
    },
    {
      name: "Total acumulado",
      data: data.map((point) => point.registrations_cumulative),
    },
  ];

  return (
    <div className="dark w-full rounded-2xl border px-5 pb-5 pt-5 border-gray-800 bg-white/5 sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-white/90">
            Inscrições ao longo do tempo
          </h3>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          {/* Se quiser usar para filtro (7 dias, 30 dias etc) */}
          {/* <ChartTab /> */}
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>
    </div>
  );
}