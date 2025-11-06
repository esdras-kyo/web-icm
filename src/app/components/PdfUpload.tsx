"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlusIcon, X } from "lucide-react";

type Visibility = "ORG" | "DEPARTMENT";

export function PdfUploader({
  presignEndpoint = "/api/uploads/presign",
  confirmEndpoint = "/api/uploads/confirm-upload",
  maxSizeMB = 50,
  onUploaded,
}: {
  presignEndpoint?: string;
  confirmEndpoint?: string;
  maxSizeMB?: number;
  onUploaded?: (payload: { fileKey: string; title: string; visibility: Visibility; publicUrl: string }) => void;
}) {
  const [file, setFile] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState("");
  const [visibility, setVisibility] = React.useState<Visibility>("ORG");
  const [error, setError] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [fileKey, setFileKey] = React.useState<string | null>(null);
  const[cardOpen, setCardOpen] = React.useState<boolean>(false)
  const [messajo, setMessage] = React.useState<string | null>(null);

  const fileRef = React.useRef<HTMLInputElement | null>(null);

  const WORKER_BASE = "https://worker-1.esdrascamel.workers.dev"; // troque pelo seu domínio custom quando tiver

  function resetAll() {
    setMessage("")
    setFile(null);
    setTitle("");
    setVisibility("ORG");
    setError(null);
    setProgress(0);
    setUploading(false);
    setFileKey(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const k = 1024, sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    setError(null);
    setFileKey(null);
    setMessage("")
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      setError("Envie apenas arquivos PDF (.pdf).");
      e.target.value = "";
      return;
    }
    if (selected.size > maxSizeMB * 1024 * 1024) {
      setError(`O PDF deve ter no máximo ${maxSizeMB} MB.`);
      e.target.value = "";
      return;
    }
    setFile(selected);
    if (!title) {
      // sugere um título inicial com o nome do arquivo (sem .pdf)
      const base = selected.name.replace(/\.pdf$/i, "");
      setTitle(base);
    }
  }

  async function handleUpload() {
    try {
      setError(null);
      if (!file) {
        setError("Selecione um PDF.");
        return;
      }
      if (!title.trim()) {
        setError("Informe um título para o PDF.");
        return;
      }

      setUploading(true);
      setProgress(0);

      // 1) presign
      const presignRes = await fetch(presignEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // eventId não é necessário para pdfs globais
          filename: file.name,
          contentType: file.type, // "application/pdf"
          title: title.trim(),
        }),
      });
      if (!presignRes.ok) {
        setUploading(false);
        setError("Falha ao gerar URL de upload.");
        return;
      }
      const { uploadUrl, key } = await presignRes.json();

      // 2) PUT direto no R2 (com barra de progresso)
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress((e.loaded / e.total) * 100);
        };
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Upload failed"));
        xhr.onerror = () => reject(new Error("Upload error"));
        xhr.send(file);
      });

      // 3) confirmar no backend (salvar na tabela event_files)
      const confirmRes = await fetch(confirmEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visibility,
          fileKey: key,
          title: title.trim(),
          type: "pdf",
        }),
      });
      if (!confirmRes.ok) {
        setUploading(false);
        setError("Upload feito, mas falhou ao confirmar no banco.");
        return;
      }

      setFileKey(key);
      resetAll()
      
      setUploading(false);

      const publicUrl = `${WORKER_BASE}/${encodeURIComponent(key)}`;
      onUploaded?.({ fileKey: key, title: title.trim(), visibility, publicUrl });
      setMessage("Sucesso")
    } catch (e) {
      console.error(e);
      setUploading(false);
      setError("Erro inesperado ao enviar o PDF.");
      setMessage("Erro")
    }
  }

  return (
    <div className="w-full  space-y-4 rounded-lg border text-white border-white/10 p-4  bg-gradient-to-b from-zinc-900/50 to-zinc-900/20 backdrop-blur">

      <button className="flex justify-between  cursor-pointer items-center min-w-full " onClick={()=>setCardOpen(!cardOpen)}>
      <h1 className="text-white text-2xl">Adicionar arquivo</h1>
      {!cardOpen ? <PlusIcon className="text-white"/> : <X className="text-white"/>}
      </button>

      {cardOpen &&(  
      <div className="grid gap-3">
        <div className="grid gap-1.5">

          <Label htmlFor="pdf-title">Título do PDF</Label>
          <Input
            id="pdf-title"
            placeholder="Ex.: Regulamento do Evento"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={uploading}
          />
        </div>

        <div className="grid gap-1.5">
          <Label>Visibilidade</Label>
          <Select
            value={visibility}
            onValueChange={(v) => setVisibility(v as Visibility)}
            disabled={uploading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ORG">Público</SelectItem>
              <SelectItem value="DEPARTMENT">Interno</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="pdf-file">Arquivo PDF</Label>
          <Input
            ref={fileRef}
            id="pdf-file"
            type="file"
            accept="application/pdf"
            onChange={handleFileSelect}
            disabled={uploading}
            className="cursor-pointer hover:bg-white"
          />
          <p className="text-xs text-zinc-400">Apenas PDF. Tamanho máximo: {maxSizeMB} MB.</p>

          {file && (
            <div className="text-sm text-zinc-300">
              <span className="font-medium">Selecionado:</span>{" "}
              {file.name} <span className="text-zinc-400">({formatBytes(file.size)})</span>
            </div>
          )}
        </div>

        {uploading && (
          <div className="h-2 w-full rounded bg-zinc-800">
            <div
              className="h-2 rounded bg-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex items-center gap-3">
          <Button type="button" onClick={handleUpload} disabled={uploading}>
            {uploading ? "Enviando..." : "Enviar PDF"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={resetAll}
            disabled={uploading}
          >
            Limpar
          </Button>
          {messajo === "Sucesso"? <p className="text-emerald-400">{messajo}</p> : messajo==="Erro"? <p className="text-red-400"></p>: null}
        </div>
      </div>
      )}
    </div>
  );
}