import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        full_name: { label: "Full Name", type: "text" }
      },
      async authorize(credentials, req: any) {
        const isSignUp = req?.body?.action === "signUp"
        const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        
        try {
          const url = `${BACKEND_URL}/api/auth/${isSignUp ? "register" : "login"}`

          const body: Record<string, string> = {
            email: credentials?.email as string,
            password: credentials?.password as string
          }

          if (isSignUp && credentials?.full_name) {
            body.full_name = credentials.full_name as string
          }

          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          })

          if (!res.ok) {
            const error = await res.json()
            throw new Error(error.detail || "Authentication failed")
          }

          const user = await res.json()

          return {
            id: user.id,
            email: user.email,
            name: user.full_name,
            token: user.token
          }
        } catch (error: any) {
          console.error("Auth error:", error.message)
          throw new Error(error.message || "Authentication failed")
        }
      }
    })
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.token = user.token
      }
      if (trigger === "update" && session) {
        return { ...token, ...session }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
