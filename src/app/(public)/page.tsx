'use client'
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Instagram, Clock, ChevronRight, CalendarClock, UsersRound, Radio } from "lucide-react";
import { useRouter } from "next/navigation";
import Section from "../components/Section";
import Footer from "../components/Footer";
import HeroMission from "@/app/components/HomeHero";
import YouTubeSection from "../components/YoutubeSection";


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
      <HeroMission
        churchName="Igreja de Crito Maranata"
        mission="Ganhar, consolidar, discipular e enviar"
        imageSrc="/images/home.png"
      />

      <YouTubeSection />


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
              className="rounded-2xl border-none bg-linear-to-br text-white from-black to-sky-700"
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

      <Section id="contato" title="Aqui voce encontra" subtitle="colocar dps">
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                cards
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Footer/>
    </div>
  );
}