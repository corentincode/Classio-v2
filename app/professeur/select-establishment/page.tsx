"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, School } from "lucide-react"

type Establishment = {
  id: string
  name: string
  code: string
  city?: string | null
}

export default function ProfessorSelectEstablishmentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [establishments, setEstablishments] = useState<Establishment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    const fetchEstablishments = async () => {
      if (status !== "authenticated" || !session) return

      try {
        setLoading(true)
        const response = await fetch("/api/user/establishments")

        if (!response.ok) {
          throw new Error("Failed to fetch establishments")
        }

        const data = await response.json()
        setEstablishments(data)
      } catch (err) {
        console.error("Error fetching establishments:", err)
        setError("Impossible de charger les établissements")
      } finally {
        setLoading(false)
      }
    }

    fetchEstablishments()
  }, [session, status])

  const handleSelectEstablishment = (id: string) => {
    router.push(`/professeur?establishmentId=${id}`)
  }

  if (status === "loading" || loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Sélectionner un établissement</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Sélectionner un établissement</h1>
        <div className="bg-red-50 p-4 rounded-md text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sélectionner un établissement</h1>

      {establishments.length === 0 ? (
        <div className="bg-yellow-50 p-4 rounded-md text-yellow-700">
          Vous n'êtes associé à aucun établissement. Veuillez contacter l'administrateur.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {establishments.map((establishment) => (
            <Card key={establishment.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5 text-indigo-500" />
                  {establishment.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {establishment.city && (
                  <p className="text-sm text-gray-500 mb-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {establishment.city}
                  </p>
                )}
                <Button onClick={() => handleSelectEstablishment(establishment.id)} className="w-full">
                  Accéder
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
