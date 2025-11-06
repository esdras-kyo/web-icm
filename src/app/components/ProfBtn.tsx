"use client"
import { User2 } from "lucide-react"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'


export default function ProfBtn(){
    // const route = useRouter()
    // const [isOpen, setIsOpen] = useState(false)


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