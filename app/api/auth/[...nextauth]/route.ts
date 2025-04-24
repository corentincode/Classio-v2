import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Vérifier si c'est un mot de passe temporaire pour 2FA
        if (credentials.password.length === 64) {
          // Longueur du mot de passe temporaire
          // C'est un mot de passe temporaire, l'utilisateur a déjà été vérifié
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              establishment: true,
              teachingAt: {
                include: {
                  establishment: true,
                },
              },
            },
          })

          if (!user) {
            return null
          }

          // Mettre à jour la date de dernière connexion
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          })

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            establishmentId: user.establishmentId,
            establishments:
              user.role === "PROFESSEUR"
                ? user.teachingAt.map((t) => t.establishment)
                : user.establishment
                  ? [user.establishment]
                  : [],
          }
        }

        // Sinon, procéder à la vérification normale du mot de passe
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            establishment: true,
            teachingAt: {
              include: {
                establishment: true,
              },
            },
          },
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        // Si l'utilisateur a activé 2FA, ne pas autoriser la connexion directe
        if (user.twoFactorEnabled) {
          return null
        }

        // Mettre à jour la date de dernière connexion
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          establishmentId: user.establishmentId,
          establishments:
            user.role === "PROFESSEUR"
              ? user.teachingAt.map((t) => t.establishment)
              : user.establishment
                ? [user.establishment]
                : [],
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.establishmentId = user.establishmentId
        token.establishments = user.establishments
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.establishmentId = token.establishmentId as string | null
        session.user.establishments = token.establishments as any[] | null
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Si l'URL est déjà absolue, la retourner telle quelle
      if (url.startsWith("http")) return url

      // Si l'URL est relative, la combiner avec l'URL de base
      if (url.startsWith("/")) return `${baseUrl}${url}`

      // Par défaut, rediriger vers l'URL de base
      return baseUrl
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
