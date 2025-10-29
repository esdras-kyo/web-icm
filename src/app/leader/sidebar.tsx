'use client'
import { Bell, DollarSign, House, Info, Mail, Menu, Settings, ShoppingBag, ShoppingCart, Users, Castle, Ticket, HeartHandshake } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"


type SidebarItem = {
    name:string,
    icon: string,
    href: string
}
const ALL_ITEMS: SidebarItem[] = [
    { name: "Painel",         href: "/leader",   icon: "House" },
    { name: "Membros",        href: "/leader/members",    icon: "Users" },
    { name: "Cells",           href: "/leader/cells",     icon: "HeartHandshake"},
    { name: "Departamentos",  href: "/leader/departments",icon: "Castle" },
    { name: "Pedidos",        href: "/leader/requests",   icon: "Mail" },
    { name: "Eventos",        href: "/leader/events",     icon: "Ticket" },
  ]

const ICONS = {
    House,
    DollarSign,
    Settings,
    Mail,
    Users,
    Bell,
    Info,
    ShoppingBag,
    ShoppingCart,
    Castle,
    Ticket,
    HeartHandshake
}


const Sidebar = () =>{
    const [isSidebaropen, setSidebarOpen] = useState(false)
    const visibleItems: SidebarItem[] = (() => {
      //  if (isAdmin) return ALL_ITEMS

          const blocked = new Set(['/leader/members', '/leader/events'])
          return ALL_ITEMS.filter(i => !blocked.has(i.href))
        
        // visitante/sem role
        return ALL_ITEMS.filter(i => i.href === "/leader/sudoDash")
      })()
      
    const pathname = usePathname()

    return(
    <div className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebaropen ? "w-64": "w-20"} text-white `}>
        <div className="h-full bg-[#1e1e1e] backdrop-blur-md p-4 flex flex-col border-r border-[#2f2f2f] ">
            <button onClick={()=>{setSidebarOpen(!isSidebaropen)}} className="p-2 rounded-full hover:bg-[#2f2f2f] max-w-fit cursor-pointer transition-colors">
                <Menu/>
            </button>
            <nav className="mt-8 flex-grow">
                {visibleItems.map((item)=>{
                    const IconComponent = ICONS[item?.icon as keyof typeof ICONS]
                    return(
                        <Link key={item.name} href={item.href}>
                            <div className={`flex items-center p-4 text-sm font-bold rounded-lg hover:bg-[#2f2f2f] transition-colors mb-2 ${pathname === item.href ? "bg-[#2f2f2f]" : ""}`}>
                                <IconComponent size={20} style={{ minWidth: "20px"}}/>  
                                {isSidebaropen ? <span className="ml-4 whitespace-nowrap">{item.name}</span> : null}
                                
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