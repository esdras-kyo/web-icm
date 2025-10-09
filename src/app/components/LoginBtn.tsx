"use client"

import { signIn } from "next-auth/react"

export function LoginBtn(){
    return(
        <button className="p-2 border border-amber-200 rounded-lg" onClick={()=> signIn("google", {callbackUrl: "/leader"})}>
            fazer login
        </button>
    )
}