"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useRef } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ImageIcon,
  Loader2,
  Upload,
  X,
  CalendarDays,
  ClipboardList,
  Users,
  MapPin,
  CreditCard,
} from "lucide-react";

type RegistrationFieldConfig = { enabled: boolean; required: boolean };

type RegistrationFields = {
  name: RegistrationFieldConfig;
  cpf: RegistrationFieldConfig;
  number: RegistrationFieldConfig;
  camisa: RegistrationFieldConfig;
  isMember: RegistrationFieldConfig;
  idade: RegistrationFieldConfig;
  church: RegistrationFieldConfig;
  how_heard: RegistrationFieldConfig;
  isBeliever: RegistrationFieldConfig;
  email: RegistrationFieldConfig;
};

type Visibility = "ORG" | "DEPARTMENT";
type Status = "ATIVO" | "DESATIVADO";

type EventEdit = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string;
  capacity: number | null;
  price: number;
  status: Status | null;
  visibility: Visibility;
  registration_starts_at: string | null;
  registration_ends_at: string | null;
  address: string | null;
  registration_fields: RegistrationFields;
  payment_note: string | null;
  pix_key: string | null;
  pix_description: string | null;
  image_key: string | null;
};

type ImageUploadState =
  | { phase: "idle" }
  | { phase: "uploading" }
  | { phase: "success" }
  | { phase: "error"; message: string };

type FeedbackState =
  | { type: "idle" }
  | { type: "saving" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const DEFAULT_FIELDS: RegistrationFields = {
  name: { enabled: true, required: true },
  cpf: { enabled: false, required: false },
  number: { enabled: false, required: false },
  camisa: { enabled: false, required: false },
  isMember: { enabled: false, required: false },
  idade: { enabled: false, required: false },
  church: { enabled: false, required: false },
  how_heard: { enabled: false, required: false },
  isBeliever: { enabled: false, required: false },
  email: { enabled: false, required: false },
};

const REGISTRATION_FIELD_LABELS: Array<[keyof RegistrationFields, string]> = [
  ["name", "Nome completo"],
  ["cpf", "CPF"],
  ["number", "Telefone / WhatsApp"],
  ["camisa", "Tamanho da camisa"],
  ["isMember", "É membro da igreja?"],
  ["idade", "Idade"],
  ["church", "Qual sua igreja?"],
  ["how_heard", "Como soube desse evento?"],
  ["isBeliever", "Já aceitou Jesus?"],
  ["email", "E-mail"],
];

/** Converts ISO string to "YYYY-MM-DDTHH:mm" for datetime-local inputs */
function isoToLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 16);
}

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<EventEdit | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: "idle" });

  // Image upload state
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imgUpload, setImgUpload] = useState<
    { phase: "idle" } | { phase: "uploading" } | { phase: "success" } | { phase: "error"; message: string }
  >({ phase: "idle" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSaving = feedback.type === "saving";

  useEffect(() => {
    if (!id) return;

    async function fetchDetails() {
      try {
        setLoading(true);
        setLoadError("");
        const res = await fetch("/api/events/details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event_id: id }),
        });
        const json = await res.json();

        if (!res.ok || json?.error) {
          setLoadError(json?.error || "Falha ao carregar evento");
          setEvent(null);
          return;
        }
        const normalizedVisibility: Visibility =
          json.visibility === "DEPARTMENT" ? "DEPARTMENT" : "ORG";

        const normalized: EventEdit = {
          id: json.id,
          title: json.title ?? "",
          description: json.description ?? null,
          starts_at: json.starts_at ?? "",
          ends_at: json.ends_at ?? "",
          capacity: json.capacity ?? null,
          price:
            typeof json.price === "number"
              ? json.price
              : Number(json.price ?? 0),
          status: (json.status as Status) ?? null,
          visibility: normalizedVisibility,
          registration_starts_at: json.registration_starts_at ?? null,
          registration_ends_at: json.registration_ends_at ?? null,
          address: json.address ?? null,
          registration_fields: {
            ...DEFAULT_FIELDS,
            ...(json.registration_fields ?? {}),
          } as RegistrationFields,
          payment_note: json.payment_note ?? null,
          pix_key: json.pix_key ?? null,
          pix_description: json.pix_description ?? null,
          image_key: json.image_key ?? null,
        };

        setEvent(normalized);
      } catch (e) {
        console.error(e);
        setLoadError("Erro inesperado ao carregar");
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
    patch: Partial<RegistrationFieldConfig>,
  ) {
    setEvent((prev) => {
      if (!prev) return prev;
      const current = { ...DEFAULT_FIELDS, ...prev.registration_fields };
      const updated = { ...current[key], ...patch };

      if (patch.enabled === false) {
        updated.enabled = false;
        updated.required = false;
      }

      return {
        ...prev,
        registration_fields: { ...current, [key]: updated },
      };
    });
  }

  function validate(): string | null {
    if (!event) return null;
    if (!event.title.trim()) return "O título é obrigatório.";

    const start = new Date(event.starts_at);
    const end = new Date(event.ends_at);

    if (!event.starts_at || isNaN(start.getTime()))
      return "Informe uma data de início válida.";
    if (!event.ends_at || isNaN(end.getTime()))
      return "Informe uma data de término válida.";
    if (end <= start) return "O término do evento deve ser depois do início.";

    if (event.registration_starts_at && event.registration_ends_at) {
      const regStart = new Date(event.registration_starts_at);
      const regEnd = new Date(event.registration_ends_at);
      if (regEnd <= regStart)
        return "O fim das inscrições deve ser depois do início.";
    }

    if (!event.registration_starts_at && event.registration_ends_at)
      return "Defina também o início das inscrições.";

    if (event.registration_starts_at && !event.registration_ends_at)
      return "Defina também o fim das inscrições.";

    return null;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImgUpload({ phase: "idle" });
  }

  async function handleImageUpload() {
    if (!pendingFile || !event) return;
    setImgUpload({ phase: "uploading" });

    try {
      // 1. Gera URL presignada
      const presignRes = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: pendingFile.name, contentType: pendingFile.type }),
      });
      if (!presignRes.ok) throw new Error("Falha ao gerar URL de upload");
      const { key, uploadUrl } = await presignRes.json() as { key: string; uploadUrl: string };

      // 2. Faz PUT direto no R2
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": pendingFile.type },
        body: pendingFile,
      });
      if (!putRes.ok) throw new Error("Falha ao enviar arquivo");

      // 3. Confirma no banco e deleta imagem antiga
      const confirmRes = await fetch("/api/uploads/confirm-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          fileKey: key,
          oldKey: event.image_key ?? undefined,
        }),
      });
      if (!confirmRes.ok) throw new Error("Falha ao confirmar upload");

      // 4. Atualiza estado local
      setEvent((prev) => prev ? { ...prev, image_key: key } : prev);
      setPendingFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setImgUpload({ phase: "success" });
    } catch (err) {
      setImgUpload({ phase: "error", message: err instanceof Error ? err.message : "Erro desconhecido" });
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!event) return;

    const validationError = validate();
    if (validationError) {
      setFeedback({ type: "error", message: validationError });
      return;
    }

    setFeedback({ type: "saving" });

    const payload = {
      id: event.id,
      title: event.title,
      description: event.description,
      starts_at: event.starts_at,
      ends_at: event.ends_at,
      capacity: event.capacity,
      price: Number(event.price),
      status: event.status,
      visibility: event.visibility,
      registration_starts_at: event.registration_starts_at || null,
      registration_ends_at: event.registration_ends_at || null,
      address: event.address,
      registration_fields: event.registration_fields,
      payment_note: event.payment_note,
      pix_key: event.pix_key,
      pix_description: event.pix_description,
      church: event.registration_fields.church,
      how_heard: event.registration_fields.how_heard,
      isBeliever: event.registration_fields.isBeliever,
      email: event.registration_fields.email,
    };

    try {
      const res = await fetch("/api/events/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        setFeedback({
          type: "error",
          message: json?.error || "Erro ao salvar alterações.",
        });
        return;
      }

      setFeedback({
        type: "success",
        message: "Alterações salvas com sucesso!",
      });
    } catch (e) {
      console.error(e);
      setFeedback({ type: "error", message: "Erro inesperado ao salvar." });
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center p-6 text-white">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
          <span className="text-zinc-400">Carregando evento…</span>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="p-6 text-white">
        <p className="text-zinc-300">Evento não encontrado.</p>
        {loadError && <p className="mt-2 text-sm text-red-400">{loadError}</p>}
        <button
          type="button"
          className="mt-4 cursor-pointer rounded-md border border-white/20 px-4 py-2 text-sm hover:bg-white/10 transition-colors"
          onClick={() => router.back()}
        >
          Voltar
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 text-white">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={() => router.push(`/offc/events/${event.id}`)}
            className="mb-2 flex cursor-pointer items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar para inscrições
          </button>
          <h1 className="text-xl font-semibold">Editar evento</h1>
        </div>
      </div>

      {/* Feedback banners */}
      {feedback.type === "success" && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <p className="flex-1 text-sm font-medium text-emerald-300">
            {feedback.message}
          </p>
          <button
            type="button"
            onClick={() => setFeedback({ type: "idle" })}
            className="cursor-pointer text-emerald-400/60 hover:text-emerald-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {feedback.type === "error" && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-300">
              {feedback.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFeedback({ type: "idle" })}
            className="cursor-pointer text-red-400/60 hover:text-red-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* ── Seção 1: Informações gerais ── */}
        <FormSection
          icon={<ClipboardList className="h-4 w-4" />}
          title="Informações gerais"
        >
          <div className="grid gap-4">
            <div>
              <FieldLabel required>Título</FieldLabel>
              <input
                className={inputCls}
                value={event.title}
                onChange={(e) =>
                  setEvent((p) => (p ? { ...p, title: e.target.value } : p))
                }
                disabled={isSaving}
                required
              />
            </div>

            <div>
              <FieldLabel>Descrição</FieldLabel>
              <textarea
                className={`${inputCls} min-h-[110px] resize-y`}
                value={event.description ?? ""}
                onChange={(e) =>
                  setEvent((p) =>
                    p ? { ...p, description: e.target.value || null } : p,
                  )
                }
                disabled={isSaving}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel required>Visibilidade</FieldLabel>
                <select
                  className={selectCls}
                  value={event.visibility}
                  onChange={(e) =>
                    setEvent((p) =>
                      p
                        ? { ...p, visibility: e.target.value as Visibility }
                        : p,
                    )
                  }
                  disabled={isSaving}
                  required
                >
                  <option value="ORG">Público — visível a todos</option>
                  <option value="DEPARTMENT">Interno — apenas líderes</option>
                </select>
              </div>

              <div>
                <FieldLabel>Status</FieldLabel>
                <select
                  className={selectCls}
                  value={event.status ?? "ATIVO"}
                  onChange={(e) =>
                    setEvent((p) =>
                      p ? { ...p, status: e.target.value as Status } : p,
                    )
                  }
                  disabled={isSaving}
                >
                  <option value="ATIVO">Ativo — visível na listagem</option>
                  <option value="DESATIVADO">
                    Desativado — oculto sem apagar dados
                  </option>
                </select>
              </div>
            </div>
          </div>
        </FormSection>

        {/* ── Seção 2: Datas ── */}
        <FormSection icon={<CalendarDays className="h-4 w-4" />} title="Datas">
          <div className="space-y-4">
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-sky-400">
                Data do evento
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel required>Início</FieldLabel>
                  <input
                    type="datetime-local"
                    className={inputCls}
                    value={isoToLocalInput(event.starts_at)}
                    onChange={(e) =>
                      setEvent((p) =>
                        p ? { ...p, starts_at: e.target.value } : p,
                      )
                    }
                    disabled={isSaving}
                    required
                  />
                </div>
                <div>
                  <FieldLabel required>Fim</FieldLabel>
                  <input
                    type="datetime-local"
                    className={inputCls}
                    value={isoToLocalInput(event.ends_at)}
                    onChange={(e) =>
                      setEvent((p) =>
                        p ? { ...p, ends_at: e.target.value } : p,
                      )
                    }
                    disabled={isSaving}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">
                  Período de inscrições
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Opcional. Deixe em branco para inscrições sempre abertas.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel>Início</FieldLabel>
                  <input
                    type="datetime-local"
                    className={inputCls}
                    value={isoToLocalInput(event.registration_starts_at)}
                    onChange={(e) =>
                      setEvent((p) =>
                        p
                          ? {
                              ...p,
                              registration_starts_at: e.target.value || null,
                            }
                          : p,
                      )
                    }
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <FieldLabel>Fim</FieldLabel>
                  <input
                    type="datetime-local"
                    className={inputCls}
                    value={isoToLocalInput(event.registration_ends_at)}
                    onChange={(e) =>
                      setEvent((p) =>
                        p
                          ? {
                              ...p,
                              registration_ends_at: e.target.value || null,
                            }
                          : p,
                      )
                    }
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>
          </div>
        </FormSection>

        {/* ── Seção 3: Capacidade e preço ── */}
        <FormSection
          icon={<Users className="h-4 w-4" />}
          title="Inscrições & capacidade"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel>Capacidade</FieldLabel>
              <input
                type="number"
                min={0}
                className={inputCls}
                placeholder="Ex.: 100"
                value={event.capacity ?? ""}
                onChange={(e) =>
                  setEvent((p) =>
                    p
                      ? {
                          ...p,
                          capacity:
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                        }
                      : p,
                  )
                }
                disabled={isSaving}
              />
              <p className="mt-1 text-xs text-zinc-500">
                Número máximo de participantes.
              </p>
            </div>

            <div>
              <FieldLabel required>Preço</FieldLabel>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-zinc-400">
                  R$
                </span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className={`${inputCls} pl-9`}
                  value={Number.isFinite(event.price) ? event.price : 0}
                  onChange={(e) =>
                    setEvent((p) =>
                      p ? { ...p, price: Number(e.target.value) } : p,
                    )
                  }
                  disabled={isSaving}
                  required
                />
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                Use 0 para evento gratuito.
              </p>
            </div>
          </div>
        </FormSection>

        {/* ── Seção 4: Local ── */}
        <FormSection icon={<MapPin className="h-4 w-4" />} title="Local">
          <div>
            <FieldLabel>
              Endereço{" "}
              <span className="font-normal text-zinc-500">(opcional)</span>
            </FieldLabel>
            <input
              className={inputCls}
              placeholder="Rua, número, bairro — cidade/UF"
              value={event.address ?? ""}
              onChange={(e) =>
                setEvent((p) =>
                  p ? { ...p, address: e.target.value || null } : p,
                )
              }
              disabled={isSaving}
            />
          </div>
        </FormSection>

        {/* ── Seção 5: Imagem ── */}
        <FormSection icon={<ImageIcon className="h-4 w-4" />} title="Imagem do evento">
          <div className="space-y-4">
            {/* Prévia atual ou nova */}
            <div className="relative h-44 w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
              {previewUrl ? (
                <>
                  <Image
                    src={previewUrl}
                    alt="Prévia da nova imagem"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <span className="absolute left-2 top-2 rounded-full bg-amber-500/80 px-2 py-0.5 text-xs font-medium text-black">
                    Nova — ainda não salva
                  </span>
                </>
              ) : event.image_key ? (
                <Image
                  src={`https://worker-1.esdrascamel.workers.dev/${event.image_key}`}
                  alt="Imagem atual do evento"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-500">
                  <ImageIcon className="h-8 w-8" />
                  <p className="text-sm">Nenhuma imagem</p>
                </div>
              )}
            </div>

            {/* Input de arquivo oculto */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="flex flex-wrap items-center gap-3">
              {/* Botão selecionar */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={imgUpload.phase === "uploading"}
                className="cursor-pointer inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="h-4 w-4" />
                {event.image_key ? "Trocar imagem" : "Selecionar imagem"}
              </button>

              {/* Botão confirmar upload — só aparece quando há arquivo pendente */}
              {pendingFile && (
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={imgUpload.phase === "uploading"}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {imgUpload.phase === "uploading" ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Enviando…</>
                  ) : (
                    <><CheckCircle2 className="h-4 w-4" />Confirmar upload</>
                  )}
                </button>
              )}

              {/* Cancelar seleção */}
              {pendingFile && imgUpload.phase !== "uploading" && (
                <button
                  type="button"
                  onClick={() => {
                    setPendingFile(null);
                    setPreviewUrl(null);
                    setImgUpload({ phase: "idle" });
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="cursor-pointer inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </button>
              )}
            </div>

            {/* Feedback do upload */}
            {imgUpload.phase === "success" && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Imagem atualizada com sucesso!
              </div>
            )}
            {imgUpload.phase === "error" && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {imgUpload.message}
              </div>
            )}

            <p className="text-xs text-zinc-500">
              Formatos aceitos: JPEG, PNG, WebP, AVIF. A imagem anterior será apagada automaticamente.
            </p>
          </div>
        </FormSection>

        {/* ── Seção 6: Campos do formulário de inscrição ── */}
        <FormSection
          icon={<ClipboardList className="h-4 w-4" />}
          title="Campos do formulário de inscrição"
        >
          <div className="space-y-2">
            {/* Header row */}
            <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto] items-center gap-4 px-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
              <span>Campo</span>
              <span className="w-16 text-center">Incluir</span>
              <span className="w-20 text-center">Obrigatório</span>
            </div>

            {REGISTRATION_FIELD_LABELS.map(([key, label]) => {
              const cfg = fields[key];
              return (
                <div
                  key={key}
                  className={`grid grid-cols-1 gap-3 rounded-xl border px-4 py-3 transition-colors sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-4 ${
                    cfg.enabled
                      ? "border-white/15 bg-white/5"
                      : "border-white/5 bg-white/2"
                  }`}
                >
                  <p
                    className={`text-sm font-medium transition-colors ${
                      cfg.enabled ? "text-white" : "text-zinc-500"
                    }`}
                  >
                    {label}
                  </p>

                  <div className="flex items-center justify-between sm:block">
                    <span className="text-xs text-zinc-500 sm:hidden">
                      Incluir
                    </span>
                    <div className="flex items-center justify-center sm:w-16">
                      <input
                        type="checkbox"
                        className="h-4 w-4 cursor-pointer accent-sky-500"
                        checked={cfg.enabled}
                        disabled={isSaving}
                        onChange={(e) =>
                          setRegField(key, { enabled: e.target.checked })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:block">
                    <span className="text-xs text-zinc-500 sm:hidden">
                      Obrigatório
                    </span>
                    <div className="flex items-center justify-center sm:w-20">
                      <input
                        type="checkbox"
                        className="h-4 w-4 cursor-pointer accent-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
                        checked={cfg.required}
                        disabled={!cfg.enabled || isSaving}
                        onChange={(e) =>
                          setRegField(key, { required: e.target.checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </FormSection>

        {/* ── Seção 6: Pagamento ── */}
        <FormSection
          icon={<CreditCard className="h-4 w-4" />}
          title="Pagamento"
        >
          <div className="space-y-4">
            <div>
              <FieldLabel>
                Instruções de pagamento{" "}
                <span className="font-normal text-zinc-500">(opcional)</span>
              </FieldLabel>
              <textarea
                className={`${inputCls} min-h-[90px] resize-y`}
                placeholder={`Ex.: Membros pagam metade. Crianças até 12 anos não pagam.\nApresente o comprovante no dia do evento.`}
                value={event.payment_note ?? ""}
                onChange={(e) =>
                  setEvent((p) =>
                    p ? { ...p, payment_note: e.target.value || null } : p,
                  )
                }
                disabled={isSaving}
              />
              <p className="mt-1 text-xs text-zinc-500">
                Aparecerá na tela de confirmação de inscrição.
              </p>
            </div>

            <div>
              <FieldLabel>
                Chave Pix{" "}
                <span className="font-normal text-zinc-500">(opcional — apenas para eventos pagos)</span>
              </FieldLabel>
              <input
                className={inputCls}
                placeholder="CNPJ, CPF, e-mail, telefone ou chave aleatória"
                value={event.pix_key ?? ""}
                onChange={(e) =>
                  setEvent((p) =>
                    p ? { ...p, pix_key: e.target.value || null } : p,
                  )
                }
                disabled={isSaving}
              />
              <p className="mt-1 text-xs text-zinc-500">
                Usado para gerar o QR Code Pix na confirmação de inscrição.
              </p>
            </div>

            <div>
              <FieldLabel>
                Descrição do Pix{" "}
                <span className="font-normal text-zinc-500">(opcional — máx. 72 caracteres)</span>
              </FieldLabel>
              <input
                className={inputCls}
                placeholder="Ex.: Inscrição retiro 2025"
                maxLength={72}
                value={event.pix_description ?? ""}
                onChange={(e) =>
                  setEvent((p) =>
                    p ? { ...p, pix_description: e.target.value || null } : p,
                  )
                }
                disabled={isSaving}
              />
              <p className="mt-1 text-xs text-zinc-500">
                Aparece como identificação na transferência Pix.
              </p>
            </div>
          </div>
        </FormSection>

        {/* ── Ações ── */}
        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex min-w-[160px] cursor-pointer items-center justify-center gap-2 rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando…
              </>
            ) : (
              "Salvar alterações"
            )}
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => router.push(`/offc/events/${event.id}`)}
            className="cursor-pointer rounded-md border border-white/20 px-5 py-2.5 text-sm text-white transition hover:bg-white/10 disabled:opacity-60"
          >
            Voltar sem salvar
          </button>
        </div>
      </form>
    </main>
  );
}

/* ── Helpers de estilo ── */

const inputCls =
  "w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-white/30 focus:ring-1 focus:ring-white/20 disabled:opacity-50";

const selectCls =
  "w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-white/30 focus:ring-1 focus:ring-white/20 disabled:opacity-50";

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-1 block text-sm text-white/80">
      {children}
      {required && <span className="ml-1 text-red-400">*</span>}
    </label>
  );
}

function FormSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-zinc-400">{icon}</span>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
