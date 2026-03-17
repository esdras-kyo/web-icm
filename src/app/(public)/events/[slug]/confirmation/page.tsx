// app/events/[slug]/confirmation/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, HomeIcon } from "lucide-react";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import PixPaymentCard from "@/components/PixPaymentCard";

type ConfirmationPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ConfirmationPage(props: ConfirmationPageProps) {
  const { params } = props;
  const { slug } = await params;

  const supabase = createSupabaseAdmin();

  const { data: event, error } = await supabase
    .from("events")
    .select(
      "id, title, price, image_key, address, description, payment_note, pix_key, pix_description"
    )
    .eq("slug", slug)
    .single();

  if (error || !event) {
    console.error("event not found:", error);
    notFound();
  }

  const basePrice = event.price ?? 0;
  const isFree = !basePrice || basePrice <= 0;

  const imageUrl = event.image_key
    ? `https://worker-1.esdrascamel.workers.dev/${event.image_key}`
    : "/images/fundo-geometrico.jpg";

  return (
    <main className="min-h-dvh w-full bg-black text-white flex flex-col">
      {/* Banner do evento */}
      <section className="relative w-full overflow-hidden h-[28vh] sm:h-[32vh] md:h-[52vh]">
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          sizes="100vw"
          className="object-contain md:object-cover object-top"
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
            <>
              {event.pix_key ? (
                <PixPaymentCard
                  pixKey={event.pix_key}
                  amount={basePrice}
                  eventTitle={event.title}
                  pixDescription={event.pix_description}
                  paymentNote={event.payment_note}
                />
              ) : (
                <div className="mt-2 flex flex-col gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-4 text-center">
                  <p className="text-sm text-gray-300">
                    As instruções de pagamento serão enviadas em breve.
                  </p>
                  {basePrice > 0 && (
                    <p className="text-sm text-gray-300">
                      Valor a pagar:{" "}
                      <span className="font-semibold">
                        R$ {basePrice.toFixed(2).replace(".", ",")}
                      </span>
                    </p>
                  )}
                  {event.payment_note && (
                    <p className="text-xs text-gray-400 whitespace-pre-line">
                      {event.payment_note}
                    </p>
                  )}
                </div>
              )}
            </>
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
