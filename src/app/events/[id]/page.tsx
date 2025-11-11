"use client";
import Image from "next/image";
import { ArrowRightIcon, Loader2, CalendarDays} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Evento = {
  id: string;
  title: string;
  starts_at:string;
  ends_at: string;
  description: string;
  image_key: string; // url (signed or public)
  // optionally you can add: starts_at, location, price, etc.
};

export default function EventoInscricaoCard() {
  const [evento, setEvento] = useState<Evento>();
  const [status, setStatus] = useState<"idle" | "ok" | "erro">("idle");
  const [tshirt_size, setTshirtSize] = useState("");
  const [camiseta, setCamiseta] = useState(false);
  const [waningName, setWaningName] = useState("");
  const [waningCpf, setWaningCpf] = useState("");
  const [waningCamiseta, setWaningCamiseta] = useState("");
  const [waningPhone, setWaningPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDone, setDone] = useState(false);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    event_id: "",
    payment_status: "",
    telefone: "",
    email: "",
  });

  const params = useParams();
  const event_id = params.id?.toString();

  const imageUrl = useMemo(
    () => (evento?.image_key?.length ? `https://worker-1.esdrascamel.workers.dev/${evento.image_key}` : "/images/fundo-geometrico.jpg"),
    [evento]
  );


  const getEvento = async (id?: string) => {
    const res = await fetch(`/api/events-on?id=${event_id}`, { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setEvento(data);
    setShow(true);
  };

  async function handleFinalizar() {
    // validações simples
    const invalidName = !formData.nome || formData.nome.trim().length < 3;
    const invalidCpf = !formData.cpf || formData.cpf.replace(/\D/g, "").length !== 11;
    const onlyDigitsPhone = formData.telefone.replace(/\D/g, "");
    const invalidPhone = onlyDigitsPhone.length < 10; // 10 fixo, 11 celular

    if (invalidName) setWaningName("Nome é obrigatório");
    if (invalidCpf) setWaningCpf("CPF inválido");
    if (invalidPhone) setWaningPhone("Telefone inválido");
    if (camiseta && !tshirt_size) setWaningCamiseta("Escolha um tamanho de camiseta");

    if (invalidName || invalidCpf || invalidPhone || (camiseta && !tshirt_size)) return;

    setLoading(true);

    const res = await fetch("/api/add-sub", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.nome,
        cpf: formData.cpf,
        phone: formData.telefone,
        email: formData.email,
        payment_status: "pending",
        event_id,
      }),
    });

    // const data = await res.json();
    // console.log(formData, data);

    if (!res.ok) {
      console.log("erro ao fazer inscrição");
      setStatus("erro");
      setLoading(false);
    } else {
      setDone(true);
      setStatus("ok");
      setLoading(false);
    }
  }

  function maskCPF(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function maskPhone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 10) {
      return digits
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
    }
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "nome") setWaningName("");
    if (e.target.name === "cpf") setWaningCpf("");
    if (e.target.name === "telefone") setWaningPhone("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getEvento(event_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-dvh w-full bg-black text-white">
      {/* HERO com imagem do evento ocupando topo */}
      <section className="relative h-[44vh] md:h-[52vh] w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={evento?.title || "Imagem do evento"}
          fill
          sizes="100vw"
          className="object-cover"
          priority={true}
        />
        {/* overlay para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-6">
          <div className="flex flex-col gap-2">
            {evento && (
              <>
                <h1 className="text-2xl md:text-4xl font-bold drop-shadow-sm">{evento.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                  {evento.starts_at && (
                    <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4"/>{evento.starts_at}</span>
                  )}
                  {/* exemplo de local, se existir no objeto */}
                  {/* <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4"/>Auditório Central</span> */}
                </div>
                {evento.description && (
                  <p className="max-w-2xl text-gray-300/90 line-clamp-2 md:line-clamp-3">{evento.description}</p>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* CARD flutuante de inscrição */}
      <section className="relative pb-16 ">
        <div className="mx-auto items-center flex justify-center max-w-6xl px-4 ">
          <div className="w-full flex items-center justify-center">


            {/* Formulário */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 md:p-6 flex flex-col w-full md:w-1/2">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-200">Inscrição</h2>
              {show && (
                <form className="flex flex-col gap-3" onSubmit={(e)=>{e.preventDefault(); handleFinalizar();}}>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="nome" className="text-sm text-gray-300">Nome *</label>
                    <input
                      id="nome"
                      name="nome"
                      placeholder="Insira seu nome..."
                      className={`w-full rounded-md border bg-black/40 px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${waningName ? "border-red-400" : "border-white/15"}`}
                      onChange={handleChange}
                    />
                    {waningName && <p className="text-xs text-red-300">{waningName}</p>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="cpf" className="text-sm text-gray-300">CPF *</label>
                    <input
                      id="cpf"
                      name="cpf"
                      placeholder="000.000.000-00"
                      className={`w-full rounded-md border bg-black/40 px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${waningCpf ? "border-red-400" : "border-white/15"}`}
                      onChange={(e) => {
                        handleChange(e);
                        setFormData({ ...formData, cpf: maskCPF(e.target.value) });
                      }}
                      value={formData.cpf}
                    />
                    {waningCpf && <p className="text-xs text-red-300">{waningCpf}</p>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-sm text-gray-300">E-mail</label>
                    <input
                      id="email"
                      name="email"
                      placeholder="email@email.com"
                      className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={handleChange}
                      type="email"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="telefone" className="text-sm text-gray-300">Telefone *</label>
                    <input
                      id="telefone"
                      name="telefone"
                      placeholder="(00) 90000-0000"
                      className={`w-full rounded-md border bg-black/40 px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${waningPhone ? "border-red-400" : "border-white/15"}`}
                      onChange={(e) => {
                        handleChange(e);
                        setFormData({ ...formData, telefone: maskPhone(e.target.value) });
                      }}
                      value={formData.telefone}
                    />
                    {waningPhone && <p className="text-xs text-red-300">{waningPhone}</p>}
                  </div>

                  {/* Camiseta (opcional) */}
                  <div className="mt-1 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <label className="inline-flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/20 bg-black/60"
                        checked={camiseta}
                        onChange={(e) => {
                          setCamiseta(e.target.checked);
                          if (!e.target.checked) setWaningCamiseta("");
                        }}
                      />
                      Quero camiseta
                    </label>

                    {camiseta && (
                      <select
                        className={`rounded-md border bg-black/40 px-3 py-2 text-sm ${waningCamiseta ? "border-red-400" : "border-white/15"}`}
                        value={tshirt_size}
                        onChange={(e) => {
                          setTshirtSize(e.target.value);
                          setWaningCamiseta("");
                        }}
                      >
                        <option value="">Tamanho</option>
                        <option value="PP">PP</option>
                        <option value="P">P</option>
                        <option value="M">M</option>
                        <option value="G">G</option>
                        <option value="GG">GG</option>
                      </select>
                    )}
                    {waningCamiseta && (
                      <p className="col-span-2 -mt-2 text-xs text-red-300">{waningCamiseta}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group mt-2 cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-md  px-4 py-2 font-medium bg-black hover:bg-slate-900 text-white shadow-lg shadow-sky-900/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        Continuar
                        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>

                  {isDone && (
                    <p className="mt-2 text-sm text-emerald-300">✅ Inscrição realizada!</p>
                  )}
                  {status === "erro" && (
                    <p className="mt-2 text-sm text-red-300">❌ Falha ao inscrever.</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
