'use client'

import { LogOutIcon } from "lucide-react"
import { signOut } from "next-auth/react"

export default function ButtonLogout() {
  return (
    <button className="text-gray-400 hover:text-white cursor-pointer p-2 rounded-lg hover:bg-gray-500 flex" onClick={()=> signOut()}><LogOutIcon width={20} height={20}/></button>
  )
}
