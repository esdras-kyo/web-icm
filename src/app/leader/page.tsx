import { auth, currentUser } from '@clerk/nextjs/server'

export default async function Leader(){
    const { isAuthenticated } = await auth()
    if (!isAuthenticated) {
        return <div>Entre com sua conta para acessar essa página</div>
      }

    const user = await currentUser()

    return(
        <div className="justify-start items-start px-20 flex w-full flex-col min-h-dvh bg-gradient-to-br gap-2 text-white from-sky-800">
            {/* {isOrgAdmin && <h1>Modo ADM on</h1>} */}
            <h1>wilcomen, {user?.firstName}</h1>
            <h1>email: {user?.fullName}</h1>

        </div>
    )
}