import { Bell } from "lucide-react"
import { getServerSession } from "next-auth"
import Image from "next/image"
import adm from "../../../public/images/sonicpray.jpg"
import ButtonLogout from "../components/ButtonLogOut"
import { redirect } from "next/navigation"
const Header = async () => {
    const session = await getServerSession()
    if(!session){
        redirect("/teste");
    }

    return(
        <header className=" mt- mb-2 rounded-lg bg-[#1e1e1e] shadow-lg border-b border-[#1f1f1f] mx-4 sm:mx-6 lg:mx-8">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 flex items-center justify-between">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-200">
                    Dashboard
                </h1>
            <div className="flex items-center space-x-3 sm:space-x-6">
                <div className="relative">
                    <Bell className="w-5 sm:w-6 h-5 sm:h-6 text-gray-300 hover:text-white cursor-pointer"/>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 ">
                    <Image src={adm} alt="admin" width={35} height={35} className="cursor-pointer rounded-full border border-gray-200"/>
                <span className="hidden sm:block text-gray-200 font-bold">{session ? String(session?.user?.name) : "Fulano de Tao"}</span>
                <ButtonLogout/>
                </div>
                </div>
            </div>
        </header>
    )
}
export default Header