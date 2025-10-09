"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Youtube,
  Instagram,
  Clock,
  ChevronRight,
} from "lucide-react";
import YouTubeCard from "../components/YoutubeCard";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  hover: { y: 10, opacity: 0.6, transition: { duration: 0.6 } },
};

const Section = ({ id, title, subtitle, children, img, clickable }: any) => (
  <section id={id} className="max-w-6xl mx-auto px-4 md:px-6 py-6 ">
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      whileHover={clickable ? "hover" : ""}
      className={`relative max-w-6xl mx-auto px-4 md:px-6 pt-16 pb-8 rounded-md bg-gradient-to-bl from-transparent ${
        clickable ? "cursor-pointer" : ""
      } to-black/60`}
    >
      {img && (
        <div className="absolute inset-0 z-0">
          <Image
            src={img}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-all duration-500 group-hover:brightness-110 group-hover:scale-100 rounded-2xl"
            priority={false}
          />
          {/* Scrim leve só embaixo para legibilidade */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-black/70 via-transparent to-transparent" />
        </div>
      )}
      {title && (
        <div className="mb-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className=" mt-2 max-w-2xl text-gray-200">{subtitle}</p>
          )}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  </section>
);

// --- Mock Data ---
// const ministries = [
//   {
//     icon: Users,
//     title: "Jovens FIRE",
//     desc: "Crescendo em Santidade, Obediencia e Unidade.",
//   },
//   {
//     icon: Baby,
//     title: "Kids",
//     desc: "Evangelho na linguagem das crianças.",
//   },
//   {
//     icon: Music,
//     title: "Adoradores por Exelência",
//     desc: "Adoração sincera para o céu descer na terra.",
//   },

// ];

const events = [
  { title: "Big breakfast", date: "Todo terça", detail: "bring your bread" },
  {
    title: "smal one lunch",
    date: "Quartas, 20h",
    detail: "pspspspsps spsp pspspsp ps.",
  },
];

export default function ChurchHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-sky-800 text-white">
      <section
        className=" relative overflow-hidden mb-24 bg-cover bg-start before:absolute before:inset-0 before:bg-gradient-to-br before:from-black/80 before:to-sky-800/60 before:z-10"
        style={{ backgroundImage: "url('images/bg.jpeg')", height: "70vh" }}
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(99,102,241,0.20),transparent_70%)] " />
        <div className="max-w-6xl w-full mx-auto px-4 md:px-6 py-20 md:py-28 flex  justify-center gap-10 items-center relative z-20 ">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge className="mb-4 gap-2 bg-transparent rounded-full px-3 py-1">
              Seja bem-vindo
            </Badge>
            <div className="items-center justify-center mb-2 w-full flex">
              {/* <img src="images/logo.png" width={64} height={64}/> */}
            </div>
            <h1 className="text-4xl md:text-7xl font-semibold leading-tight">
              Lieja del Criroo Lalalala
            </h1>

            <p className="text-muted-foreground mt-4 max-w-prose">
              Junte-se for the organizaciones en el doradoro
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="rounded-2xl cursor-pointer hover:text-gray-300 hover:from-black/50 hover:to-black/70 bg-gradient-to-tl from-[#8B0101] to-black/20"
              >
                Visite-nos today
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sobre */}
      <Section
        id="sobre"
        title="Sobre nós"
        subtitle="Há mais de 25 anos Trabaiando"
        clickable={true}
        img="/images/velhos.jpeg"
      >
        <button
          onClick={() => {}}
          className="flex cursor-pointer flex-row w-full justify-end"
        >
          <ChevronRight width={50} height={50} />
        </button>
      </Section>

      <Section
        id="Departments"
        title="Departamentos"
        subtitle="Descubra mais sobre nossa organizaçao"
        clickable={true}
        img="/images/sonicpray.jpg"
      >
        <button
          onClick={() => {}}
          className="flex cursor-pointer flex-row w-full justify-end"
        >
          <ChevronRight width={50} height={50} />
        </button>
      </Section>

      {/* Eventos */}
      <Section
        id="eventos"
        title="Próximos eventos"
        subtitle="Participe de novas coisas"
      >
        <div className="grid md:grid-cols-3 gap-6">
          {events.map((e) => (
            <Card
              key={e.title}
              className="rounded-2xl border-none bg-gradient-to-br text-white from-black to-sky-700"
            >
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> {e.date}
                </div>
                <CardTitle className="text-xl mt-2">{e.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{e.detail}</p>
              </CardContent>
            </Card>
          ))}
          <div className="flex h-full w-full items-end justify-end">
            <button className="flex-row flex items-center  hover:from-black/50 cursor-pointer rounded-xl pl-6 hover:text-white text-gray-300/50 hover:to-black/70 bg-gradient-to-tl ">
              <h1 className="text-xl">Ver todos</h1>{" "}
              <ChevronRight width={40} height={40} />
            </button>
          </div>
        </div>
      </Section>

      <Section title="Menssagem" subtitle="Uma mensagem pra voce.">
        <Card className="rounded-3xl overflow-hidden bg-gradient-to-b border-none from-slate-700">
          <CardContent className="p-6 md:p-10">
            <div className="grid md:grid-cols-[140px_1fr] items-center gap-6">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-slate-700 to-slate-100" />
              <div>
                <blockquote className="text-xl  text-slate-200 leading-relaxed">
                  “Nosso produto é muito bom, compre.”
                </blockquote>
                <div className="mt-3 text-muted-foreground">— Coworker</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* Mídia */}
      <Section
        id="midia"
        title="Mídia e transmissões"
        subtitle="Acompanhe ao vivo e reveja mensagens recentes."
      >
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-2xl bg-black/20 text-white">
            <CardHeader className="flex-row items-center gap-3">
              <div className="h-10 w-10 rounded-lg text-red-600 grid place-items-center">
                <Youtube className="h-5 w-5" />
              </div>
              <CardTitle>Ao vivo / Última transmissao</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="">
                <YouTubeCard />
              </div>
              <div className="mt-3 flex gap-2">
                <Button className="rounded-xl">Assistir agora</Button>
                <Button variant="outline" className="rounded-xl">
                  Playlist
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader className="flex-row items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 grid place-items-center">
                <Instagram className="h-5 w-5" />
              </div>
              <CardTitle>Galeria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-slate-100"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Contato / Visite-nos */}
      <Section
        id="contato"
        title="Visite-nos"
        subtitle="Estamos ansiosos para receber você."
      >
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" /> Av. Abel Caim, 86 – Cidade
                  Jardim Edeon
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" /> Seg - sex
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Instagram className="h-4 w-4" />
                  /psps
                </div>
              </div>
              <div className="rounded-xl border bg-white p-4">
                <form className="grid gap-3">
                  <input
                    className="border rounded-md px-3 py-2"
                    placeholder="Seu nome"
                  />
                  <input
                    className="border rounded-md px-3 py-2"
                    placeholder="Seu e-mail"
                  />
                  <textarea
                    className="border rounded-md px-3 py-2 min-h-[96px]"
                    placeholder="Sua mensagem"
                  />
                  <Button className="rounded-xl">Enviar mensagem</Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid md:grid-cols-3 gap-8 items-start">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex flex-row items-center">
                <img src="images/logo.png" width={20} height={20} />
                <h1 className="ml-2 text-sm md:text-xl">psps</h1>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Uma família em missão trabalhando tlgd
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-3">Links rápidos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#eventos" className="hover:underline">
                  Agenda
                </a>
              </li>
              <li>
                <a href="#ministerios" className="hover:underline">
                  AGUA
                </a>
              </li>
              <li>
                <a href="#midia" className="hover:underline">
                  Mensagens
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:underline">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Horários</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Domingo – nao tem</li>
              <li>Quarta – tambe nao</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground pb-10">
          © {new Date().getFullYear()} A braba top. Todos os direitos
          reservados.
        </div>
      </footer>
    </div>
  );
}
