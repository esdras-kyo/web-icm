import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function Leader(){
    const session = await getServerSession(authOptions)

    if(!session){
        return redirect("/teste")
    }

    return(
        <div className="justify-start items-start px-20 flex w-full flex-col min-h-dvh bg-gradient-to-br gap-2 text-white from-sky-800">
            {/* {isOrgAdmin && <h1>Modo ADM on</h1>} */}
            <h1>wilcomen, {session.user?.name}</h1>
            <h1>email: {session.user?.email}</h1>
            <h1>roles: {session.user?.roles?.map(r => r.role).join(", ")}</h1>
        </div>
    )
}