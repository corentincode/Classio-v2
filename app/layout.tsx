import "./globals.css"
import { Inter } from "next/font/google"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route"
import ClientLayout from "./client-layout"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SecureAuth - Modern Authentication System",
  description: "A secure and user-friendly authentication system built with Next.js",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 text-gray-900 antialiased`}>
        <ClientLayout session={session}>{children}</ClientLayout>
      </body>
    </html>
  )
}

