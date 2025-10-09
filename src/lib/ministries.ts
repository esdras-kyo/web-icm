// lib/ministries.ts
export type Ministry = {
    id: string;
    name: string;
    slug: string;
    description: string;
    leader?: string;
    meeting?: string;
    whatsapp?: string;
    image?: string;
    tags?: string[];
    icon?: string;
  };
  
  export const MINISTRIES: Ministry[] = [
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
      image: "/images/icmpioneiros.jpeg",
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
  
  // Helper para buscar por slug
  export function getMinistryBySlug(slug: string): Ministry | null {
    return MINISTRIES.find((m) => m.slug === slug) ?? null;
  }