import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string | null
      name?: string | null
      email?: string | null
      image?: string | null
      roles: Array<{ role: string; scope_type: string | null; department_id: number | null }>
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string
    roles?: Array<{ role: string; scope_type: string | null; department_id: number | null }>
    _fetchedAt?: number
  }
}

