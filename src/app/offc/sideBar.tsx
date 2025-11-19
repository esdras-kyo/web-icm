'use client'
import { Menu, Castle, User2, HomeIcon, Users2, CalendarPlus2, BlocksIcon, PartyPopper } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

type SidebarItem = {
  name: string,
  icon: string,
  href: string
}

const ALL_ITEMS: SidebarItem[] = [
  { name: "Painel", href: "/offc", icon: "HomeIcon" },
  { name: "Membros", href: "/offc/users", icon: "Users2" },
  {name: "Agenda", href: "/offc/agenda", icon: "CalendarPlus2"},
  {name: "Celp", href: "/offc/cells", icon: "BlocksIcon"},
  {name: "Eventos", href: "/offc/events", icon: "PartyPopper"}
]

const ICONS = { Castle, User2, HomeIcon, Users2, CalendarPlus2, BlocksIcon, PartyPopper }

const Sidebar = () => {
  const [isSidebaropen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  useEffect(() => {

    const mq = window.matchMedia("(min-width: 768px)")
    const apply = () => setSidebarOpen(mq.matches)
    apply()

    mq.addEventListener?.("change", apply)
    return () => mq.removeEventListener?.("change", apply)
  }, [])

  return (
    <div
      className={`relative z-10 transition-[width] duration-200 ease-out shrink-0 ${
        isSidebaropen ? "w-64" : "w-20"
      } text-white`}
    >
      <div
        className={
          "h-full bg-black md:backdrop-blur-md p-4 flex flex-col border-r border-[#2f2f2f]"
        }
      >
        <button
          onClick={() => { setSidebarOpen(!isSidebaropen) }}
          className="p-2 rounded-full md:hidden hover:bg-[#2f2f2f] max-w-fit cursor-pointer transition-colors"
        >
          <Menu />
        </button>

        <nav className="mt-8 grow">
          {ALL_ITEMS.map((item) => {
            const IconComponent = ICONS[item.icon as keyof typeof ICONS]
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center p-4 text-sm font-bold rounded-lg hover:bg-[#2f2f2f] transition-colors mb-2 ${
                    pathname === item.href ? "bg-zinc-900" : ""
                  }`}
                >
                  <IconComponent size={20} style={{ minWidth: "20px" }} />
                  {isSidebaropen ? (
                    <span className="ml-4 whitespace-nowrap">{item.name}</span>
                  ) : null}
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar