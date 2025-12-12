import {
  House,
  CalendarPlus2,
  FileText,
  HeartHandshake,
  Castle,
} from "lucide-react";
import DashboardSidebar, { SidebarItem } from "./DashboardSidebar";

const items: SidebarItem[] = [
  { name: "Painel", href: "/leader", icon: House },
  { name: "Agenda", href: "/leader/agenda", icon: CalendarPlus2 },
  { name: "Materiais", href: "/leader/files", icon: FileText },
  { name: "Cells", href: "/leader/cells", icon: HeartHandshake },
  { name: "Departamentos", href: "/leader/departments", icon: Castle },
];

export default function LeaderSidebar() {
  return (
    <DashboardSidebar
      items={items}
      theme={{
        bg: "bg-[#1e1e1e]",
        border: "border-r border-[#2a2a2a]",
        hover: "hover:bg-[#2f2f2f]",
        active: "bg-[#2f2f2f]",
      }}
    />
  );
}