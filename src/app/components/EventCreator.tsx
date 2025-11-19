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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, X } from "lucide-react";
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
};

export type EventCreatePayload = {
  visibility: "ORG" | "DEPARTMENT";
  status: "ATIVO" | "INATIVO";
  title: string;
  description: string;
  price: number;
  capacity: number;
  starts_at: string; // ISO
  ends_at: string; // ISO
  registrations_starts_at: string | null; // ISO ou null
  registrations_ends_at: string | null; // ISO ou null
  address: string | null;
  registration_fields: RegistrationFields;
  image_key: string | null;
};

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
});

// lista para montar a UI
type RegistrationFieldKey = keyof RegistrationFields;
const registrationFieldList: { key: RegistrationFieldKey; label: string }[] = [
  { key: "name", label: "Nome completo" },
  { key: "cpf", label: "CPF" },
  { key: "number", label: "Telefone / WhatsApp" },
  { key: "camisa", label: "Tamanho da camisa" },
  { key: "isMember", label: "É membro da igreja?" },
  { key: "idade", label: "Idade" },
];

// ---- schema ----------------------------------------------------
const formSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  description: z.string().min(1, "Descrição obrigatória"),
  visibility: z.enum(["ORG", "DEPARTMENT"]),
  status: z.enum(["ATIVO", "INATIVO"]),
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
});

type FormValues = z.infer<typeof formSchema>;

export default function EventCreateForm({
  onCreate,
}: {
  onCreate?: (
    payload: EventCreatePayload
  ) => Promise<string | void> | string | void;
}) {
  const [uploading, setUploading] = React.useState(false);
  const [imgWar, setImgWar] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [cardOpen, setCardOpen] = React.useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  // gera e limpa o object URL
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
    defaultValues: {
      title: "",
      description: "",
      visibility: "ORG",
      status: "ATIVO",
      price: 0,
      capacity: 50,
      image_key: "",
      address: "",
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
      },
    },
  });

  // Narrow/control typing to match shadcn FormField generics across RHF versions
  const control = form.control;

  async function handleSubmit(values: FormValues) {
    if (values.ends_at <= values.starts_at) {
      form.setError("ends_at", {
        type: "manual",
        message: "O término deve ser depois do início",
      });
      return;
    }

    const payload: EventCreatePayload = {
      visibility: values.visibility,
      status: values.status,
      title: values.title,
      description: values.description,
      price: values.price,
      capacity: values.capacity,
      starts_at: values.starts_at.toISOString(),
      ends_at: values.ends_at.toISOString(),
      registrations_starts_at: values.registrations_starts_at
        ? values.registrations_starts_at.toISOString()
        : null,
      registrations_ends_at: values.registrations_ends_at
        ? values.registrations_ends_at.toISOString()
        : null,
      address: values.address || null,
      registration_fields: values.registration_fields,
      image_key: values.image_key || null,
    };

    try {
      // 1) cria o evento e recebe o id
      const eventId = (await (onCreate
        ? onCreate(payload)
        : Promise.resolve(undefined))) as string | undefined;

      if (!eventId) {
        console.warn("Evento criado via fallback (sem id retornado).");
      }

      // 2) se tiver arquivo, faz upload pro R2 e confirma no banco
      if (file) {
        setUploading(true);

        // 2.1 presign
        const presignRes = await fetch("/api/uploads/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId,
            filename: file.name,
            contentType: file.type,
          }),
        });
        if (!presignRes.ok)
          throw new Error("Falha ao gerar URL de upload");
        const { uploadUrl, key } = await presignRes.json();

        // 2.2 PUT direto no R2 com progresso
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", uploadUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.onload = () =>
            xhr.status >= 200 && xhr.status < 300
              ? resolve()
              : reject(new Error("Upload failed"));
          xhr.onerror = () => reject(new Error("Upload error"));
          xhr.send(file);
        });

        // 2.3 confirma no Supabase
        const confirm = await fetch("/api/uploads/confirm-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId,
            fileKey: key,
            type: "image",
          }),
        });
        if (!confirm.ok)
          throw new Error("Falha ao confirmar imagem no banco");

        setUploading(false);
      }

      form.reset();
      clearFile();
      alert("Evento criado!");
    } catch (err) {
      console.error(err);
      setUploading(false);
      alert("Erro ao criar evento.");
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setImgWar("");

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowed.includes(selected.type)) {
      setImgWar(
        "Formato de imagem não suportado (use JPG, PNG, WEBP ou AVIF)"
      );
      e.target.value = "";
      return;
    }

    setFile(selected);
  }

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  function clearFile() {
    setFile(null);
    setPreviewUrl(null);
    setImgWar(null);
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // limpa o nome do arquivo no input
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card className="border-white/10 bg-gradient-to-b from-zinc-900/50 to-zinc-900/20 backdrop-blur">
        <button
          className="flex justify-between px-6 cursor-pointer items-center min-w-80"
          type="button"
          onClick={() => setCardOpen(!cardOpen)}
        >
          <CardTitle className="text-xl text-white">Criar evento</CardTitle>
          {!cardOpen ? (
            <PlusIcon className="text-white" />
          ) : (
            <X className="text-white" />
          )}
        </button>
        {cardOpen && (
          <div>
            <CardHeader>
              <CardDescription className="text-zinc-200 text-md">
                Preencha as informações do evento. A capa é opcional e pode ser
                enviada depois.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-8 text-white"
                >
                  {/* Informações gerais */}
                  <div className="space-y-6">
                    <h3 className="text-sm uppercase tracking-wide text-zinc-400">
                      Informações gerais
                    </h3>
                    <div className="flex flex-col md:grid-cols-2 gap-4">
                      <FormField
                        control={control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Título do evento"
                                {...field}
                              />
                            </FormControl>
                            <p className="text-xs text-zinc-400">
                              Use um título claro e curto (ex.: “Workshop de
                              Música”).
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Conte sobre o evento…"
                                className="min-h-[100px] resize-y"
                                {...field}
                              />
                            </FormControl>
                            <p className="text-xs text-zinc-400">
                              Inclua o que o participante vai aprender,
                              público-alvo e requisitos.
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Endereço */}
                      <FormField
                        control={control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Endereço (opcional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Rua, número, bairro - cidade/UF"
                                // garante que nunca é null/undefined pro input
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                              />
                            </FormControl>
                            <p className="text-xs text-zinc-400">
                              Esse endereço será exibido na página do evento.
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                  <SelectItem value="ORG">Público</SelectItem>
                                  <SelectItem value="DEPARTMENT">
                                    Interno
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-zinc-400">
                                Público: visível a todos. Interno: apenas para
                                membros do departamento.
                              </p>
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
                                    ATIVO
                                  </SelectItem>
                                  <SelectItem value="INATIVO">
                                    INATIVO
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-zinc-400">
                                “INATIVO” oculta o evento da listagem sem apagar
                                dados.
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="my-2 bg-white/10" />

                  {/* Inscrições e capacidade */}
                  <div className="space-y-6">
                    <h3 className="text-sm uppercase tracking-wide text-zinc-400">
                      Inscrições &amp; capacidade
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preço (R$)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                                  R$
                                </span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min={0}
                                  placeholder="0,00"
                                  className="pl-8"
                                  {...field}
                                  value={field.value === 0 ? "" : field.value}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === "") {
                                      field.onChange(0);
                                      return;
                                    }
                                    const num = Number(value);
                                    field.onChange(
                                      Number.isNaN(num) ? 0 : num
                                    );
                                  }}
                                  onBlur={(e) => {
                                    if (e.target.value === "") {
                                      e.target.value = "0";
                                      field.onChange(0);
                                    }
                                  }}
                                />
                              </div>
                            </FormControl>
                            <p className="text-xs text-zinc-400">
                              Use 0 para evento gratuito.
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
                                placeholder="ex. 100"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(e.target.valueAsNumber)
                                }
                              />
                            </FormControl>
                            <p className="text-xs text-zinc-400">
                              Número máximo de participantes.
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator className="my-2 bg-white/10" />

                  {/* Datas */}
                  <div className="space-y-4">
                    <h3 className="text-sm uppercase tracking-wide text-zinc-400">
                      Datas
                    </h3>

                    <div className="flex flex-col">
                      <h1 className="font-mono text-sky-200">
                        Data do Evento
                      </h1>
                      <div className="flex-row flex gap-4 px-2">
                        <FormField
                          control={control}
                          name="starts_at"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Início</FormLabel>
                              <FormControl>
                                <DateTimePicker
                                  labelTitle="Início"
                                  value={field.value ?? undefined}
                                  onChange={(date) =>
                                    field.onChange(date ?? new Date())
                                  }
                                  showSeconds={true}
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
                            <FormItem>
                              <FormLabel>Fim</FormLabel>
                              <FormControl>
                                <DateTimePicker
                                  labelTitle="Fim"
                                  value={field.value ?? undefined}
                                  onChange={(date) =>
                                    field.onChange(date ?? new Date())
                                  }
                                  showSeconds={true}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col border-t pt-2 border-zinc-400">
                      <h1 className="font-mono text-amber-200">
                        Data das Inscrições
                      </h1>
                      <div className="flex-row flex gap-4 px-2">
                        <FormField
                          control={control}
                          name="registrations_starts_at"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Início</FormLabel>
                              <FormControl>
                                <DateTimePicker
                                  labelTitle="Início"
                                  value={field.value ?? undefined}
                                  onChange={(date) =>
                                    field.onChange(date ?? null)
                                  }
                                  showSeconds={true}
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
                            <FormItem>
                              <FormLabel>Fim</FormLabel>
                              <FormControl>
                                <DateTimePicker
                                  labelTitle="Fim"
                                  value={field.value ?? undefined}
                                  onChange={(date) =>
                                    field.onChange(date ?? null)
                                  }
                                  showSeconds={true}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="my-2 bg-white/10" />

                  {/* Campos de inscrição */}
                  <div className="space-y-4">
                    <h3 className="text-sm uppercase tracking-wide text-zinc-400">
                      Campos do formulário de inscrição
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Escolha quais campos aparecerão e quais serão
                      obrigatórios.
                    </p>

                    <div className="space-y-2">
                      {registrationFieldList.map((cfg) => (
                        <div
                          key={cfg.key}
                          className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2"
                        >
                          <div>
                            <p className="text-sm font-medium text-white">
                              {cfg.label}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-zinc-300">
                            {/* habilitado */}
                            <FormField
                              control={control}
                              name={
                                `registration_fields.${cfg.key}.enabled`
                              }
                              render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                  <FormControl>
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 cursor-pointer"
                                      checked={field.value}
                                      onChange={(e) =>
                                        field.onChange(e.target.checked)
                                      }
                                    />
                                  </FormControl>
                                  <span>Incluir</span>
                                </FormItem>
                              )}
                            />

                            {/* obrigatório */}
                            <FormField
                              control={control}
                              name={
                                `registration_fields.${cfg.key}.required`
                              }
                              render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                  <FormControl>
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 cursor-pointer"
                                      checked={field.value}
                                      onChange={(e) =>
                                        field.onChange(e.target.checked)
                                      }
                                    />
                                  </FormControl>
                                  <span>Obrigatório</span>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-2 bg-white/10" />

                  {/* Capa */}
                  <div className="space-y-2">
                    <FormLabel>Capa do evento (opcional)</FormLabel>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="cursor-pointer items-center justify-center hover:bg-white text-white"
                    />

                    {previewUrl && (
                      <div className="mt-2">
                        <Image
                          src={previewUrl}
                          alt="Pré-visualização"
                          className="max-h-56 rounded border border-white/10"
                          width={800}
                          height={450}
                        />
                      </div>
                    )}
                    {imgWar ? (
                      <p className="text-red-400">{imgWar}</p>
                    ) : null}
                    <p className="text-xs text-zinc-400">
                      Formatos aceitos: JPG, PNG, WEBP ou AVIF. Tamanho
                      recomendado 1600×900.
                    </p>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      type="submit"
                      className="cursor-pointer"
                      disabled={uploading}
                    >
                      {uploading ? "Enviando..." : "Criar evento"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        form.reset();
                        clearFile();
                      }}
                      disabled={uploading}
                    >
                      Limpar
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </div>
        )}
      </Card>
    </div>
  );
}