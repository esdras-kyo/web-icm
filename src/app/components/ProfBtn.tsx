"use client"
import { signIn, useSession } from "next-auth/react"
import { User2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { signOut } from "next-auth/react"
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
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
   
            <SignedIn>
            <UserButton
     userProfileUrl="/conta" // possivel rota de perfil

    >
      <UserButton.MenuItems>
        {/* Link direto pro painel de líder */}
        <UserButton.Link label="Painel do Líder" href="/leader" labelIcon={<User2 className="w-4"/>} />

      </UserButton.MenuItems>
    </UserButton>
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>

        </div>
    )
}