'use client'
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Instagram, Clock, ChevronRight, CalendarClock, UsersRound, Radio } from "lucide-react";
import YouTubeCard from "../components/YoutubeCard";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Section from "../components/Section";
import TopBanner from "../components/TopBanner";
import Footer from "../components/Footer";

 function Participe() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      className="w-full py-16 px-6 "
    >
      <div className="relative w-full mx-auto max-w-6xl  overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.03] p-8 md:p-12 shadow-xl flex flex-col items-center text-center gap-8">
        {/* glows */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />

        {/* título */}
        <header>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Participe conosco
          </h2>
          <p className="text-white/70 text-sm md:text-base mt-2">
            Há lugar pra você aqui.
          </p>
        </header>

        {/* horários em destaque */}
        <ul className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-white/90">
          <InfoPill
            icon={<CalendarClock className="size-5" />}
            text="Domingos • 09:00 e 19:00"
          />
          <InfoPill
            icon={<UsersRound className="size-5" />}
            text="Células • quartas-feiras"
          />
        </ul>

        {/* separador sutil */}
        <div className="w-full h-px bg-white/10" />

        {/* bloco de live + vídeo (frase diretamente ligada ao player) */}
        <section className="w-full max-w-3xl flex flex-col items-center text-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-white/15 bg-white/10 text-white/90">
            <Radio className="size-4" />
            Ao vivo
          </span>

          <h3 className="text-xl md:text-2xl font-semibold text-white">
            Acompanhe-nos em live
          </h3>
          <p className="text-white/70 text-sm md:text-base -mt-1">
            Cultos transmitidos com carinho pra quem está perto ou longe.
          </p>

          {/* player / card do YouTube */}
          <div className="w-full overflow-hidden rounded-xl ring-1 ring-white/10 bg-black/40">
            <div className="aspect-video w-full">
              {/* Substitua pelo seu componente real */}
              <YouTubeCard />
            </div>
          </div>

          {/* CTAs relacionadas ao vídeo */}
          {/* <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-3">

            <Link
              href="/agenda"
              className="cursor-pointer inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold bg-white/10 text-white hover:bg-white/15 ring-1 ring-white/20 active:scale-[0.98] transition"
            >
              Ver agenda completa
            </Link>
          </div> */}
        </section>
      </div>
    </motion.section>
  );
}

function InfoPill({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <li className="flex items-center justify-center gap-3 rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3">
      <div className="shrink-0 grid place-items-center rounded-lg bg-white/10 ring-1 ring-white/15 p-2">
        {icon}
      </div>
      <span className="text-base font-medium">{text}</span>
    </li>
  );
}


function formatarData(dataString: string) {
  const data = new Date(dataString);

  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0"); 
  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");

  return `${dia}/${mes} ${hora}:${minuto}`; 
}

type Mini = {
  id: string;
  title: string | null;
  description: string | null;
  price: number
  image_key: string
  starts_at: string
};

export default function ChurchHome() {
  const route = useRouter()
  const [events, setEvents] = useState<Mini[]>([]);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/events-on?visibility=ORG"); // ← sem query params → traz todos
        if (!res.ok) throw new Error("Falha ao carregar eventos");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {

      }
    }

    loadEvents();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-black to-sky-800 text-white">
      <TopBanner
        badgeText="Seja bem-vindo"
        title="Igreja de Cristo Maranata"
        subtitle="Junte-se a nós para adorar, aprender a Palavra e servir em Goiânia."
        backgroundImage="images/bg.jpeg"
        bannerHeight="70vh"
        showLogo
        logoSrc="/images/logo.png"
        logoAlt="Logo da igreja"
        showButton
        buttonLabel="Visite-nos neste domingo"
        onButtonClick={() => route.push("/localizacao")}
      />

      <Participe/>
  
      {/* <Section
        id="cell"
        title="Células"
        subtitle="Conheça mais sobre nossas células."
        clickable={true}
        img="/images/sonicpray.jpg"
        onClick={() => {
          route.push("/celulas");
        }}
      >
        <div className="flex flex-row w-full justify-end">
          <ChevronRight width={50} height={50} />
        </div>
      </Section> */}
      
      {/* <Section
        id="sobre"
        title="Sobre nós"
        subtitle="Há mais de 25 anos compartilhando a Palavra e servindo com amor."
        clickable={true}
        img="/images/velhos.jpeg"
        onClick={() => {
          route.push("/historia");
        }}
      >
        <div className="flex flex-row w-full justify-end">
          <ChevronRight width={50} height={50} />
        </div>
      </Section> */}

      <Section
        id="eventos"
        title="Próximos eventos"
        subtitle="Participe do que Deus está fazendo entre nós."
        clickable={true}
        onClick={() => {
          route.push("/events");
        }}
      >
        <div className="grid md:grid-cols-3 gap-6">
          {events.slice(0, 2).map((e) => (
            <Card
              key={e.title}
              className="rounded-2xl border-none bg-gradient-to-br text-white from-black to-sky-700"
            >
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> {formatarData(e.starts_at)}
                </div>
                <CardTitle className="text-xl mt-2">{e.title}</CardTitle>
              </CardHeader>

            </Card>
          ))}
          <div className="flex h-full w-full items-end justify-end">
           
              <h1 className="text-xl">Ver mais</h1>{" "}
              <ChevronRight width={40} height={40} />
           
          </div>
        </div>
      </Section>

      <Section id="contato" title="Visite-nos" subtitle="Estamos ansiosos para receber você e sua família.">
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> Av. Abel Coimbra, 86 – Cidade Jardim</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> Dom 9h e 19h · Qua 20h</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Instagram className="h-4 w-4" /> /icmsede</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Footer/>
    </div>
  );
}