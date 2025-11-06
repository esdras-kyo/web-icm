"use client";
import { motion } from "framer-motion";
import { HeartHandshake, Star, Users, Church, ArrowRight, Flower2, ScrollText, Compass } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
};

type TitleLinedProps = {
  label: string;
  as?: React.ElementType;
  mono?: boolean;
};

export function TitleLined({ label, as: Tag = "h2", mono = false }: TitleLinedProps) {
  return (
    <div className="w-full flex items-center gap-6">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <Tag className={`text-2xl md:text-3xl font-bold tracking-tight text-white text-center ${mono ? "font-mono" : ""}`}>
        {label}
      </Tag>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-white/25 to-transparent" />
    </div>
  );
}

// ---- bloco imagem + texto ----
function ImageTextBlock({
  text,
  img,
  reverse = false,
  eyebrow,
  title,
}: {
  text: string;
  img: string;
  reverse?: boolean;
  eyebrow?: string;
  title?: string;
}) {
  return (
    <section className="relative py-12 md:py-16">
      <div className={`max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-center gap-10 md:gap-12 ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}>
        {/* texto */}
        <motion.div className="w-full md:w-1/2" initial={reverse ? { opacity: 0, x: 24 } : { opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.6 }}>
          {eyebrow && <p className="text-xs uppercase tracking-[0.18em] text-white/60 mb-2">{eyebrow}</p>}
          {title && <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">{title}</h3>}
          <p className=" text-gray-200 text-base md:text-lg leading-relaxed max-w-prose">{text}</p>
        </motion.div>

        {/* imagem */}
        <motion.div className="w-full md:w-1/2" initial={reverse ? { opacity: 0, x: -24 } : { opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.6 }}>
          <div className="rounded-3xl  overflow-hidden shadow-2xl ring-1 ring-white/10">
            <img src={img} alt="" className="w-full h-full object-cover aspect-[16/10]" loading="lazy" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---- cards (Missão, Visão, Valores) ----
function Pill({ children }: { children: React.ReactNode }) {
  return <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs md:text-sm">{children}</span>;
}

function MVV() {
  const items = [
    {
      icon: <HeartHandshake className="w-6 h-6" />,
      title: "Missão",
      desc: "Anunciar o evangelho de Cristo com fidelidade bíblica, formar discípulos que crescem em comunhão, santidade e serviço, e edificar famílias para a glória de Deus.",
      tags: ["Evangelho", "Discipulado", "Comunhão"],
    },
    {
      icon: <Compass className="w-6 h-6" />,
      title: "Visão",
      desc: "Ser uma comunidade que reflete o Reino: simples, acolhedora e relevante, onde cada membro descobre seus dons e serve com alegria na cidade e até os confins da terra.",
      tags: ["Santidade", "Serviço", "Cidade"],
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Valores",
      desc: "Centralidade das Escrituras, oração, unidade, integridade, generosidade, amor ao próximo e esperança viva na volta de Cristo.",
      tags: ["Escrituras", "Oração", "Unidade"],
    },
  ];

  return (
    <section className="py-14 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <TitleLined label="Missão, Visão e Valores" />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((it) => (
            <motion.article
              key={it.title}
              initial={fadeUp.hidden}
              whileInView={fadeUp.show}
              viewport={{ once: true, amount: 0.35 }}
              className="rounded-2xl p-6 md:p-8 bg-white/[0.04] ring-1 ring-white/10 backdrop-blur-sm hover:bg-white/[0.06] transition" 
            >
              <div className="flex items-center gap-3 text-white">
                <div className="p-2 rounded-xl bg-white/10">{it.icon}</div>
                <h3 className="text-xl font-semibold">{it.title}</h3>
              </div>
              <p className="mt-4 text-white/90 leading-relaxed">{it.desc}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {it.tags.map((t) => (
                  <Pill key={t}>{t}</Pill>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Emphasis() {
  return (
    <section className="py-14 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.blockquote
          initial={fadeIn.hidden}
          whileInView={fadeIn.show}
          viewport={{ once: true, amount: 0.4 }}
          className="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-white/[0.06] to-white/[0.02] ring-1 ring-white/10"
        >
          <p className="text-xl md:text-2xl leading-relaxed text-white/95">
            “Nossa casa, que antes era um galpão, tornou-se um lugar de adoração e comunhão — simples, acolhedor e centrado em Cristo.”
          </p>
          <footer className="mt-4 text-white/60">Memórias da comunidade</footer>
        </motion.blockquote>
      </div>
    </section>
  );
}

function Gallery() {
  const IMGS = [
    "/images/maoslevantadas.jpeg",
    "/images/galpao.jpg",
    "/images/templo1.jpeg",
    "/images/templo2.jpeg",
    "/images/templo-out.jpeg",
    "/images/velhos.jpeg",
  ];
  return (
    <section className="py-14 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <TitleLined label="Memórias em imagens" />
        <div className="mt-8 grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4">
          {IMGS.map((src, i) => (
            <motion.div key={src} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.4, delay: i * 0.03 }} className={`overflow-hidden rounded-2xl ring-1 ring-white/10 ${i === 0 ? "md:col-span-3 col-span-2" : i === 5 ? "md:col-span-3 col-span-2" : "md:col-span-1"}`}>
              <img src={src} alt="" className="w-full h-full object-cover aspect-[4/3] md:aspect-square" loading="lazy" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- seção pioneiros ----
function Pioneers() {
  const people = [
    "Edimar Santos",
    "Geneci Coutinho",
    "Edia Bueno",
    "Roberta Braga",
    "Rones Marques",
    "Meire e Neomarcio",
    "Simone Pinheiro",
    "Gleisson Marcos",
    "Ediberto Camilo",
    "Carmem Pinheiro",
    "Fabiana e Jodeilton",
    "Júnior e Alessandra",
    "Kenia Saraiva",
    "Márcio Moreno",
    "Rosane e suas crianças",
  ];
  return (
    <section className="py-14 md:py-20 items-center">
      <div className="max-w-6xl mx-auto px-4 md:px-6 md:w-full">
        <TitleLined label="Os pioneiros" />
        <p className="mt-6 text-white/90 leading-relaxed text-center md:w-full max-w-3xl">
          Homens e mulheres que, com fé, coragem e zelo, plantaram as sementes de uma comunidade comprometida com a verdade bíblica, o discipulado relacional e a comunhão entre os santos.
        </p>
        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {people.map((p) => (
            <li key={p} className="flex items-center gap-3 text-white/90">
              <Flower2 className="w-4 h-4 text-white/70" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---- CTA simples ----
function CTA() {
  return (
    <section className="py-14 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="rounded-3xl p-8 md:p-12 bg-white/[0.04] ring-1 ring-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold text-white">Junte-se à nossa comunhão</h3>
            <p className="text-white/80 mt-2"></p>
          </div>
          <a href="#agenda" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-medium hover:opacity-90 transition">
            Ver agenda <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ---- HERO ----
function Hero() {
  return (
    <section className="relative w-full min-h-[72vh] md:min-h-[82vh] overflow-hidden rounded-none md:rounded-2xl">
      <img src="/images/maoslevantadas.jpeg" alt="Fundo" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/40" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
        <motion.p initial={fadeIn.hidden} animate={fadeIn.show} className="text-gray-300">Nossa História</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }} className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mt-2">
          IGREJA DE CRISTO MARANATA
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="text-white/90 mt-3 md:mt-4 text-base md:text-lg">
          Um nascimento em oração e simplicidade
        </motion.p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="inline-flex items-center gap-2 text-white/80 text-sm"><Church className="w-4 h-4"/> Comunhão</span>
          <span className="inline-flex items-center gap-2 text-white/80 text-sm"><ScrollText className="w-4 h-4"/> Escrituras</span>
          <span className="inline-flex items-center gap-2 text-white/80 text-sm"><Users className="w-4 h-4"/> Discipulado</span>
        </div>
      </div>
    </section>
  );
}

// ---- Página ----
export default function HistorySection() {
  return (
    <main className="min-h-screen w-full bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <Hero />

        {/* Seções sobre o começo */}
        <ImageTextBlock
          eyebrow="1999"
          title=""
          img="/images/velhos.jpeg"
          text="A história começou em abril de 1999, na casa da irmã Edia (Rua 11 de Janeiro, Vila Aurora Oeste). Tempo de oração, comunhão e esperança — um grupo sonhando com uma igreja centrada no Evangelho e na comunhão cristã."
        />

        <ImageTextBlock
          reverse
          eyebrow="2001"
          title=""
          img="/images/galpao.jpg"
          text="No fim de 2000, a mudança para a Rua Leão XIII (Setor Rodoviário) trouxe identidade ao grupo. Em 19 de agosto de 2001, foi oficialmente fundada a Igreja de Cristo Maranata. Em 2004, a mudança para o galpão da Rua da Imprensa consolidou a obra."
        />

        <ImageTextBlock
          eyebrow="2005"
          title=""
          img="/images/templo1.jpeg"
          text="Instalação na Av. Abel Coimbra (Cidade Jardim). Com a contribuição e propósito dos irmãos, o templo foi sendo erguido e aprimorado, mantendo a simplicidade e a centralidade em Cristo."
        />

        {/* Blocos MVV */}
        <MVV />

        {/* Ênfase */}
        <Emphasis />

        {/* Continuidade visual do templo */}
        <ImageTextBlock
          reverse
          eyebrow="Hoje"
          title="Nossa casa de adoração"
          img="/images/templo2.jpeg"
          text="De galpão a lar espiritual: um espaço acolhedor para adoração e comunhão, com melhorias contínuas e foco no que é essencial."
        />
        <ImageTextBlock
          eyebrow="Comunidade"
          title="Simplicidade que acolhe"
          img="/images/templo-out.jpeg"
          text="Ambiente pensado para receber famílias, ensinar as Escrituras e servir a cidade com amor e generosidade."
        />

        {/* Galeria e Pioneiros */}
        <Gallery />
        {/* <Timeline /> */}
        <Pioneers />

        {/* CTA */}
        <CTA />
      </div>
    </main>
  );
}
