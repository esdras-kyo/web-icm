"use client";
import Footer from "@/app/components/Footer";
import HeroCenter from "@/app/components/HeroCenter";
import MinistriesGrid from "@/app/components/MinistriesGrid";
import { motion } from "framer-motion";
import {
  HeartHandshake,
  Star,
  Flower2,
  Compass,
} from "lucide-react";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

type TitleLinedProps = {
  label: string;
  as?: React.ElementType;
  mono?: boolean;
};

function TitleLined({ label, as: Tag = "h2", mono = false }: TitleLinedProps) {
  return (
    <div className="w-full flex items-center gap-6">
      <span className="h-px flex-1 bg-linear-to-r from-transparent via-white/25 to-transparent" />
      <Tag
        className={`text-2xl md:text-3xl font-bold tracking-tight text-white text-center ${mono ? "font-mono" : ""}`}
      >
        {label}
      </Tag>
      <span className="h-px flex-1 bg-linear-to-l from-transparent via-white/25 to-transparent" />
    </div>
  );
}

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
      <div
        className={`max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-center gap-10 md:gap-12 ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
      >
        <motion.div
          className="w-full md:w-1/2"
          initial={reverse ? { opacity: 0, x: 24 } : { opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
        >
          {eyebrow && (
            <p className="text-xs uppercase tracking-[0.18em] text-white/60 mb-2">
              {eyebrow}
            </p>
          )}
          {title && (
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
              {title}
            </h3>
          )}
          <p className=" text-gray-200 text-base md:text-lg leading-relaxed max-w-prose">
            {text}
          </p>
        </motion.div>

        <motion.div
          className="w-full md:w-1/2"
          initial={reverse ? { opacity: 0, x: -24 } : { opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
        >
          <div className="rounded-3xl  overflow-hidden shadow-2xl ring-1 ring-white/10">
            <Image
              src={img}
              alt=""
              className="w-full h-full object-cover aspect-16/10"
              loading="lazy"
              width={800}
              height={450}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs md:text-sm">
      {children}
    </span>
  );
}

function MVV() {
  const items = [
    {
      icon: <HeartHandshake className="w-6 h-6" />,
      title: "Missão",
      desc: "Formar discípulos de Jesus vivendo a verdade da Palavra, cheios do Espírito Santo, servindo à Igreja e alcançando o mundo. Nossa missão é edificar uma comunidade que ama a Bíblia, pratica a comunhão e serve com propósito, promovendo transformação de vidas e famílias para a glória de Deus.",
      tags: ["Palavra", "Discipulado", "Comunhão", "Serviço"],
    },
    {
      icon: <Compass className="w-6 h-6" />,
      title: "Visão",
      desc: "Ser uma Igreja saudável, fundamentada no Evangelho, onde vidas são transformadas pelo poder de Deus e onde cada membro cresce em maturidade espiritual, se multiplica e assume seu chamado. Vivemos a visão “Somos Mil”: alcançar pessoas, formar líderes e expandir o Reino com simplicidade e fidelidade bíblica.",
      tags: ["Santidade", "Crescimento", "Multiplicação", "Liderança"],
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Valores",
      desc: [
        "Cristocentrismo: Jesus é o centro de tudo.",
        "Simplicidade Bíblica: onde a Bíblia fala, falamos; onde ela se cala, calamo-nos.",
        "Serviço com amor: cada membro é um ministro.",
        "Unidade e comunhão: caminhamos como um só corpo.",
        "Discipulado relacional: vidas cuidando de vidas.",
        "Excelência com coração voluntário: fazemos o melhor para Deus.",
        "Esperança escatológica: vivemos olhando para o retorno de Cristo.",
      ],
      tags: ["Escrituras", "Oração", "Unidade", "Esperança"],
    },
  ];

  return (
    <section className="py-14 md:py-48 bg-black">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <TitleLined label="Missão, Visão e Valores" />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((it) => (
            <motion.article
              key={it.title}
              initial={fadeUp.hidden}
              whileInView={fadeUp.show}
              viewport={{ once: true, amount: 0.35 }}
              className="rounded-2xl p-6 md:p-8 bg-white/4 ring-1 ring-white/10 backdrop-blur-sm hover:bg-white/6 transition"
            >
              <div className="flex items-center gap-3 text-white">
                <div className="p-2 rounded-xl bg-white/10">{it.icon}</div>
                <h3 className="text-xl font-semibold">{it.title}</h3>
              </div>
              {Array.isArray(it.desc) ? (
                <ul className="mt-4 list-disc pl-5 space-y-2 text-white/90">
                  {it.desc.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-white/90 leading-relaxed">{it.desc}</p>
              )}
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

function Pioneers() {
  const people = [
    'Edimar Santos',
    'Geneci Coutinho',
    'Edia Bueno',
    'Roberta Braga',
    'Rones Marques',
    'Meire e Neomarcio',
    'Simone Pinheiro',
    'Gleisson Marcos',
    'Ediberto Camilo',
    'Carmem Pinheiro',
    'Fabiana e Jodeilton',
    'Júnior e Alessandra',
    'Kenia Saraiva',
    'Márcio Moreno',
    'Rosane e suas crianças',
  ];

  return (
    <section className="py-16 md:py-24 bg-black/30 min-h-dvh flex items-center">
      <div className="w-full mx-auto px-4 md:px-6">
        <TitleLined label="Os pioneiros" />

        <p className="mt-6 text-white/85 leading-relaxed text-center max-w-3xl mx-auto">
          Homens e mulheres que, com fé, coragem e zelo, plantaram as sementes
          de uma comunidade comprometida com a verdade bíblica, o discipulado
          relacional e a comunhão entre os santos.
        </p>

        <div className="mt-10">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 max-w-5xl mx-auto">
            {people.map((p) => (
              <li
                key={p}
                className="flex items-center gap-3 text-white/90"
              >
                <Flower2 className="w-4 h-4 text-white/60 shrink-0" />
                <span className="leading-snug">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function HistorySection() {
  return (
    <main className="min-h-screen bg-linear-to-br from-black to-[#0b2a3e] text-white">
      <HeroCenter
        churchName="NOSSA HISTÓRIA"
        mission="Igreja de Cristo Maranata"
        imageSrc="/images/maoslevantadas.jpeg"
      />

      {/* 1999 — O Começo de Tudo
       */}
      <ImageTextBlock
        eyebrow="1999"
        title="O Começo de Tudo"
        img="/images/velhos.jpeg"
        text="A nossa história nasceu em abril de 1999, quando um pequeno grupo de irmãos se reuniu na casa da irmã Edia, na Vila Aurora Oeste, para orar, sonhar e buscar a vontade de Deus. Ali, entre comunhão e esperança, surgiram os primeiros passos do que se tornaria a Igreja de Cristo Maranata — uma igreja simples, bíblica e centrada no Evangelho.
O que começou em um lar, com poucos, tornou-se uma família espiritual que segue crescendo, servindo e vivendo a missão que o Senhor nos confiou."
      />

      <ImageTextBlock
        reverse
        eyebrow="2001"
        title="Uma Nova Fase de Crescimento e Consolidação"
        img="/images/galpao.jpg"
        text="No fim de 2000, a mudança para a Rua Leão XIII, no Setor Rodoviário, trouxe identidade, estrutura e novas possibilidades ao grupo que estava sendo formado. Ali, os encontros ganharam estabilidade, a comunhão se fortaleceu e a visão de plantar uma igreja bíblica, simples e centrada no Evangelho começou a tomar forma com mais clareza.
Em 19 de agosto de 2001, a Igreja de Cristo Maranata foi oficialmente fundada, marcando um passo decisivo na história da comunidade. Esse momento representou mais do que um registro — foi a confirmação de um chamado que Deus havia iniciado anos antes, dentro de um pequeno grupo reunido em fé e oração.
Já em 2004, a mudança para o galpão da Rua da Imprensa trouxe uma nova onda de crescimento. O espaço, mais amplo e estruturado, permitiu o avanço dos ministérios, a realização de projetos e o fortalecimento da comunhão, consolidando a obra e preparando o caminho para tudo o que Deus continuaria a fazer nos anos seguintes.
"
      />

      <ImageTextBlock
        eyebrow="2005"
        title="Um Novo Tempo: A Casa Ganha Forma, a Visão Ganha Força"
        img="/images/templo1.jpeg"
        text="A mudança para a Av. Abel Coimbra, no bairro Cidade Jardim, marcou um ponto decisivo na caminhada da Igreja de Cristo Maranata. O que começou como um terreno simples se tornou, aos poucos, um espaço sagrado — erguido com esforço, oração, generosidade e o propósito firme de ver o Reino de Deus avançar.
Cada parede levantada, cada tijolo colocado e cada recurso ofertado pelos irmãos carregava um significado profundo: ali nascia um lugar preparado para acolher vidas, ensinar a Palavra e construir uma igreja saudável, centrada exclusivamente em Cristo.
Mesmo em meio ao processo de construção, os cultos aconteciam na tenda, sob sol ou chuva, revelando uma fé perseverante e uma igreja disposta a caminhar com simplicidade, união e coragem. Ano após ano, o templo foi ganhando forma e estrutura, mas manteve intacto aquilo que sempre definiu a nossa identidade: a centralidade em Jesus, o amor pela comunhão e o desejo de formar discípulos que impactam gerações.
A instalação no novo endereço não apenas ampliou o espaço físico — ela ampliou a visão, fortaleceu a unidade e preparou o terreno para tudo o que Deus continuaria a realizar nos anos seguintes.
Um templo construído por mãos humanas, mas sustentado pela fidelidade de Deus.
"
      />

      <ImageTextBlock 
      reverse
      eyebrow="Hoje"
      title="Igreja de Cristo Maranata"
      img=""
      text="O que começou em uma sala simples, depois cresceu em casas, galpões e tendas, hoje se tornou uma igreja viva, madura e comprometida com o Reino. A Igreja de Cristo Maranata segue firme na missão de formar discípulos, fortalecer famílias e anunciar o Evangelho com verdade e amor. Somos uma comunidade que honra o legado recebido, mas caminha com os olhos no futuro. Aqui, cada culto, cada célula, cada ministério e cada líder faz parte de uma construção contínua: uma igreja saudável, bíblica, acolhedora e movida pela presença do Espírito Santo. "/>

      <ImageTextBlock
      
      eyebrow=""
      title=""
      img=""
      text="Vivemos a visão “Somos Mil” com fé e ação, entendendo que o crescimento não acontece apenas em números, mas em vidas transformadas, relacionamentos restaurados e líderes levantados para servir. Hoje, continuamos avançando — como família, como igreja e como corpo unido em Cristo — para cumprir o propósito que Deus nos confiou e alcançar gerações com o poder do Evangelho. Esta é a Igreja de Cristo Maranata: firme na fé, constante na missão e cheia de esperança pelo que ainda virá. "
      />
       <MVV />

      <Pioneers />

      <MinistriesGrid />

      <Footer />
    </main>
  );
}
