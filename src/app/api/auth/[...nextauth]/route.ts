import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { createSupabaseAdmin } from "@/utils/supabase/admin"

const supabase = createSupabaseAdmin()
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
        if (!user?.email) return false
        const email = user.email.toLowerCase().trim()
    
        const { data: u, error: upsertErr } = await supabase
          .from("users")
          .upsert({ email, name: user.name ?? null }, { onConflict: "email" })
          .select("id")
          .single()
        if (upsertErr) {
          console.error("users upsert error:", upsertErr)
          return false
        }
    
        const { count, error: countErr } = await supabase
          .from("role_assignments")
          .select("id", { count: "exact", head: true })
          .eq("user_id", u.id)
        if (countErr) {
          console.error("role count error:", countErr)
          return false
        }
        if (!count || count === 0) {
          const { error: insertErr } = await supabase
            .from("role_assignments")
            .insert({
              user_id: u.id,
              role: "MEMBER",
              scope_type: "ORG",
              department_id: null,
            })
          if (insertErr) {
            console.error("insert default role error:", insertErr)
            return false
          }
        }
    
        return true 
      },
    async jwt({ token, user, account}) {
      const shouldFetchOnSignIn = Boolean(user || account)

      if (shouldFetchOnSignIn) {
        const emailRaw = (token.email as string) ?? user?.email
        const email = emailRaw?.toLowerCase().trim()
        if (!email) return token

        const { data: row, error } = await supabase
          .from("users")
          .select("id, email, name")
          .eq("email", email)
          .maybeSingle()

        if (error) {
          console.error("users select error:", error)
          return token
        }

        let roles: Array<{ role: string; scope_type: string | null; department_id: number | null }> = []
        if (row?.id) {
          const { data: roleRows, error: roleErr } = await supabase
            .from("role_assignments")
            .select("role, scope_type, department_id")
            .eq("user_id", row.id)
          if (roleErr) console.error("roles select error:", roleErr)
          roles = roleRows ?? []
        }

        token.uid = row?.id
        token.name = row?.name ?? token.name ?? null
        token.roles = roles
        token._fetchedAt = Date.now()
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.uid as string) ?? null
        session.user.name = (token.name as string) ?? session.user.name ?? null
        session.user.roles = token.roles ?? []
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }