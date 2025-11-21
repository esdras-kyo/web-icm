'use client'
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import InscritoCard, { Inscrito } from "../CardIns"
import { useSearchParams } from "next/navigation";
import { Download } from "lucide-react";

export default function Inscricoes(){
  const searchParams = useSearchParams();
  const eventTitle = searchParams.get("title");
    const [loading, setLoading] = useState(false)
    const [inscritos, setInscritos] = useState<Inscrito[]>([])
    const [warning, setWarning] = useState("")
    const params = useParams();
    const id = params.id?.toString() 

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

      const titleForHeader = eventTitle || "Evento";

      const fileName = eventTitle
        ? `inscritos-${eventTitle}.csv`
        : "inscritos.csv";

      // Cabeçalho da tabela
      const header = [
        "Nome",
        "CPF",
        "Telefone",
        "Email",
        "Status pagamento",
        "Data inscrição",
      ];

      // Linhas da tabela
      const rows = inscritos.map((i) => [
        i.name,
        i.cpf,
        i.phone,
        i.email,
        i.payment_status,
        i.created_at
          ? new Date(i.created_at).toLocaleString("pt-BR")
          : "",
      ]);

      // Blocos do CSV:
      // 1) Metadados (Evento / Data de exportação)
      // 2) Linha em branco
      // 3) Cabeçalho
      // 4) Dados
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
              // escapa aspas internas
              return `"${value.replace(/"/g, '""')}"`;
            })
            .join(";")
        )
        .join("\n");

      // Blob com BOM pra acentos ficarem bonitos no Excel
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

    async function getRegistrations(id?: string) {
        setLoading(true);
        const res = await fetch(`/api/getsubs?id=${id}`, { cache: 'no-store' });
        if (!res.ok) {
            console.error('GET /api/getsubs failed', res.status, res.statusText);
            setWarning('Falha ao carregar inscritos');
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
useEffect(()=>{
    getRegistrations(id)
},[id])
if (loading)
    return (
      <main className="p-10 text-white text-center">
        <p>Carregando inscritos...</p>
      </main>
    );

    return(
        <div className="flex items-start px-8 justify-start flex-col w-full min-h-dvh">
            <h1>{warning}</h1>
            <div className="flex flex-col md:flex-row justify-between p-2 w-full gap-2 items-center ">
            <h1 className="text-2xl">Inscritos</h1>
            <button
        onClick={handleDownloadCsv}
        disabled={!inscritos.length}
        className="px-4 py-2 rounded bg-emerald-600/50 items-center text-white  flex flex-row  gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Baixar Planilha <Download  className=" w-4 h-4"/>
      </button>
      
      </div>

            {inscritos.map((inscrito) => (
  <InscritoCard key={inscrito.id} inscrito={inscrito} onStatusChange={handleStatusChange} />
))}
    
            {inscritos.length === 0 && (
        <p className="text-white/60 mt-6 text-center">Nenhum inscrito encontrado.</p>
      )}
        </div>
    )
}