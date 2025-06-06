"use client"

import type React from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && session?.user?.role !== "ADMINISTRATION") {
      // Rediriger vers le dashboard approprié en fonction du rôle
      switch (session?.user?.role) {
        case "ELEVE":
          router.push("/eleve")
          break
        case "PARENT":
          router.push("/parent")
          break
        case "SUPERADMIN":
          router.push("/dashboard")
          break
        default:
          router.push("/auth/signin")
      }
    }
  }, [status, session, router])

  // Afficher un état de chargement pendant la vérification de l'authentification
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

// Ne pas rendre le contenu si l'utilisateur n'est pas authentifié ou n'a pas le rôle ADMINISTRATION
if (!session || session.user?.role !== "ADMINISTRATION") {
  return null
}

  // L'utilisateur est authentifié, afficher le contenu du dashboard
  return <AdminShell>{children}</AdminShell>
}