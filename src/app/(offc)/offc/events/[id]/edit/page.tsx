"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type RegistrationFieldConfig = { enabled: boolean; required: boolean };

type RegistrationFields = {
  name: RegistrationFieldConfig;
  cpf: RegistrationFieldConfig;
  number: RegistrationFieldConfig;
  camisa: RegistrationFieldConfig;
  isMember: RegistrationFieldConfig;
  idade: RegistrationFieldConfig;
};

type Visibility = "ORG" | "GLOBAL" | "INTERNAL";

type EventEdit = {
  id: string;

  title: string;
  description: string | null;

  starts_at: string; // ISO
  ends_at: string;   // ISO

  capacity: number | null;

  price: number;

  status: string | null; // seu banco é text

  visibility: Visibility;

  registration_starts_at: string | null;
  registration_ends_at: string | null;

  address: string | null;

  registration_fields: RegistrationFields;

  payment_note: string | null;
};

const DEFAULT_FIELDS: RegistrationFields = {
  name: { enabled: true, required: true },
  cpf: { enabled: false, required: false },
  number: { enabled: false, required: false },
  camisa: { enabled: false, required: false },
  isMember: { enabled: false, required: false },
  idade: { enabled: false, required: false },
};

function isoToLocalInput(iso: string | null | undefined) {
  if (!iso) return "";
  return iso.slice(0, 16); // "YYYY-MM-DDTHH:mm"
}

function localToStateIsoLike(value: string) {
  // guardamos como string mesmo (API converte)
  return value;
}

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<EventEdit | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  // usa seu endpoint existente de detalhes
  useEffect(() => {
    if (!id) return;

    async function fetchDetails() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/events/details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event_id: id }),
        });
        const json = await res.json();

        if (!res.ok || json?.error) {
          setError(json?.error || "Falha ao carregar evento");
          setEvent(null);
          return;
        }

        const normalized: EventEdit = {
          id: json.id,

          title: json.title ?? "",
          description: json.description ?? null,

          starts_at: json.starts_at ?? "",
          ends_at: json.ends_at ?? "",

          capacity: json.capacity ?? null,

          price: typeof json.price === "number" ? json.price : Number(json.price ?? 0),

          status: json.status ?? null,

          visibility: (json.visibility ?? "ORG") as Visibility,

          registration_starts_at: json.registration_starts_at ?? null,
          registration_ends_at: json.registration_ends_at ?? null,

          address: json.address ?? null,

          registration_fields: (json.registration_fields ?? DEFAULT_FIELDS) as RegistrationFields,

          payment_note: json.payment_note ?? null,
        };

        // garante default completo do registration_fields
        normalized.registration_fields = { ...DEFAULT_FIELDS, ...normalized.registration_fields };

        setEvent(normalized);
      } catch (e) {
        console.error(e);
        setError("Erro inesperado ao carregar");
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [id]);

  const fields = useMemo(() => {
    if (!event) return DEFAULT_FIELDS;
    return { ...DEFAULT_FIELDS, ...event.registration_fields };
  }, [event]);

  function setRegField(
    key: keyof RegistrationFields,
    patch: Partial<RegistrationFieldConfig>
  ) {
    setEvent((prev) => {
      if (!prev) return prev;
      const current = { ...DEFAULT_FIELDS, ...prev.registration_fields };
      const next = {
        ...current,
        [key]: { ...current[key], ...patch },
      };

      // regra: se desabilitar, required cai
      if (patch.enabled === false) {
        next[key] = { enabled: false, required: false };
      }

      return { ...prev, registration_fields: next };
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!event) return;

    setSaving(true);
    setError("");
    setOk("");

    // payload só com os campos permitidos
    const payload = {
      id: event.id,

      title: event.title,
      description: event.description,

      starts_at: isoToLocalInput(event.starts_at) || event.starts_at,
      ends_at: isoToLocalInput(event.ends_at) || event.ends_at,

      capacity: event.capacity,

      price: Number(event.price),

      status: event.status,

      visibility: event.visibility,

      registration_starts_at: event.registration_starts_at
        ? isoToLocalInput(event.registration_starts_at) || event.registration_starts_at
        : null,
      registration_ends_at: event.registration_ends_at
        ? isoToLocalInput(event.registration_ends_at) || event.registration_ends_at
        : null,

      address: event.address,

      registration_fields: event.registration_fields,

      payment_note: event.payment_note,
    };

    try {
      const res = await fetch("/api/events/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json?.error || "Erro ao salvar");
        return;
      }

      setOk("✅ Alterações salvas!");
      // se quiser voltar:
      // router.push(`/offc/events/${event.id}`);
    } catch (e) {
      console.error(e);
      setError("Erro inesperado ao salvar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="p-6 text-white">Carregando...</main>;
  }

  if (!event) {
    return (
      <main className="p-6 text-white">
        <p>Evento não encontrado.</p>
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
        <button
          className="mt-4 cursor-pointer rounded-md border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
          onClick={() => router.back()}
        >
          Voltar
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-6 text-white">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Editar evento</h1>
        <button
          type="button"
          className="cursor-pointer rounded-md border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
          onClick={() => router.push(`/offc/events/${event.id}`)}
        >
          Voltar
        </button>
      </div>

      {error && <p className="mb-3 text-sm text-red-300">{error}</p>}
      {ok && <p className="mb-3 text-sm text-emerald-300">{ok}</p>}

      <form onSubmit={handleSave} className="space-y-6">
        {/* title/description */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-lg font-semibold text-white/90">Informações</h2>

          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm text-white/80">Título *</label>
              <input
                className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={event.title}
                onChange={(e) => setEvent((p) => (p ? { ...p, title: e.target.value } : p))}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-white/80">Descrição</label>
              <textarea
                className="min-h-[120px] w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={event.description ?? ""}
                onChange={(e) =>
                  setEvent((p) => (p ? { ...p, description: e.target.value } : p))
                }
              />
            </div>
          </div>
        </section>

        {/* datas */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-lg font-semibold text-white/90">Datas do evento</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-white/80">Início (starts_at) *</label>
              <input
                type="datetime-local"
                className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={isoToLocalInput(event.starts_at)}
                onChange={(e) =>
                  setEvent((p) => (p ? { ...p, starts_at: localToStateIsoLike(e.target.value) } : p))
                }
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/80">Fim (ends_at) *</label>
              <input
                type="datetime-local"
                className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={isoToLocalInput(event.ends_at)}
                onChange={(e) =>
                  setEvent((p) => (p ? { ...p, ends_at: localToStateIsoLike(e.target.value) } : p))
                }
                required
              />
            </div>
          </div>
        </section>

        {/* capacidade/price/status/visibility */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-lg font-semibold text-white/90">Regras</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-white/80">Capacidade</label>
              <input
                type="number"
                min={0}
                className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={event.capacity ?? ""}
                onChange={(e) =>
                  setEvent((p) =>
                    p ? { ...p, capacity: e.target.value === "" ? null : Number(e.target.value) } : p
                  )
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-white/80">Preço (price) *</label>
              <input
                type="number"
                min={0}
                step="0.01"
                className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={Number.isFinite(event.price) ? event.price : 0}
                onChange={(e) =>
                  setEvent((p) => (p ? { ...p, price: Number(e.target.value) } : p))
                }
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-white/80">Status</label>
              <input
                className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="ATIVO / DESATIVADO / etc..."
                value={event.status ?? ""}
                onChange={(e) => setEvent((p) => (p ? { ...p, status: e.target.value } : p))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-white/80">Visibilidade *</label>
              <select
                className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none"
                value={event.visibility}
                onChange={(e) =>
                  setEvent((p) => (p ? { ...p, visibility: e.target.value as Visibility } : p))
                }
                required
              >
                <option value="ORG">ORG</option>
                <option value="GLOBAL">GLOBAL</option>
                <option value="INTERNAL">INTERNAL</option>
              </select>
            </div>
          </div>
        </section>

        {/* inscrições */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-lg font-semibold text-white/90">Período de inscrição</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-white/80">Início inscrições</label>
              <input
                type="datetime-local"
                className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={isoToLocalInput(event.registration_starts_at)}
                onChange={(e) =>
                  setEvent((p) =>
                    p ? { ...p, registration_starts_at: e.target.value || null } : p
                  )
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-white/80">Fim inscrições</label>
              <input
                type="datetime-local"
                className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={isoToLocalInput(event.registration_ends_at)}
                onChange={(e) =>
                  setEvent((p) =>
                    p ? { ...p, registration_ends_at: e.target.value || null } : p
                  )
                }
              />
            </div>
          </div>
        </section>

        {/* address */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-lg font-semibold text-white/90">Local</h2>

          <label className="mb-1 block text-sm text-white/80">Endereço</label>
          <input
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            value={event.address ?? ""}
            onChange={(e) => setEvent((p) => (p ? { ...p, address: e.target.value } : p))}
          />
        </section>

        {/* registration_fields */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-lg font-semibold text-white/90">Campos da inscrição</h2>

          <div className="space-y-3">
            {(
              [
                ["name", "Nome"],
                ["cpf", "CPF"],
                ["number", "Telefone"],
                ["camisa", "Camiseta"],
                ["isMember", "É membro"],
                ["idade", "Idade"],
              ] as Array<[keyof RegistrationFields, string]>
            ).map(([key, label]) => {
              const cfg = fields[key];
              return (
                <div
                  key={key}
                  className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-medium text-white/90">{label}</p>
                    <p className="text-xs text-white/50">Ativar e definir obrigatoriedade</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <label className="inline-flex items-center gap-2 text-sm text-white/80">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={cfg.enabled}
                        onChange={(e) => setRegField(key, { enabled: e.target.checked })}
                      />
                      Ativo
                    </label>

                    <label className="inline-flex items-center gap-2 text-sm text-white/80">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={cfg.required}
                        disabled={!cfg.enabled}
                        onChange={(e) => setRegField(key, { required: e.target.checked })}
                      />
                      Obrigatório
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* payment_note */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-lg font-semibold text-white/90">Pagamento</h2>

          <label className="mb-1 block text-sm text-white/80">payment_note</label>
          <textarea
            className="min-h-[90px] w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            value={event.payment_note ?? ""}
            onChange={(e) =>
              setEvent((p) => (p ? { ...p, payment_note: e.target.value } : p))
            }
          />
        </section>

        {/* ações */}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="cursor-pointer rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/offc/events/${event.id}`)}
            className="cursor-pointer rounded-md border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Voltar sem salvar
          </button>
        </div>
      </form>
    </main>
  );
}