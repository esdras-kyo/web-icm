'use client'
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type Inscrito = {
    id: string
    name: string
    cpf: string 
    event_id: string
    telefone: string
    email: string
    payment_status: string
    created_at: Date
}
export default function Inscricoes(){
    const [loading, setLoading] = useState(false)
    const [inscritos, setInscritos] = useState<Inscrito[]>([])
    const [warning, setWarning] = useState("")
    const params = useParams();
    const id = params.id?.toString() 

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
        console.log(data)
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
            <ul className="mt-6 w-full space-y-3">
  {inscritos.map((ev) => {
    const data = new Date(ev.created_at)
    const dataFormatada = data.toLocaleDateString("pt-BR")

    return (
      <li
        key={ev.id}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900/40 p-4 hover:bg-zinc-800/60 transition-all duration-150 cursor-pointer text-white"
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">{ev.name}</h2>
          <p className="text-zinc-400 text-sm">📞 {ev.telefone}</p>
          <p className="text-zinc-400 text-sm">✉️ {ev.email}</p>
          <p className="text-zinc-500 text-xs mt-1">Inscrito em {dataFormatada}</p>
          <span
            className={`inline-block mt-2 text-xs px-2 py-1 rounded-full `}
          >
            {ev.payment_status === "paid"
              ? "Pagamento confirmado"
              : ev.payment_status === "pending"
              ? "Aguardando pagamento"
              : "Pagamento falhou"}
          </span>
        </div>
      </li>
    )
  })}
</ul>
            {inscritos.length === 0 && (
        <p className="text-white/60 mt-6 text-center">Nenhum inscrito encontrado.</p>
      )}
        </div>
    )
}