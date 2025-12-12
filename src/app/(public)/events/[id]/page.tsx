"use client";
import Image from "next/image";
import { ArrowRightIcon, Loader2, CalendarDays, MapPin } from "lucide-react";
import { useParams,  useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type RegistrationFieldConfig = {
  enabled: boolean;
  required: boolean;
};

type RegistrationFields = {
  name: RegistrationFieldConfig;
  cpf: RegistrationFieldConfig;
  number: RegistrationFieldConfig;
  camisa: RegistrationFieldConfig;
  isMember: RegistrationFieldConfig;
  idade: RegistrationFieldConfig;
};

type Evento = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  description: string;
  image_key: string; // key no R2
  address?: string | null;
  registration_fields?: RegistrationFields | null;
  registration_ends_at?: string | null;
  capacity?: number | null
};

const DEFAULT_FIELDS: RegistrationFields = {
  name: { enabled: true, required: true },
  cpf: { enabled: true, required: true },
  number: { enabled: true, required: true },
  camisa: { enabled: false, required: false },
  isMember: { enabled: false, required: false },
  idade: { enabled: false, required: false },
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
  const [waningAge, setWaningAge] = useState("");

  const [loading, setLoading] = useState(false);
  const [isDone, setDone] = useState(false);
  const [show, setShow] = useState(false);

  const [isMember, setIsMember] = useState(false);
  const [idade, setIdade] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    event_id: "",
    payment_status: "",
    telefone: "",
    email: "",
  });

  const router = useRouter();

  const params = useParams();
  const event_id = params.id?.toString();

  // config de campos do evento (ou default se não tiver)
  const fieldConfig: RegistrationFields = useMemo(() => {
    if (!evento || !evento.registration_fields) return DEFAULT_FIELDS;
    return {
      ...DEFAULT_FIELDS,
      ...evento.registration_fields,
    };
  }, [evento]);

  const imageUrl = useMemo(
    () =>
      evento?.image_key?.length
        ? `https://worker-1.esdrascamel.workers.dev/${evento.image_key}`
        : "/images/fundo-geometrico.jpg",
    [evento]
  );

  const isRegistrationsClosed = useMemo(() => {
    if (!evento?.registration_ends_at) return true; // se não tiver data, considera ainda aberto
    const now = new Date();
    const regEnd = new Date(evento.registration_ends_at);
    return regEnd.getTime() < now.getTime();
  }, [evento?.registration_ends_at]);

  const getEvento = async (id?: string) => {
    const res = await fetch(`/api/events-on?id=${event_id}`, {
      cache: "no-store",
    });
    if (!res.ok) return;
    const data = await res.json();
    setEvento(data);
    console.log(data)
    setShow(true);
  };

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
    if (e.target.name === "idade") setWaningAge("");

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  async function handleFinalizar() {
    // zera avisos
    setWaningName("");
    setWaningCpf("");
    setWaningPhone("");
    setWaningCamiseta("");
    setWaningAge("");

    const cfg = fieldConfig;

    // validações dinâmicas
    const invalidName =
      !formData.nome || formData.nome.trim().length < 3;

    const digitsCpf = formData.cpf.replace(/\D/g, "");
    const invalidCpf =
      cfg.cpf.enabled &&
      (cfg.cpf.required || digitsCpf.length > 0) &&
      digitsCpf.length !== 11;

    const onlyDigitsPhone = formData.telefone.replace(/\D/g, "");
    const invalidPhone =
      cfg.number.enabled &&
      (cfg.number.required || onlyDigitsPhone.length > 0) &&
      onlyDigitsPhone.length < 10;

    // Camiseta:
    // - se cfg.camisa.required → sempre precisa de tamanho
    // - se não required → só precisa se "quero camiseta" estiver marcado
    let invalidCamiseta = false;
    if (cfg.camisa.enabled) {
      if (cfg.camisa.required && !tshirt_size) {
        invalidCamiseta = true;
      }
      if (!cfg.camisa.required && camiseta && !tshirt_size) {
        invalidCamiseta = true;
      }
    }

    // Idade
    const ageNumber = idade ? Number(idade) : NaN;
    let invalidAge = false;
    if (cfg.idade.enabled && cfg.idade.required) {
      if (Number.isNaN(ageNumber) || ageNumber <= 0) {
        invalidAge = true;
      }
    }

    if (invalidName) setWaningName("Nome é obrigatório");
    if (invalidCpf) setWaningCpf("CPF inválido");
    if (invalidPhone) setWaningPhone("Telefone inválido");
    if (invalidCamiseta)
      setWaningCamiseta("Escolha um tamanho de camiseta");
    if (invalidAge) setWaningAge("Informe uma idade válida");

    if (
      invalidName ||
      invalidCpf ||
      invalidPhone ||
      invalidCamiseta ||
      invalidAge
    ) {
      return;
    }

    setLoading(true);

    const res = await fetch("/api/add-sub", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.nome,
        cpf: cfg.cpf.enabled ? formData.cpf : null,
        phone: cfg.number.enabled ? formData.telefone : null,
        email: formData.email || null,
        payment_status: "pending",
        event_id,
        // extras – alinhar com a tabela/rota depois:
        shirt_size:
          cfg.camisa.enabled && tshirt_size ? tshirt_size : null,
        is_member: cfg.isMember.enabled ? isMember : null,
        age:
          cfg.idade.enabled && !Number.isNaN(ageNumber)
            ? ageNumber
            : null,
      }),
    });

    if (!res.ok) {
      console.log("erro ao fazer inscrição");
      setStatus("erro");
      setLoading(false);
    } else {
      const body = await res.json().catch(() => ({}));
      const registrationId = body?.id as string | undefined;
    
      setDone(true);
      setStatus("ok");
      setLoading(false);

      if (event_id) {
        if (registrationId) {
          router.push(`/events/${event_id}/confirmation?member=${isMember ? "1" : "0"}`);
        } else {
          router.push(`/events/${event_id}/confirmation`);
        }
      }
    }
  }

  useEffect(() => {
    getEvento(event_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helper pra formatar data legível (opcional; se quiser pode tirar e usar string pura)
  function formatDateTime(iso: string | undefined) {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="min-h-dvh w-full bg-black text-white">
      {/* HERO com imagem do evento ocupando topo */}
      <section className="relative w-full overflow-hidden h-[28vh] sm:h-[32vh] md:h-[52vh]">
        <Image
          src={imageUrl}
          alt={evento?.title || "Imagem do evento"}
          fill
          //sizes="100vw"
          className="object-contain md:object-cover object-top"
          priority
        />
        {/* overlay para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-6">
          <div className="flex flex-col gap-2">
            {evento && (
              <>
                <h1 className="text-2xl md:text-4xl font-bold drop-shadow-sm">
                  {evento.title}
                </h1>

                {/* data + endereço */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                  {evento.starts_at && (
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {formatDateTime(evento.starts_at)}
                    </span>
                  )}
                  {evento.address && (
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-6 w-6" />
                      {evento.address}
                    </span>
                  )}
                </div>


              </>
            )}
            
          </div>
        </div>
        
      </section>

      <section className="w-full px-4 py-6 flex justify-center">
  {evento?.description && (
    <div className="w-full max-w-3xl md:max-w-6xl rounded-2xl bg-linear-to-br from-zinc-900/80 to-zinc-800/40
                    backdrop-blur-xl border border-white/10 shadow-2xl p-6">

      {/* TÍTULO */}
      <h2 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
        Sobre o evento
      </h2>

      {/* DESCRIÇÃO */}
      <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed">
        {evento.description
          .split(/\n\s*\n/)
          .map((para, i) => (
            <p key={i} className="whitespace-pre-line">
              {para}
            </p>
        ))}
      </div>

    </div>
  )}
</section>
      

      {/* CARD flutuante de inscrição */}
      <section className="relative pb-16 ">
        <div className="mx-auto items-center flex justify-center max-w-6xl px-4 ">
          <div className="w-full flex items-center justify-center">
            {/* Formulário */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 md:p-6 flex flex-col w-full md:w-1/2">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-200">
                Inscrição
              </h2>
              {show && (
                  isRegistrationsClosed ? (
                    <div className="py-4 text-center text-sm text-red-300">
                    Inscrições encerradas
                    {evento?.registration_ends_at && (
                      <p className="mt-1 text-xs text-gray-400">
                        Encerradas em {formatDateTime(evento.registration_ends_at)}
                      </p>
                    )}
                  </div>
                  ): (
                <form
                  className="flex flex-col gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleFinalizar();
                  }}
                >
                  {/* Nome - sempre */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="nome"
                      className="text-sm text-gray-300"
                    >
                      Nome *
                    </label>
                    <input
                      id="nome"
                      name="nome"
                      placeholder="Insira seu nome..."
                      className={`w-full rounded-md border bg-black/40 px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        waningName
                          ? "border-red-400"
                          : "border-white/15"
                      }`}
                      onChange={handleChange}
                    />
                    {waningName && (
                      <p className="text-xs text-red-300">
                        {waningName}
                      </p>
                    )}
                  </div>

                  {/* CPF - só se o evento habilitar */}
                  {fieldConfig.cpf.enabled && (
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="cpf"
                        className="text-sm text-gray-300"
                      >
                        CPF{" "}
                        {fieldConfig.cpf.required && (
                          <span >*</span>
                        )}
                      </label>
                      <input
                        id="cpf"
                        name="cpf"
                        placeholder="000.000.000-00"
                        className={`w-full rounded-md border bg-black/40 px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          waningCpf
                            ? "border-red-400"
                            : "border-white/15"
                        }`}
                        onChange={(e) => {
                          handleChange(e);
                          setFormData((prev) => ({
                            ...prev,
                            cpf: maskCPF(e.target.value),
                          }));
                        }}
                        value={formData.cpf}
                      />
                      {waningCpf && (
                        <p className="text-xs text-red-300">
                          {waningCpf}
                        </p>
                      )}
                    </div>
                  )}

                  {/* E-mail - sempre opcional */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="email"
                      className="text-sm text-gray-300"
                    >
                      E-mail
                    </label>
                    <input
                      id="email"
                      name="email"
                      placeholder="email@email.com"
                      className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={handleChange}
                      type="email"
                    />
                  </div>

                  {/* Telefone - só se habilitado */}
                  {fieldConfig.number.enabled && (
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="telefone"
                        className="text-sm text-gray-300"
                      >
                        Telefone{" "}
                        {fieldConfig.number.required && (
                          <span>*</span>
                        )}
                      </label>
                      <input
                        id="telefone"
                        name="telefone"
                        placeholder="(00) 90000-0000"
                        className={`w-full rounded-md border bg-black/40 px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          waningPhone
                            ? "border-red-400"
                            : "border-white/15"
                        }`}
                        onChange={(e) => {
                          handleChange(e);
                          setFormData((prev) => ({
                            ...prev,
                            telefone: maskPhone(e.target.value),
                          }));
                        }}
                        value={formData.telefone}
                      />
                      {waningPhone && (
                        <p className="text-xs text-red-300">
                          {waningPhone}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Camiseta - controlado pelo config */}
                  {fieldConfig.camisa.enabled && (
                    <div className="mt-1 grid grid-cols-1 gap-3 md:grid-cols-2">
                      {/* Se NÃO for obrigatória: mantém o toggle "quero camiseta" */}
                      {!fieldConfig.camisa.required && (
                        <label className="inline-flex items-center gap-2 text-sm text-gray-300">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-white/20 bg-black/60"
                            checked={camiseta}
                            onChange={(e) => {
                              setCamiseta(e.target.checked);
                              if (!e.target.checked)
                                setWaningCamiseta("");
                            }}
                          />
                          Quero camiseta
                        </label>
                      )}

                      {/* Select de tamanho:
                          - se required: sempre visível
                          - se opcional: só visível quando toggle marcado
                      */}
                      {(fieldConfig.camisa.required || camiseta) && (
                        <select
                          className={`rounded-md border bg-black/40 px-3 py-2 text-sm ${
                            waningCamiseta
                              ? "border-red-400"
                              : "border-white/15"
                          }`}
                          value={tshirt_size}
                          onChange={(e) => {
                            setTshirtSize(e.target.value);
                            setWaningCamiseta("");
                          }}
                        >
                          <option value="">
                            {fieldConfig.camisa.required
                              ? "Selecione o tamanho"
                              : "Tamanho (opcional)"}
                          </option>
                          <option value="PP">PP</option>
                          <option value="P">P</option>
                          <option value="M">M</option>
                          <option value="G">G</option>
                          <option value="GG">GG</option>
                        </select>
                      )}

                      {waningCamiseta && (
                        <p className="col-span-2 -mt-2 text-xs text-red-300">
                          {waningCamiseta}
                        </p>
                      )}
                    </div>
                  )}

                  {/* É membro */}
                  {fieldConfig.isMember.enabled && (
                    <label className="mt-1 inline-flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/20 bg-black/60"
                        checked={isMember}
                        onChange={(e) =>
                          setIsMember(e.target.checked)
                        }
                      />
                      Sou membro da igreja
                    </label>
                  )}

                  {/* Idade */}
                  {fieldConfig.idade.enabled && (
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="idade"
                        className="text-sm text-gray-300"
                      >
                        Idade{" "}
                        {fieldConfig.idade.required && (
                          <span>*</span>
                        )}
                      </label>
                      <input
                        id="idade"
                        name="idade"
                        type="number"
                        min={0}
                        className={`w-full rounded-md border bg-black/40 px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          waningAge
                            ? "border-red-400"
                            : "border-white/15"
                        }`}
                        value={idade}
                        onChange={(e) => {
                          setIdade(e.target.value);
                          setWaningAge("");
                        }}
                      />
                      {waningAge && (
                        <p className="text-xs text-red-300">
                          {waningAge}
                        </p>
                      )}
                    </div>
                  )}

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
                    <p className="mt-2 text-sm text-emerald-300">
                      ✅ Inscrição realizada!
                    </p>
                  )}
                  {status === "erro" && (
                    <p className="mt-2 text-sm text-red-300">
                      ❌ Falha ao inscrever.
                    </p>
                  )}
                </form>)
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}