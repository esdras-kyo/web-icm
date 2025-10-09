'use client'
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Church, Heart, Users, Music, Baby, HandHeart, MapPin, Play, Youtube, Facebook, Instagram, Clock, Cross, CrossIcon } from "lucide-react";
import YouTubeCard from "./components/YoutubeCard";

// --- Helpers ---
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Section = ({ id, title, subtitle, children }: any) => (
  <section id={id} className="max-w-6xl mx-auto px-4 md:px-6 py-16">
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}>
      {title && (
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className=" mt-2 max-w-2xl text-gray-200">{subtitle}</p>}
        </div>
      )}
      {children}
    </motion.div>
  </section>
);

// --- Mock Data ---
const ministries = [
  {
    icon: Users,
    title: "Jovens FIRE",
    desc: "Crescendo em Santidade, Obediencia e Unidade.",
  },
  {
    icon: Baby,
    title: "Kids",
    desc: "Evangelho na linguagem das crianças.",
  },
  {
    icon: Music,
    title: "Adoradores por Exelência",
    desc: "Adoração sincera para o céu descer na terra.",
  },
  
];

const events = [
  { title: "Culto de Domingo", date: "Todo domingo, 9h e 19h", detail: "Celebração presencial e online." },
  { title: "Células da Semana", date: "Quartas, 20h", detail: "Pequenos grupos em diversos bairros." },
 // { title: "Encontro de Casais", date: "12 de outubro, 20h", detail: "Uma noite para fortalecer o casamento." },
];

export default function ChurchHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-sky-700 text-white">
      {/* Header */}
      {/* <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/60 ">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-6 h-16">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 grid place-items-center text-white shadow">
              <Church className="h-5 w-5" />
            </div>
            <span className="font-semibold  text-white tracking-tight">Igreja Esperança Viva</span>
          </div>
          <nav className="hidden md:flex text-white items-center gap-6 text-sm">
            <a href="#sobre" className="hover:underline">Sobre</a>
            <a href="#ministerios" className="hover:underline">Ministérios</a>
            <a href="#eventos" className="hover:underline">Eventos</a>
            <a href="#midia" className="hover:underline">Mídia</a>
            <a href="#contato" className="hover:underline">Contato</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="hidden sm:inline-flex">Assista ao vivo</Button>
            <Button className="rounded-2xl">Contribuir</Button>
          </div>
        </div>
      </header> */}

      {/* Hero */}
      <section className=" relative overflow-hidden mb-24 bg-cover bg-start before:absolute before:inset-0 before:bg-gradient-to-br before:from-black/80 before:to-sky-900/60 before:z-10" style={{ backgroundImage: "url('images/bg-igreja.jpeg')", height: "70vh" }}>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(99,102,241,0.20),transparent_70%)] " />
        <div className="max-w-6xl w-full mx-auto px-4 md:px-6 py-20 md:py-28 flex  justify-center gap-10 items-center relative z-20 ">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>

            <Badge className="mb-4 gap-2 bg-transparent rounded-full px-3 py-1">Seja bem-vindo</Badge>
            <div className="items-center justify-center mb-2 w-full flex">
            <img src="images/logo.png" width={64} height={64}/>
            </div>
            <h1 className="text-4xl md:text-7xl font-semibold leading-tight">Igreja de Cristo Maranata</h1>
            
            <p className="text-muted-foreground mt-4 max-w-prose">
              Junte-se a nós para adorar, aprender a Palavra e servir em Goiânia.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" className="rounded-2xl cursor-pointer">Visite-nos neste domingo</Button>
            </div>
          </motion.div>
          {/* <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
            <Card className="rounded-3xl shadow-xl">
              <CardContent className="p-0">
                <div className="aspect-video w-full grid place-items-center">
                  <div className="w-full h-full grid place-items-center">
                    <div className="relative w-11/12 h-5/6 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-400 grid place-items-center text-white">
                      <Play className="h-10 w-10" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="px-6 pb-6 -mt-4">
                <div className="text-sm text-muted-foreground">Última mensagem</div>
                <div className="font-medium">Esperança que transforma – Pr. João</div>
              </div>
            </Card>
          </motion.div> */}
        </div>
      </section>

      {/* Sobre */}
      <Section id="sobre" title="Sobre nós" subtitle="Há mais de 25 anos compartilhando a Palavra e servindo com amor.">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="rounded-2xl bg-gradient-to-br border-none text-white from-slate-800 to-sky-800"><CardContent className="p-6"><p>Somos uma igreja que crê no Evangelho de Jesus Cristo e na transformação de vidas pela graça.</p></CardContent></Card>
          <Card className="rounded-2xl bg-gradient-to-br border-none text-white from-slate-800 to-sky-800"><CardContent className="p-6"><p>Nossos cultos são momentos de adoração, ensino bíblico e comunhão para toda a família.</p></CardContent></Card>
        </div>
        <div className="mt-6"><Button variant="outline" className="rounded-2xl cursor-pointer bg-black">Conheça nossa história</Button></div>
      </Section>

      {/* Ministérios */}
      <Section id="ministerios" title="Ministérios" subtitle="Descubra onde você pode se conectar e servir.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ministries.map((m) => (
            <Card key={m.title} className="rounded-2xl hover:shadow-lg bg-gradient-to-br from-slate-800 to-sky-800 border-none transition-shadow">
              <CardHeader className="pb-2">
                {/* <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 grid place-items-center"><m.icon className="h-5 w-5" /></div> */}
              </CardHeader>
              <CardContent className="pt-0 text-white">
                <CardTitle className="text-lg mb-1">{m.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{m.desc}</p>
                <div className="mt-4"><Button variant="ghost" className="px-2">Saiba mais →</Button></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Eventos */}
      <Section id="eventos" title="Próximos eventos" subtitle="Participe do que Deus está fazendo entre nós.">
        <div className="grid md:grid-cols-3 gap-6">
          {events.map((e) => (
            <Card key={e.title} className="rounded-2xl border-none bg-gradient-to-br text-white from-black to-sky-700">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> {e.date}
                </div>
                <CardTitle className="text-xl mt-2">{e.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{e.detail}</p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="rounded-xl">Ver detalhes</Button>
                  
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Mensagem do Pastor */}
      <Section title="Mensagem do Pastor" subtitle="Uma palavra ao seu coração.">
        <Card className="rounded-3xl overflow-hidden bg-gradient-to-b border-none from-slate-700">
          <CardContent className="p-6 md:p-10">
            <div className="grid md:grid-cols-[140px_1fr] items-center gap-6">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-slate-700 to-slate-100" />
              <div>
                <blockquote className="text-xl  text-slate-200 leading-relaxed">“Nosso propósito é que cada pessoa encontre em Cristo um novo começo.”</blockquote>
                <div className="mt-3 text-muted-foreground">— Pr. Edimar Santos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* Mídia */}
      <Section id="midia" title="Mídia e transmissões" subtitle="Acompanhe ao vivo e reveja mensagens recentes.">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-2xl bg-black/20 text-white">
            <CardHeader className="flex-row items-center gap-3">
              <div className="h-10 w-10 rounded-lg text-red-600 grid place-items-center"><Youtube className="h-5 w-5" /></div>
              <CardTitle>Ao vivo / Última pregação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="">
              <YouTubeCard />
              </div>
              <div className="mt-3 flex gap-2">
                <Button className="rounded-xl">Assistir agora</Button>
                <Button variant="outline" className="rounded-xl">Playlist</Button>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader className="flex-row items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 grid place-items-center"><Instagram className="h-5 w-5" /></div>
              <CardTitle>Galeria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-slate-100" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Contato / Visite-nos */}
      <Section id="contato" title="Visite-nos" subtitle="Estamos ansiosos para receber você e sua família.">
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> Av. Abel Coimbra, 86 – Cidade Jardim</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> Dom 9h e 19h · Qua 20h</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Instagram className="h-4 w-4" /> /icmsede</div>
              </div>
              <div className="rounded-xl border bg-white p-4">
                <form className="grid gap-3">
                  <input className="border rounded-md px-3 py-2" placeholder="Seu nome" />
                  <input className="border rounded-md px-3 py-2" placeholder="Seu e-mail" />
                  <textarea className="border rounded-md px-3 py-2 min-h-[96px]" placeholder="Sua mensagem" />
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
          <h1 className="ml-2 text-sm md:text-xl">Igreja de Cristo Maranata</h1>
          </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">Uma família em missão, anunciando a esperança do Evangelho.</p>
          </div>
          <div>
            <h4 className="font-medium mb-3">Links rápidos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#eventos" className="hover:underline">Agenda</a></li>
              <li><a href="#ministerios" className="hover:underline">Servir</a></li>
              <li><a href="#midia" className="hover:underline">Mensagens</a></li>
              <li><a href="#contato" className="hover:underline">Contato</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Horários</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Domingo – 9h e 19h</li>
              <li>Quarta – 20h (Células)</li>

            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground pb-10">© {new Date().getFullYear()} Igreja de Cristo Maranata. Todos os direitos reservados.</div>
      </footer>
    </div>
  );
}