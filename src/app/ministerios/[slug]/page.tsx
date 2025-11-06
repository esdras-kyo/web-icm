// app/ministerios/[slug]/page.tsx
import Image from "next/image";
import { getMinistryBySlug } from "../../../lib/ministries"

export default function MinistryPage({ params }: { params: { slug: string } }) {
  const m = getMinistryBySlug(params.slug);
  if (!m) return <div className="p-8">Ministério não encontrado.</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6 py-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl">
        <Image src={m.image ?? "/images/ministerios/_placeholder.jpg"} alt="" width={1600} height={600} className="h-64 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-3xl font-semibold">{m.name}</h1>
          <p className="opacity-90">{m.description}</p>
        </div>
      </div>

      {/* Corpo */}
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <section className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Nossa missão</h2>
          <p className="text-muted-foreground">A Rede de jovens fire tanana tananan</p>

          <h3 className="text-lg font-medium mt-6">Agenda</h3>
          <ul className="text-muted-foreground">
            <li>Encontros: {m.meeting ?? "—"}</li>
            <li>Local: Igreja - Sede</li>
          </ul>

          {/* (Opcional) Galeria / Próximos eventos */}
        </section>

        <aside className="md:col-span-1 ">
          <div className="rounded-2xl border border-white/10 p-4 bg-black/5">
            <h3 className=" text-gray-300 font-medium">Liderança</h3>
            <p className="text-muted-foreground">{m.leader ?? "—"}</p>
          </div>

        </aside>
      </div>
    </div>
  );
}