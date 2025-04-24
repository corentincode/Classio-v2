"use client"

import type React from "react"
import { ProfesseurShell } from "@/components/professeur/professeur-shell"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

export default function ProfesseurLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentEstablishment, setCurrentEstablishment] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ProfesseurLayoutContent
        children={children}
        setCurrentEstablishment={setCurrentEstablishment}
        currentEstablishment={currentEstablishment}
        setLoading={setLoading}
        loading={loading}
      />
    </Suspense>
  )
}

function ProfesseurLayoutContent({
  children,
  setCurrentEstablishment,
  currentEstablishment,
  setLoading,
  loading,
}: {
  children: React.ReactNode
  setCurrentEstablishment: any
  currentEstablishment: any
  setLoading: any
  loading: any
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const establishmentId = searchParams.get("establishmentId")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && session?.user?.role !== "PROFESSEUR") {
      // Rediriger vers le dashboard approprié en fonction du rôle
      switch (session?.user?.role) {
        case "ELEVE":
          router.push("/eleve")
          break
        case "PARENT":
          router.push("/parent")
          break
        case "ADMINISTRATION":
          router.push("/admin")
          break
        case "SUPERADMIN":
          router.push("/dashboard")
          break
        default:
          router.push("/auth/signin")
      }
    }
  }, [status, session, router])

  // Vérifier si un establishmentId est fourni
  useEffect(() => {
    const fetchEstablishmentDetails = async () => {
      if (status !== "authenticated" || !session || !establishmentId) return

      try {
        setLoading(true)
        const response = await fetch(`/api/establishments/${establishmentId}`)

        if (response.ok) {
          const data = await response.json()
          setCurrentEstablishment(data)
        } else {
          // Si l'établissement n'existe pas ou l'utilisateur n'y a pas accès
          router.push("/professeur/select-establishment")
        }
      } catch (error) {
        console.error("Error fetching establishment details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.role === "PROFESSEUR") {
      if (!establishmentId) {
        // Ne pas rediriger ici si nous sommes déjà sur la page de sélection
        if (
          !window.location.pathname.includes("/professeur/select-establishment") &&
          !window.location.pathname.includes("/professeur/no-establishment")
        ) {
          router.push("/professeur/select-establishment")
        }
        setLoading(false)
      } else {
        fetchEstablishmentDetails()
      }
    }
  }, [status, session, establishmentId, router])

  // Afficher un état de chargement pendant la vérification de l'authentification
  if (status === "loading" || (loading && establishmentId)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  // Si nous sommes sur la page de sélection d'établissement ou la page "no-establishment",
  // rendre directement les enfants sans le shell
  if (
    window.location.pathname.includes("/professeur/select-establishment") ||
    window.location.pathname.includes("/professeur/no-establishment")
  ) {
    return <>{children}</>
  }

  // Ne pas rendre le contenu si l'utilisateur n'est pas authentifié ou n'a pas le rôle PROFESSEUR
  // ou si nous avons besoin d'un établissement mais n'en avons pas
  if (!session || session.user?.role !== "PROFESSEUR" || (establishmentId && !currentEstablishment)) {
    return null
  }

  // L'utilisateur est authentifié, afficher le contenu du dashboard
  return <ProfesseurShell establishment={currentEstablishment}>{children}</ProfesseurShell>
}
