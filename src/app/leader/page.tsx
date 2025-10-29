import { auth, currentUser } from '@clerk/nextjs/server'
import { PdfCloudList } from '../components/PdfList'

export default async function Leader(){
    const { isAuthenticated } = await auth()
    if (!isAuthenticated) {
        return <div>Entre com sua conta para acessar essa página</div>
      }

    const user = await currentUser()

    return(
        <div className="justify-start items-start flex w-full flex-col min-h-dvh text-white">
            {/* {isOrgAdmin && <h1>Modo ADM on</h1>} */}
            <div className='flex w-full items-center justify-center  border-b border-zinc-600 mb-4 py-2'> <h1 className='text-3xl font-semibold mb-2'>Painel</h1></div>
            <h1 className='text-md font-light relative mb-4'>Bem vindo, {user?.fullName}!</h1>


                <PdfCloudList /></div>


    )
}