"use client";

import * as React from "react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Search,
  ChevronRight,
  Users,
  Music4,
  Baby,
  HeartHandshake,
  Flame,
  BookOpen,
  Soup,
  DramaIcon,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export type Ministry = {
  id: string;
  name: string;
  slug: string;
  description: string;
  leader?: string;
  meeting?: string; // ex.: "Domingos, 17h"
  whatsapp?: string; // link completo
  image?: string; // opcional para capa
  tags?: string[]; // ex.: ["família", "crianças"]
  icon?: string; // nome para icone
};

// ——— MOCK: troque por dados do seu banco
const MINISTRIES: Ministry[] = [
  {
    id: "1",
    name: "Adoradores por Excelência",
    slug: "louvor",
    image: "/images/sonicpray.jpg",
    description:
      "Servimos conduzindo a igreja em adoração, com excelência e coração alinhado com Cristo.",
    leader: "Marco Aurélio e Pr. Márcio",
    meeting: "Quintas 20h (ensaio)",
    tags: ["música", "adoradores"],
    icon: "music",
  },
  {
    id: "2",
    name: "Maranata Kids",
    slug: "infantil",
    description:
      "Cuidamos e discipulamos as crianças com conteúdo bíblico e atividades criativas.",
    leader: "Equipe Kids",
    meeting: "Domingos 9h & 19h",
    tags: ["crianças", "família"],
    icon: "baby",
  },
  {
    id: "3",
    name: "Rede Fire",
    slug: "jovens",
    description: "Uma geração apaixonada por Jesus e pela Palavra.",
    leader: "Carlos Eduardo e Juliana Batista",
    meeting: "Sábados 19h",
    image:"/images/icmpioneiros.jpeg",
    tags: ["juventude"],
    icon: "flame",
  },

  {
    id: "4",
    name: "Grupo Teatral Maranata",
    slug: "teatro",
    description: "Levando o evangelho através da arte.",
    leader: "Darlva Carneiro",
    meeting: "Segunda 19h30",
    tags: ["dança", "teatro"],
    icon: "drama",
  },
];

// ——— Helpers extraídos (facilitam teste)
function computeTags(ministries: Ministry[]): string[] {
  const set = new Set<string>();
  ministries.forEach((m) => m.tags?.forEach((t) => set.add(t)));
  return Array.from(set);
}

function filterMinistries(
  ministries: Ministry[],
  q: string,
  tag: string | null
): Ministry[] {
  const query = (q || "").toLowerCase();
  return ministries.filter((m) => {
    const matchesQ =
      !query ||
      `${m.name} ${m.description} ${m.leader}`.toLowerCase().includes(query);
    const matchesTag = !tag || m.tags?.includes(tag);
    return matchesQ && matchesTag;
  });
}

// ——— DEV: Testes simples em runtime (apenas desenvolvimento)
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  // 1) computeTags agrega corretamente
  const tg = computeTags(MINISTRIES);
  console.assert(
    tg.includes("família"),
    "[TEST] computeTags deveria conter 'família'"
  );

  // 2) filtro por texto encontra "Louvor"
  const f1 = filterMinistries(MINISTRIES, "louvor", null);
  console.assert(
    f1.some((m) => m.slug === "louvor"),
    "[TEST] filtro por texto deveria retornar o ministério de Louvor"
  );

  // 3) filtro por tag restringe resultados
  const f2 = filterMinistries(MINISTRIES, "", "família");
  console.assert(
    f2.every((m) => m.tags?.includes("família")),
    "[TEST] filtro por tag deveria restringir todos os resultados a #família"
  );

  // 4) href para slug está correto
  console.assert(
    buildMinistryHref("louvor") === "/ministerios/louvor",
    "[TEST] buildMinistryHref deve montar a URL correta"
  );
}

// ——— Ícones adaptáveis
function MinistryIcon({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  switch (name) {
    case "music":
      return <Music4 className={className} />;
    case "baby":
      return <Baby className={className} />;
    case "heart":
      return <HeartHandshake className={className} />;
    case "flame":
      return <Flame className={className} />;
    case "book":
      return <BookOpen className={className} />;
    case "soup":
      return <Soup className={className} />;
    case "drama":
      return <DramaIcon className={className} />;
    default:
      return <Users className={className} />;
  }
}

// ——— Navegação
function buildMinistryHref(slug: string) {
  return `/ministerios/${slug}`;
}
function getCardBackground(ministry: Ministry) {
  return ministry.image ?? "/images/ministerios/_placeholder.jpg";
}

// ——— Página
export default function MinisteriosHub() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const filtered = useMemo(
    () => filterMinistries(MINISTRIES, q, tag),
    [q, tag]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-10">
      {/* Hero */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-white">
          Nossos Ministérios
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Descubra onde você pode se conectar e servir. Cada ministério existe
          para glorificar a Deus e alcançar pessoas.
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome ou descrição"
            className="pl-9 text-white"
            aria-label="Buscar ministérios"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto"></div>
      </div>

      {/* Grid de cards (cada card navega para o slug) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((m) => (
          <Link
            key={m.id}
            href={buildMinistryHref(m.slug)}
            aria-label={`Abrir ministério ${m.name}`}
            className=" text-white group block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-2xl"
          >
            <Card className="bg-black/60 border-white/10 transition-all duration-300 will-change-transform group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-white/5 group-hover:border-white/30">
              <div className="absolute inset-0">
                <Image
                  src={getCardBackground(m)}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-all duration-500 group-hover:brightness-110 group-hover:scale-100 rounded-2xl"
                  priority={false}
                />
                {/* Scrim leve só embaixo para legibilidade */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-black/70 via-transparent to-transparent" />
              </div>
              <CardHeader className="relative z-10 flex-row items-center gap-3">
    <div className="shrink-0 p-2">
                  <MinistryIcon name={m.icon} className="h-5 text-white w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2 text-white">
                    {m.name}
                    <ChevronRight className="h-4 w-4 opacity-60 transition-transform duration-300 group-hover:translate-x-1" />
                  </CardTitle>
                  {m.tags && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {m.tags.map((t) => (
                        <Badge
                          key={t}
                          variant="secondary"
                          className="bg-white/10 text-white hover:bg-white/20"
                        >
                          #{t}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground min-h-[48px]">
                  {m.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
