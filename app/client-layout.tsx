"use client"

import { SessionProvider } from "next-auth/react"
import Link from "next/link"
import type React from "react" // Import React

export default function ClientLayout({ children, session }: { children: React.ReactNode; session: any }) {
  return (
    <SessionProvider session={session}>
        <main>{children}</main>
    </SessionProvider>
  )
}

