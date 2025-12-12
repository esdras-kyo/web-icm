"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import InscritoCard, { Inscrito } from "../CardIns";
import { Download } from "lucide-react";
import StatisticsChart, {
  RegistrationPoint,
} from "@/app/components/EventChart";
import { EventKpis } from "../../EventsKpis";

type Orders = "alpha" | "created_asc" | "created_desc"


type EventDetails = {
  id: string;
  title: string | null;
  capacity: number | null;
  starts_at: string | null;
  ends_at: string | null;
};

export default function Inscricoes() {
  const searchParams = useSearchParams();
  const eventTitleFromQuery = searchParams.get("title");

  const [loading, setLoading] = useState(false);
  const [inscritos, setInscritos] = useState<Inscrito[]>([]);
  const [warning, setWarning] = useState("");
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [order, setOrder] = useState<Orders>(
    "created_desc"
  );

  const params = useParams();
  const id = params.id?.toString();

  const [data, setData] = useState<RegistrationPoint[]>([]);

  async function fetchNumbers() {
    if (!id) return;
    const json = await fetch("/api/events/registrations-over-time", {
      method: "POST",
      body: JSON.stringify({ event_id: id }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((r) => r.json());
    setData(json);
  }

  async function fetchEventDetails() {
    if (!id) return;
    const json = await fetch("/api/events/details", {
      method: "POST",
      body: JSON.stringify({ event_id: id }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((r) => r.json());
    if (!json.error) {
      setEventDetails(json);
    }
  }

  function handleStatusChange(
    id: string,
    newStatus: Inscrito["payment_status"]
  ) {
    setInscritos((prev) =>
      prev.map((inscrito) =>
        inscrito.id === id
          ? { ...inscrito, payment_status: newStatus }
          : inscrito
      )
    );
  }

  function handleDownloadCsv() {
    if (!inscritos.length) {
      alert("Nenhum inscrito para exportar.");
      return;
    }

    const exportDate = new Date().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const titleForHeader =
      eventDetails?.title || eventTitleFromQuery || "Evento";

    const fileName = titleForHeader
      ? `inscritos-${titleForHeader}.csv`
      : "inscritos.csv";

    const header = [
      "Nome",
      "CPF",
      "Telefone",
      "Email",
      "Membro?",
      "Status pagamento",
      "Data inscrição",
    ];

    const rows = inscritos.map((i) => [
      i.name,
      i.cpf,
      i.phone,
      i.email,
      i.is_member ? "sim" : "não",
      i.payment_status,
      i.created_at ? new Date(i.created_at).toLocaleString("pt-BR") : "",
    ]);

    const csvBlocks = [
      ["Evento", titleForHeader],
      ["Data de exportação", exportDate],
      [],
      header,
      ...rows,
    ];

    const csvString = csvBlocks
      .map((row) =>
        row
          .map((field) => {
            const value = (field ?? "").toString();
            return `"${value.replace(/"/g, '""')}"`;
          })
          .join(";")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvString], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const sortedInscritos = useMemo(() => {
    if (!inscritos) return [];
  
    const copy = [...inscritos];
  
    switch (order) {
      case "created_asc":
        return copy.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
  
      case "created_desc":
        return copy.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
  
      case "alpha":
        return copy.sort((a, b) =>
          a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
        );
  
      default:
        return copy;
    }
  }, [inscritos, order]);

  async function getRegistrations(id?: string) {
    setLoading(true);
    const res = await fetch(`/api/getsubs?id=${id}`, { cache: "no-store" });
    if (!res.ok) {
      console.error("GET /api/getsubs failed", res.status, res.statusText);
      setWarning("Falha ao carregar inscritos");
      setInscritos([]);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setWarning("");
    if (Array.isArray(data) && data.length > 0) {
      setInscritos(data);
    } else {
      setInscritos([]);
      setWarning("Nenhum inscrito no momento");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!id) return;
    getRegistrations(id);
    fetchNumbers();
    fetchEventDetails();
  }, [id]);

  if (loading)
    return (
      <main className="p-6 text-center text-white">
        <p>Carregando inscritos...</p>
      </main>
    );

  const totalRegistrations = inscritos.length;

  const todayStr = (() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  })();

  const todayRegistrations = inscritos.filter((i) => {
    if (!i.created_at) return false;
    const iso = i.created_at.toString().slice(0, 10);
    return iso === todayStr;
  }).length;

  let daysToEvent: number | null = null;
  if (eventDetails?.starts_at) {
    const now = new Date();
    const start = new Date(eventDetails.starts_at);
    const end = eventDetails.ends_at ? new Date(eventDetails.ends_at) : null;

    const todayMid = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const startMid = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    ).getTime();

    if (end && todayMid > end.getTime()) {
      daysToEvent = -1;
    } else {
      const diffMs = startMid - todayMid;
      daysToEvent = Math.round(diffMs / (1000 * 60 * 60 * 24));
    }
  }

  let registrationsChangePercent: number | null = null;
  if (data && data.length >= 2) {
    const last = data[data.length - 1].registrations_in_day;
    const prev = data[data.length - 2].registrations_in_day;
    if (prev > 0) {
      registrationsChangePercent = ((last - prev) / prev) * 100;
    } else if (last > 0) {
      registrationsChangePercent = 100;
    }
  }

  const capacity = eventDetails?.capacity ?? null;
  const title =
    eventDetails?.title || eventTitleFromQuery || "Inscrições do evento";

  return (
    <div className="flex min-h-dvh w-full flex-col  pt-6 pb-18 sm:px-8">
      {/* Wrapper centralizado pra tudo ficar contido */}
      <div className="mx-auto flex w-full max-w-5xl flex-col">
        {/* Cabeçalho + botão */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white sm:text-2xl">
              {title}
            </h1>
            {warning && (
              <p className="mt-1 text-sm text-amber-400">{warning}</p>
            )}
          </div>

          <button
            onClick={handleDownloadCsv}
            disabled={!inscritos.length}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600/70 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Baixar planilha
            <Download className="h-4 w-4" />
          </button>
        </div>

        {/* KPIs */}
        <div className="mb-6 w-full">
          <EventKpis
            totalRegistrations={totalRegistrations}
            capacity={capacity}
            todayRegistrations={todayRegistrations}
            daysToEvent={daysToEvent}
            registrationsChangePercent={registrationsChangePercent}
          />
        </div>

        {/* Gráfico */}
        <div className="mb-8 w-full">
          <StatisticsChart data={data} />
        </div>

        {/* Lista de inscritos */}
        <div className="mt-6 w-full">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base font-medium text-white backdrop-blur-sm transition hover:bg-white/10 sm:px-5 sm:py-4 sm:text-lg"
          >
            <span>Inscritos ({inscritos.length})</span>

            <svg
              className={`h-5 w-5 text-white/70 transition-transform duration-300 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>

          <div
            className={`overflow-hidden transition-all duration-150 mb-16 ${
              isOpen ? "opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="mt-4 space-y-3">
            <select
              className="form-control"
              value={order}
              onChange={(e) => setOrder(e.target.value as Orders)}
            >
              <option value="created_desc">Mais recentes primeiro</option>
              <option value="created_asc">Mais antigos primeiro</option>
              <option value="alpha">Ordem alfabética (A–Z)</option>
            </select>
              {sortedInscritos.map((inscrito) => (
                <InscritoCard
                  key={inscrito.id}
                  inscrito={inscrito}
                  onStatusChange={handleStatusChange}
                />
              ))}

              {sortedInscritos.length === 0 && (
                <p className="mt-4 text-center text-white/60">
                  Nenhum inscrito encontrado.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}