import {
  HomeIcon,
  Users2,
  CalendarPlus2,
  BlocksIcon,
  PartyPopper,
  Images,
  ScrollText
} from "lucide-react";
import DashboardSidebar, { SidebarItem } from "./DashboardSidebar";

const items: SidebarItem[] = [
  { name: "Painel", href: "/offc", icon: HomeIcon },
  { name: "Membros", href: "/offc/users", icon: Users2 },
  { name: "Agenda", href: "/offc/agenda", icon: CalendarPlus2 },
  { name: "Relatórios", href: "/offc/relatorios", icon: ScrollText },
  { name: "Células", href: "/offc/cells", icon: BlocksIcon },
  { name: "Eventos", href: "/offc/events", icon: PartyPopper },
  { name: "Galeria", href: "/offc/galeria", icon: Images },
];

export default function OffcSidebar() {
  return (
    <DashboardSidebar
      items={items}
      theme={{
        bg: "bg-black",
        border: "border-r border-[#2f2f2f]",
        hover: "hover:bg-[#2f2f2f]",
        active: "bg-zinc-900",
      }}
    />
  );
}