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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, X } from "lucide-react";

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
  starts_at: z.coerce.date(),
  ends_at: z.coerce.date(),
  image_key: z.string()
});

type FormValues = z.infer<typeof formSchema>;

export default function EventCreateForm({
  onCreate,
}: {

  onCreate?: (payload: {
    // owner_department_id: string;
    visibility: "ORG" | "DEPARTMENT";
    status: "ATIVO" | "INATIVO";
    title: string;
    description: string;
    price: number;
    capacity: number;
    starts_at: string; // ISO
    ends_at: string; // ISO
    image_key: string
  }) => Promise<void> | void;
}) {
  const [startsAt, setStartsAt] = React.useState<Date | undefined>(undefined);
  const [endsAt, setEndsAt] = React.useState<Date | undefined>(undefined);
  const [regStartsAt, setRegStartsAt] = React.useState<Date | undefined>(undefined);
  const [regEndsAt, setRegEndsAt] = React.useState<Date | undefined>(undefined);

  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [imageKey, setImageKey] = React.useState<string | null>(null);
  const [imgWar, setImgWar] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const[cardOpen, setCardOpen] = React.useState<boolean>(false)
const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

// gera e limpa o object URL
React.useEffect(() => {
  if (!file) { setPreviewUrl(null); return; }
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
      starts_at: new Date(),
      ends_at: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  // Narrow/control typing to match shadcn FormField generics across RHF versions
  const control = form.control;

  async function handleSubmit(values: FormValues) {
    if (values.ends_at <= values.starts_at) {
      form.setError("ends_at", { type: "manual", message: "O término deve ser depois do início" });
      return;
    }
  
    const payload = {
      visibility: values.visibility,
      status: values.status,
      title: values.title,
      description: values.description,
      price: values.price,
      capacity: values.capacity,
      starts_at: values.starts_at.toISOString(),
      ends_at: values.ends_at.toISOString(),
      image_key: values.image_key
    };
  
    try {
      // 1) cria o evento e recebe o id
      const eventId = await (onCreate ? onCreate(payload) : Promise.resolve(undefined)) as unknown as string | undefined;
      if (!eventId) {
        console.warn("Evento criado via fallback (sem id retornado).");
      }
  
      // 2) se tiver arquivo, faz upload pro R2 e confirma no banco
      if (file) {
        setUploading(true);
        setProgress(0);
  
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
        if (!presignRes.ok) throw new Error("Falha ao gerar URL de upload");
        const { uploadUrl, key } = await presignRes.json();
  
        // 2.2 PUT direto no R2 com progresso
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", uploadUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) setProgress((e.loaded / e.total) * 100);
          };
          xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Upload failed")));
          xhr.onerror = () => reject(new Error("Upload error"));
          xhr.send(file);
        });
  
        // 2.3 confirma no Supabase
        const confirm = await fetch("/api/uploads/confirm-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId, imageKey: key }),
        });
        if (!confirm.ok) throw new Error("Falha ao confirmar imagem no banco");
  
        setImageKey(key);
        setUploading(false);
      }//////////
  
      form.reset();
      clearFile()
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
    setImgWar("")
  
    // 💡 valida tamanho
    // if (selected.size > 5 * 1024 * 1024) { // >5 MB
    //   alert("A imagem deve ter no máximo 5 MB");
    //   e.target.value = ""; // reseta o input
    //   return;
    // }
  
    // 💡 valida formato
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowed.includes(selected.type)) {
      setImgWar("Formato de imagem não suportado (use JPG, PNG, WEBP ou AVIF)");
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
  setImageKey(null);
  setProgress(0);
  setUploading(false);
  if (fileInputRef.current) {
    fileInputRef.current.value = ""; // limpa o nome do arquivo no input
  }
}

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card className="border-white/10 bg-gradient-to-b from-zinc-900/50 to-zinc-900/20 backdrop-blur">
      <button className="flex justify-between px-6 cursor-pointer items-center min-w-80 " onClick={()=>setCardOpen(!cardOpen)}>
      <CardTitle className="text-xl text-white">Criar evento</CardTitle>
      {!cardOpen ? <PlusIcon className="text-white"/> : <X className="text-white"/>}
      </button>
      {cardOpen && (
        <div>
        <CardHeader>
          
          <CardDescription className="text-zinc-200 text-md">
            Preencha as informações do evento. A capa é opcional e pode ser enviada depois.
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
                <h3 className="text-sm uppercase tracking-wide text-zinc-400">Informações gerais</h3>
                <div className="flex flex-col md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Título do evento" {...field} />
                        </FormControl>
                        <p className="text-xs text-zinc-400">Use um título claro e curto (ex.: “Workshop de Música”).</p>
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
                        <p className="text-xs text-zinc-400">Inclua o que o participante vai aprender, público-alvo e requisitos.</p>
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
                              <SelectItem value="DEPARTMENT">Interno</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-zinc-400">Público: visível a todos. Interno: apenas para membros do departamento.</p>
                          <FormMessage />
                          {/* <p className="text-xs text-muted-foreground">
                          owner_department_id mockado: {MOCK_DEPARTMENT_ID}
                        </p> */}
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
                              <SelectItem value="ATIVO">ATIVO</SelectItem>
                              <SelectItem value="INATIVO">INATIVO</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-zinc-400">“INATIVO” oculta o evento da listagem sem apagar dados.</p>
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
                <h3 className="text-sm uppercase tracking-wide text-zinc-400">Inscrições &amp; capacidade</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço (R$)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">R$</span>
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
                                  field.onChange(0); // mantém no form como 0, mas visualmente vazio
                                  return;
                                }
                                const num = Number(value);
                                field.onChange(Number.isNaN(num) ? 0 : num);
                              }}
                              onBlur={(e) => {
                                // garante que se o campo ficar vazio, volta pra 0
                                if (e.target.value === "") {
                                  e.target.value = "0";
                                  field.onChange(0);
                                }
                              }}
                            />
                          </div>
                        </FormControl>
                        <p className="text-xs text-zinc-400">Use 0 para evento gratuito.</p>
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
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <p className="text-xs text-zinc-400">Número máximo de participantes.</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="my-2 bg-white/10" />

              {/* Datas */}
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-wide text-zinc-400">Datas</h3>
                {/* datas: simples com <input type="datetime-local"> */}
                <div className="flex flex-col">
                  <h1 className="font-mono text-sky-200">Data do Evento</h1>
                  <div className="flex-row flex gap-4 px-2">
                    <DateTimePicker
                      labelTitle="Inicio"
                      value={startsAt}
                      onChange={setStartsAt}
                      showSeconds={true}
                    />

                    <DateTimePicker
                      labelTitle="Fim"
                      value={endsAt}
                      onChange={setEndsAt}
                      showSeconds={true}
                    />
                  </div>
                </div>
                <div className="flex flex-col border-t pt-2 border-zinc-400">
                  <h1 className="font-mono text-amber-200">Data das Inscrições</h1>
                  <div className="flex-row flex gap-4 px-2">
                    <DateTimePicker
                      labelTitle="Inicio"
                      value={regStartsAt}
                      onChange={setRegStartsAt}
                      showSeconds={true}
                    />

                    <DateTimePicker
                      labelTitle="Fim"
                      value={regEndsAt}
                      onChange={setRegEndsAt}
                      showSeconds={true}
                    />
                  </div>
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
                    {/* Next/Image funciona também, mas pra Object URL é mais simples usar &lt;img&gt; */}
                    <img
                      src={previewUrl}
                      alt="Pré-visualização"
                      className="max-h-56 rounded border border-white/10"
                    />

                  </div>
                )}
                {imgWar ? <p className="text-red-400">{imgWar}</p> : null }
                <p className="text-xs text-zinc-400">Formatos aceitos: JPG, PNG, WEBP ou AVIF. Tamanho recomendado 1600×900.</p>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" className="cursor-pointer" disabled={uploading}>
                  {uploading ? "Enviando..." : "Criar evento"}
                </Button>
                <Button type="button" variant="secondary" onClick={() => {form.reset(); clearFile();}
                } disabled={uploading}>
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
