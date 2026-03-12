"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "./DatePic";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  PlusIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CalendarDays,
  Users,
  ImageIcon,
  ClipboardList,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";

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
  church: RegistrationFieldConfig;
  how_heard: RegistrationFieldConfig;
  isBeliever: RegistrationFieldConfig;
  email: RegistrationFieldConfig;
};

export type EventCreatePayload = {
  visibility: "ORG" | "DEPARTMENT";
  status: "ATIVO" | "DESATIVADO";
  title: string;
  description: string;
  price: number;
  capacity: number;
  starts_at: string;
  ends_at: string;
  registration_starts_at: string | null;
  registration_ends_at: string | null;
  address: string | null;
  registration_fields: RegistrationFields;
  image_key: string | null;
  payment_note: string | null;
};

type FeedbackState =
  | { type: "idle" }
  | { type: "submitting"; phase: "creating" | "uploading" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const MAX_FILE_SIZE_MB = 8;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const registrationFieldConfigSchema = z.object({
  enabled: z.boolean(),
  required: z.boolean(),
});

const registrationFieldsSchema = z.object({
  name: registrationFieldConfigSchema,
  cpf: registrationFieldConfigSchema,
  number: registrationFieldConfigSchema,
  camisa: registrationFieldConfigSchema,
  isMember: registrationFieldConfigSchema,
  idade: registrationFieldConfigSchema,
  church: registrationFieldConfigSchema,
  how_heard: registrationFieldConfigSchema,
  isBeliever: registrationFieldConfigSchema,
  email: registrationFieldConfigSchema,
});

const formSchema = z
  .object({
    title: z.string().min(1, "Título obrigatório"),
    description: z.string().min(1, "Descrição obrigatória"),
    visibility: z.enum(["ORG", "DEPARTMENT"]),
    status: z.enum(["ATIVO", "DESATIVADO"]),
    price: z
      .union([z.coerce.number(), z.literal("")])
      .transform((v) => (v === "" ? 0 : v))
      .pipe(z.number().min(0, "Preço não pode ser negativo")),
    capacity: z.coerce.number().int().min(1, "Capacidade mínima é 1"),
    starts_at: z.date(),
    ends_at: z.date(),
    registrations_starts_at: z.date().nullable().optional(),
    registrations_ends_at: z.date().nullable().optional(),
    address: z.string().max(255).optional().nullable(),
    image_key: z.string().optional().default(""),
    registration_fields: registrationFieldsSchema,
    payment_note: z.string().max(1000).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.ends_at <= data.starts_at) {
      ctx.addIssue({
        code: "custom",
        message: "O término deve ser depois do início",
        path: ["ends_at"],
      });
    }

    if (data.registrations_starts_at && data.registrations_ends_at) {
      if (data.registrations_ends_at <= data.registrations_starts_at) {
        ctx.addIssue({
          code: "custom",
          message: "O fim das inscrições deve ser depois do início",
          path: ["registrations_ends_at"],
        });
      }
    }

    if (!data.registrations_starts_at && data.registrations_ends_at) {
      ctx.addIssue({
        code: "custom",
        message: "Defina também o início das inscrições",
        path: ["registrations_ends_at"],
      });
    }

    if (data.registrations_starts_at && !data.registrations_ends_at) {
      ctx.addIssue({
        code: "custom",
        message: "Defina também o fim das inscrições",
        path: ["registrations_starts_at"],
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

type RegistrationFieldKey = keyof RegistrationFields;
const registrationFieldList: { key: RegistrationFieldKey; label: string }[] = [
  { key: "name", label: "Nome completo" },
  { key: "cpf", label: "CPF" },
  { key: "number", label: "Telefone / WhatsApp" },
  { key: "camisa", label: "Tamanho da camisa" },
  { key: "isMember", label: "É membro da igreja?" },
  { key: "email", label: "E-mail" },
  { key: "idade", label: "Idade" },
  { key: "church", label: "Qual sua igreja?" },
  { key: "how_heard", label: "Como soube desse evento?" },
  { key: "isBeliever", label: "Já aceitou Jesus?" },
];

function freshDefaults(): FormValues {
  return {
    title: "",
    description: "",
    visibility: "ORG",
    status: "ATIVO",
    price: 0,
    capacity: 50,
    image_key: "",
    address: "",
    payment_note: "",
    starts_at: new Date(),
    ends_at: new Date(Date.now() + 60 * 60 * 1000),
    registrations_starts_at: null,
    registrations_ends_at: null,
    registration_fields: {
      name: { enabled: true, required: true },
      cpf: { enabled: false, required: false },
      number: { enabled: false, required: false },
      camisa: { enabled: false, required: false },
      isMember: { enabled: false, required: false },
      idade: { enabled: false, required: false },
      email: { enabled: false, required: false },
      church: { enabled: false, required: false },
      how_heard: { enabled: false, required: false },
      isBeliever: { enabled: false, required: false },
    },
  };
}

export default function EventCreateForm({
  onCreate,
}: {
  onCreate?: (
    payload: EventCreatePayload
  ) => Promise<string | void> | string | void;
}) {
  const [feedback, setFeedback] = React.useState<FeedbackState>({
    type: "idle",
  });
  const [imgWar, setImgWar] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [cardOpen, setCardOpen] = React.useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const isSubmitting = feedback.type === "submitting";

  React.useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: freshDefaults(),
  });

  const control = form.control;
  const watchedFields = form.watch("registration_fields");

  function clearFile() {
    setFile(null);
    setPreviewUrl(null);
    setImgWar(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(values: FormValues) {
    setFeedback({ type: "submitting", phase: "creating" });

    const payload: EventCreatePayload = {
      visibility: values.visibility,
      status: values.status,
      title: values.title,
      description: values.description,
      price: values.price,
      capacity: values.capacity,
      starts_at: values.starts_at.toISOString(),
      ends_at: values.ends_at.toISOString(),
      registration_starts_at: values.registrations_starts_at
      ? values.registrations_starts_at.toISOString()
      : null,
    registration_ends_at: values.registrations_ends_at
      ? values.registrations_ends_at.toISOString()
      : null,
      address: values.address || null,
      registration_fields: values.registration_fields,
      image_key: values.image_key || null,
      payment_note:
        values.payment_note && values.payment_note.trim() !== ""
          ? values.payment_note.trim()
          : null,
    };

    try {
      const eventId = (await (onCreate
        ? onCreate(payload)
        : Promise.resolve(undefined))) as string | undefined;

      if (file) {
        setFeedback({ type: "submitting", phase: "uploading" });

        const presignRes = await fetch("/api/uploads/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId,
            filename: file.name,
            contentType: file.type,
          }),
        });

        if (!presignRes.ok) {
          const body = await presignRes.json().catch(() => ({}));
          throw new Error(body?.error ?? "Falha ao gerar URL de upload");
        }

        const { uploadUrl, key } = (await presignRes.json()) as {
          uploadUrl: string;
          key: string;
        };

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", uploadUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.onload = () =>
            xhr.status >= 200 && xhr.status < 300
              ? resolve()
              : reject(new Error("Upload falhou"));
          xhr.onerror = () => reject(new Error("Erro de rede no upload"));
          xhr.send(file);
        });

        const confirm = await fetch("/api/uploads/confirm-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId, fileKey: key, type: "image" }),
        });

        if (!confirm.ok) {
          const body = await confirm.json().catch(() => ({}));
          throw new Error(body?.error ?? "Falha ao confirmar imagem no banco");
        }
      }

      form.reset(freshDefaults());
      clearFile();
      setFeedback({
        type: "success",
        message: "Evento criado com sucesso!",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro desconhecido ao criar evento";
      console.error("[EventCreateForm] handleSubmit error:", err);
      setFeedback({ type: "error", message });
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setImgWar(null);

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowed.includes(selected.type)) {
      setImgWar("Formato não suportado. Use JPG, PNG, WEBP ou AVIF.");
      e.target.value = "";
      return;
    }

    if (selected.size > MAX_FILE_SIZE_BYTES) {
      setImgWar(`Imagem muito grande. Máximo permitido: ${MAX_FILE_SIZE_MB} MB.`);
      e.target.value = "";
      return;
    }

    setFile(selected);
  }

  const submittingLabel =
    feedback.type === "submitting"
      ? feedback.phase === "uploading"
        ? "Enviando imagem…"
        : "Criando evento…"
      : null;

  return (
    <div className="w-full">
      {/* Toggle header */}
      <div className="rounded-xl border border-white/10 bg-zinc-900/30 backdrop-blur overflow-hidden">
        <button
          type="button"
          onClick={() => {
            setCardOpen((v) => !v);
            if (feedback.type !== "idle") setFeedback({ type: "idle" });
          }}
          className="flex w-full items-center justify-between gap-3 px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20">
              <PlusIcon className="h-4 w-4 text-sky-400" />
            </div>
            <CardTitle className="text-base font-semibold text-white">
              Criar novo evento
            </CardTitle>
          </div>
          {cardOpen ? (
            <ChevronUp className="h-4 w-4 text-zinc-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-zinc-400" />
          )}
        </button>

        {/* Feedback banner — success */}
        {feedback.type === "success" && (
          <div className="mx-5 mb-4 flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-300">
                {feedback.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFeedback({ type: "idle" })}
              className="cursor-pointer text-emerald-400/60 hover:text-emerald-400 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Feedback banner — error */}
        {feedback.type === "error" && (
          <div className="mx-5 mb-4 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-300">
                {feedback.message}
              </p>
              <p className="mt-0.5 text-xs text-red-400/70">
                Verifique os dados e tente novamente.
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

        {cardOpen && (
          <div>
            <CardHeader className="px-5 pt-0 pb-2">
              <CardDescription className="text-zinc-400 text-sm">
                Preencha as informações abaixo. A capa é opcional e pode ser
                enviada depois.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-5 pb-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-8 text-white"
                >
                  {/* ── Seção 1: Informações gerais ── */}
                  <section className="space-y-5">
                    <SectionHeading icon={<ClipboardList className="h-4 w-4" />} label="Informações gerais" />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex.: Workshop de Música" {...field} />
                            </FormControl>
                            <p className="text-xs text-zinc-500">
                              Use um título claro e curto.
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Conte sobre o evento, público-alvo e o que o participante vai encontrar…"
                                className="min-h-[100px] resize-y"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>
                              Endereço{" "}
                              <span className="text-zinc-500 font-normal">
                                (opcional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Rua, número, bairro — cidade/UF"
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                              />
                            </FormControl>
                            <p className="text-xs text-zinc-500">
                              Será exibido na página do evento.
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="visibility"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Visibilidade</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ORG">
                                  Público — visível a todos
                                </SelectItem>
                                <SelectItem value="DEPARTMENT">
                                  Interno — apenas líderes
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ATIVO">
                                  Ativo — visível na listagem
                                </SelectItem>
                                <SelectItem value="DESATIVADO">
                                  Desativado — oculto sem apagar dados
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

                  <Separator className="bg-white/10" />

                  {/* ── Seção 2: Inscrições e capacidade ── */}
                  <section className="space-y-5">
                    <SectionHeading icon={<Users className="h-4 w-4" />} label="Inscrições & capacidade" />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preço</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-zinc-400">
                                  R$
                                </span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min={0}
                                  placeholder="0,00"
                                  className="pl-9"
                                  {...field}
                                  value={field.value === 0 ? "" : field.value}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "") {
                                      field.onChange(0);
                                      return;
                                    }
                                    const num = Number(val);
                                    field.onChange(Number.isNaN(num) ? 0 : num);
                                  }}
                                  onBlur={(e) => {
                                    if (e.target.value === "") {
                                      field.onChange(0);
                                    }
                                  }}
                                />
                              </div>
                            </FormControl>
                            <p className="text-xs text-zinc-500">
                              Deixe 0 para evento gratuito.
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="capacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Capacidade</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                placeholder="Ex.: 100"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(e.target.valueAsNumber)
                                }
                              />
                            </FormControl>
                            <p className="text-xs text-zinc-500">
                              Número máximo de participantes.
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="payment_note"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>
                              Instruções de pagamento{" "}
                              <span className="text-zinc-500 font-normal">
                                (opcional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={`Ex.: Membros pagam metade. Crianças até 12 anos não pagam.\nApresente o comprovante no dia do evento.`}
                                className="min-h-[80px] resize-y"
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                            <p className="text-xs text-zinc-500">
                              Aparecerá na tela de confirmação de inscrição.
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

                  <Separator className="bg-white/10" />

                  {/* ── Seção 3: Datas ── */}
                  <section className="space-y-5">
                    <SectionHeading icon={<CalendarDays className="h-4 w-4" />} label="Datas" />

                    <div className="space-y-4">
                      <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-sky-400">
                          Data do evento
                        </p>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            control={control}
                            name="starts_at"
                            render={({ field }) => (
                              <FormItem className="w-full min-w-0">
                                <FormLabel>Início</FormLabel>
                                <FormControl>
                                  <DateTimePicker
                                    labelTitle="Início"
                                    value={field.value ?? undefined}
                                    onChange={(date) =>
                                      field.onChange(date ?? new Date())
                                    }
                                    showSeconds={false}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={control}
                            name="ends_at"
                            render={({ field }) => (
                              <FormItem className="w-full min-w-0">
                                <FormLabel>Fim</FormLabel>
                                <FormControl>
                                  <DateTimePicker
                                    labelTitle="Fim"
                                    value={field.value ?? undefined}
                                    onChange={(date) =>
                                      field.onChange(date ?? new Date())
                                    }
                                    showSeconds={false}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">
                            Período de inscrições
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            Opcional. Deixe em branco para inscrições sempre
                            abertas.
                          </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            control={control}
                            name="registrations_starts_at"
                            render={({ field }) => (
                              <FormItem className="w-full min-w-0">
                                <FormLabel>Início</FormLabel>
                                <FormControl>
                                  <DateTimePicker
                                    labelTitle="Início"
                                    value={field.value ?? undefined}
                                    onChange={(date) =>
                                      field.onChange(date ?? null)
                                    }
                                    showSeconds={false}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={control}
                            name="registrations_ends_at"
                            render={({ field }) => (
                              <FormItem className="w-full min-w-0">
                                <FormLabel>Fim</FormLabel>
                                <FormControl>
                                  <DateTimePicker
                                    labelTitle="Fim"
                                    value={field.value ?? undefined}
                                    onChange={(date) =>
                                      field.onChange(date ?? null)
                                    }
                                    showSeconds={false}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  <Separator className="bg-white/10" />

                  {/* ── Seção 4: Campos do formulário de inscrição ── */}
                  <section className="space-y-4">
                    <div>
                      <SectionHeading icon={<ClipboardList className="h-4 w-4" />} label="Campos do formulário de inscrição" />
                      <p className="mt-1 text-xs text-zinc-500">
                        Escolha quais informações serão coletadas dos
                        participantes.
                      </p>
                    </div>

                    <div className="space-y-2">
                      {/* Header row */}
                      <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto] items-center gap-4 px-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        <span>Campo</span>
                        <span className="w-16 text-center">Incluir</span>
                        <span className="w-20 text-center">Obrigatório</span>
                      </div>

                      {registrationFieldList.map((cfg) => {
                        const isEnabled =
                          watchedFields?.[cfg.key]?.enabled ?? false;

                        return (
                          <div
                            key={cfg.key}
                            className={`grid grid-cols-1 gap-3 rounded-xl border px-4 py-3 transition-colors sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-4 ${
                              isEnabled
                                ? "border-white/15 bg-white/5"
                                : "border-white/5 bg-white/2"
                            }`}
                          >
                            <p
                              className={`text-sm font-medium transition-colors ${
                                isEnabled ? "text-white" : "text-zinc-500"
                              }`}
                            >
                              {cfg.label}
                            </p>

                            <div className="flex items-center justify-between sm:block">
                              <span className="text-xs text-zinc-500 sm:hidden">
                                Incluir
                              </span>
                              <FormField
                                control={control}
                                name={`registration_fields.${cfg.key}.enabled`}
                                render={({ field }) => (
                                  <FormItem className="flex items-center justify-center sm:w-16">
                                    <FormControl>
                                      <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-sky-500"
                                        checked={field.value}
                                        onChange={(e) => {
                                          field.onChange(e.target.checked);
                                          if (!e.target.checked) {
                                            form.setValue(
                                              `registration_fields.${cfg.key}.required`,
                                              false
                                            );
                                          }
                                        }}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="flex items-center justify-between sm:block">
                              <span className="text-xs text-zinc-500 sm:hidden">
                                Obrigatório
                              </span>
                              <FormField
                                control={control}
                                name={`registration_fields.${cfg.key}.required`}
                                render={({ field }) => (
                                  <FormItem className="flex items-center justify-center sm:w-20">
                                    <FormControl>
                                      <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
                                        checked={field.value}
                                        disabled={!isEnabled}
                                        onChange={(e) =>
                                          field.onChange(e.target.checked)
                                        }
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  <Separator className="bg-white/10" />

                  {/* ── Seção 5: Capa ── */}
                  <section className="space-y-3">
                    <SectionHeading icon={<ImageIcon className="h-4 w-4" />} label="Capa do evento" />

                    <div className="space-y-3">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        onChange={handleFileSelect}
                        disabled={isSubmitting}
                        className="cursor-pointer hover:bg-white/5 text-white disabled:opacity-50"
                      />

                      {imgWar && (
                        <div className="flex items-center gap-2 text-sm text-red-400">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{imgWar}</span>
                        </div>
                      )}

                      {previewUrl && (
                        <div className="relative">
                          <Image
                            src={previewUrl}
                            alt="Pré-visualização da capa"
                            className="max-h-48 w-full rounded-lg border border-white/10 object-cover"
                            width={800}
                            height={450}
                          />
                          <button
                            type="button"
                            onClick={clearFile}
                            className="absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}

                      <p className="text-xs text-zinc-500">
                        Opcional · Formatos: JPG, PNG, WEBP, AVIF · Máximo:{" "}
                        {MAX_FILE_SIZE_MB} MB · Tamanho recomendado: 1600×900
                      </p>
                    </div>
                  </section>

                  {/* ── Ações ── */}
                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                    <Button
                      type="submit"
                      className="cursor-pointer min-w-[140px]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {submittingLabel}
                        </span>
                      ) : (
                        "Criar evento"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={isSubmitting}
                      onClick={() => {
                        form.reset(freshDefaults());
                        clearFile();
                        setFeedback({ type: "idle" });
                      }}
                      className="cursor-pointer"
                    >
                      Limpar
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeading({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-zinc-400">{icon}</span>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
        {label}
      </h3>
    </div>
  );
}
