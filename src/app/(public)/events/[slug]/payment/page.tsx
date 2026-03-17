import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import PixPaymentCard from "@/components/PixPaymentCard";

type PaymentPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { slug } = await params;
  const supabase = createSupabaseAdmin();

  const { data: event, error } = await supabase
    .from("events")
    .select("id, title, price, image_key, payment_note, pix_key, pix_description")
    .eq("slug", slug)
    .single();

  if (error || !event) notFound();

  const price = event.price ?? 0;
  const isPaid = price > 0 && event.pix_key;

  if (!isPaid) notFound();

  const imageUrl = event.image_key
    ? `https://worker-1.esdrascamel.workers.dev/${event.image_key}`
    : "/images/fundo-geometrico.jpg";

  return (
    <main className="min-h-dvh w-full bg-black text-white flex flex-col">
      {/* Banner */}
      <section className="relative w-full overflow-hidden h-[28vh] sm:h-[32vh] md:h-[44vh]">
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

      {/* Conteúdo */}
      <section className="flex-1 flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-xl flex flex-col gap-4">
          <Link
            href={`/events/${slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o evento
          </Link>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-6 py-6 flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-gray-50">
              Pagamento via Pix
            </h2>
            <p className="text-sm text-gray-400">
              Use o QR Code abaixo para concluir o pagamento da sua inscrição.
            </p>

            <PixPaymentCard
              pixKey={event.pix_key!}
              amount={price}
              eventTitle={event.title}
              pixDescription={event.pix_description}
              paymentNote={event.payment_note}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
