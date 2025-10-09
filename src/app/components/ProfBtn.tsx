"use client"
import { signIn, useSession } from "next-auth/react"
import { User2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function ProfBtn(){
    const route = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const { data: session, status, update } = useSession()
    const alreadyUpdated = useRef(false)
    useEffect(()=>{
        if(alreadyUpdated.current) return
        if (status === "authenticated") {
            update()
          }
         alreadyUpdated.current = true
    },[status, update])
    const isOrgAdmin = session?.user?.roles?.some(
        (r) => r.role === "ADMIN" && r.scope_type === "ORG"
      )

    return(
        <div className="">
            <div onClick={()=>{setIsOpen(!isOpen)}} className="rounded-full cursor-pointer w-8 h-8 border items-center flex justify-center p-2">
                {!session ? <User2 color="gray" /> : <User2 color="green"/> }
            </div>
            {isOpen ? 
             <div
             className="absolute right-4 mt-2 w-40 bg-black/80 text-white rounded-md shadow-lg backdrop-blur p-2 flex flex-col gap-2 z-50"
           >
           {!session ? <button className="text-left hover:bg-white/10  cursor-pointer  rounded px-2 py-1 text-sm" onClick={()=>signIn("google", {callbackUrl: "/leader"})}>Login</button> :
           <div className="flex flex-col gap-2" >
             {/* <button className="text-left hover:bg-white/10  cursor-pointer rounded px-2 py-1 text-sm"><p>
                
        Roles:{" "}
        {session.user?.roles?.map((r) => (
          <span key={r.role}>
            {r.role} ({r.scope_type})
          </span>
        ))}
      </p></button> */}
     { isOrgAdmin && <button  className="text-left hover:bg-white/10  cursor-pointer rounded px-2 py-1 text-sm" 
     onClick={()=>{route.push("/leader/sudoDash")}} >Painel</button>}
      
             <button className="text-left hover:bg-white/10  cursor-pointer rounded px-2 py-1 text-sm" onClick={()=>{signOut()}}>Logout</button>   
             </div>
           }       
           </div>
           
            : null}

        </div>
    )
}