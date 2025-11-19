// app/events/[id]/confirmation/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, HomeIcon } from "lucide-react";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { CopyableRow } from "@/app/contribua/page";

type ConfirmationPageProps = {
  params: Promise<{ id: string }>;       // 👈 repare: Promise
};

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { id } = await params;
  
  const supabase = createSupabaseAdmin();

  const { data: event, error } = await supabase
    .from("events")
    .select("id, title, price, image_key, address, description, payment_note")
    .eq("id", id)
    .single();

  if (error || !event) {
    console.error("event not found:", error);
    notFound();
  }

  const isFree = !event.price || event.price <= 0;

  const imageUrl = event.image_key
    ? `https://worker-1.esdrascamel.workers.dev/${event.image_key}`
    : "/images/fundo-geometrico.jpg";

  // caminho da imagem fixa de QR – coloca essa imagem em /public/images/
  const staticQrPath = "/images/qrcode.jpeg";
  const pixKey = "04.391.808/0001-06";
  return (
    <main className="min-h-dvh w-full bg-black text-white flex flex-col">
      {/* Banner do evento */}
      <section className="relative h-[40vh] w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-4xl px-4 pb-6">
          <h1 className="text-2xl md:text-4xl font-bold drop-shadow">
            {event.title}
          </h1>
        </div>
      </section>

      {/* Card de confirmação */}
      <section className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-6 py-8 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-50">
                Inscrição realizada com sucesso!
              </h2>
              {isFree ? (
                <p className="text-sm text-gray-300">
                  Sua vaga já está confirmada. Este evento é gratuito, não há
                  necessidade de pagamento.
                </p>
              ) : (
                <p className="text-sm text-gray-300">
                  Agora é só confirmar o pagamento via Pix para garantir sua
                  vaga.
                </p>
              )}
            </div>
          </div>

          {/* BLOCO DE PAGAMENTO – só se evento tiver preço > 0 */}
          {!isFree && (
            <div className="mt-2 flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-4">
              <p className="text-sm text-gray-200 text-center">
                Escaneie o QR Code abaixo com o app do seu banco para efetuar o
                pagamento deste evento.
              </p>

              <div className="bg-white p-3 rounded-lg">
                <Image
                  src={staticQrPath}
                  alt="QR Code Pix"
                  width={220}
                  height={220}
                />
               
              </div>
              <div className="mt-2  max-w-[75%] flex flex-col items-center gap-3 rounded-xl px-4 py-4">
              <CopyableRow label="Chave PIX" value={pixKey} />
              </div>

              

              {typeof event.price === "number" && event.price > 0 && (
                <p className="text-sm text-gray-300">
                  Valor:{" "}
                  <span className="font-semibold">
                    R$ {event.price.toFixed(2).replace(".", ",")}
                  </span>
                </p>
              )}
              {!isFree && event.payment_note && (
                  <p className="mt-2 text-xs text-gray-400 whitespace-pre-line text-center">
                    {event.payment_note}
                  </p>
                )}

          <p className="text-xs text-gray-100 text-center">
            Na descrição do pagamento/PIX coloque: &quot;{event.title}&quot;
          </p>
            </div>
          )}

          {/* Botões */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-md shadow-black/40 transition hover:bg-zinc-900 cursor-pointer"
            >
              <HomeIcon className="h-4 w-4" />
              {isFree
                ? "Voltar para início"
                : "Pagar depois e voltar para início"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}