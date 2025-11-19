'use client'
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import InscritoCard, { Inscrito } from "../CardIns"

// type Inscrito = {
//     id: string
//     name: string
//     cpf: string 
//     event_id: string
//     telefone: string
//     email: string
//     payment_status: string
//     created_at: Date
// }
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

            {inscritos.map((inscrito) => (
  <InscritoCard key={inscrito.id} inscrito={inscrito} />
))}
    
            {inscritos.length === 0 && (
        <p className="text-white/60 mt-6 text-center">Nenhum inscrito encontrado.</p>
      )}
        </div>
    )
}