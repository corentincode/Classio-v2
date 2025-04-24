"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Building, MapPin, Mail, Phone, Globe, Users } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EditEstablishmentForm } from "@/components/dashboard/edit-establishment-form"

// Cette fonction s'exécute côté serveur
async function getEstablishmentData(id: string) {
  const prisma = new PrismaClient()

  // Get establishment details
  const establishment = await prisma.establishment.findUnique({
    where: { id },
  })

  if (!establishment) {
    return null
  }

  // Get users count for this establishment
  const usersCount = await prisma.user.count({
    where: { establishmentId: id },
  })

  // Get professors count for this establishment
  const professorsCount = await prisma.establishmentProfessor.count({
    where: { establishmentId: id },
  })

  return {
    establishment,
    usersCount,
    professorsCount,
  }
}

// Composant client qui utilise les données du serveur
export default function EstablishmentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // Fonction pour supprimer l'établissement
  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/establishments/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Échec de la suppression de l'établissement")
      }

      toast({
        title: "Établissement supprimé",
        description: "L'établissement a été supprimé avec succès.",
      })

      // Rediriger vers la liste des établissements
      router.push("/dashboard/etablissements")
    } catch (error) {
      console.error("Error deleting establishment:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression de l'établissement.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  // Fonction pour gérer les utilisateurs
  const handleManageUsers = () => {
    router.push(`/dashboard/etablissements/${params.id}/users`)
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/etablissements">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Détails de l'établissement</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
            Modifier
          </Button>
          <Button variant="outline" className="text-red-500" onClick={() => setDeleteDialogOpen(true)}>
            Supprimer
          </Button>
        </div>
      </div>

      {/* Le contenu sera chargé dynamiquement côté client */}
      <EstablishmentContent id={params.id} onManageUsers={handleManageUsers} />

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet établissement ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Tous les utilisateurs associés à cet établissement seront affectés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={isDeleting}>
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Formulaire de modification */}
      <EditEstablishmentForm id={params.id} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
    </div>
  )
}

// Composant client pour charger les données de l'établissement
function EstablishmentContent({ id, onManageUsers }: { id: string; onManageUsers: () => void }) {
  const [data, setData] = useState<{
    establishment: any
    usersCount: number
    professorsCount: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger les données de l'établissement
  useState(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/establishments/${id}`)
        if (!response.ok) {
          throw new Error("Impossible de charger les données de l'établissement")
        }
        const establishmentData = await response.json()

        // Charger le nombre d'utilisateurs
        const usersResponse = await fetch(`/api/establishments/${id}/users/count`)
        const usersData = await usersResponse.json()

        setData({
          establishment: establishmentData,
          usersCount: usersData.usersCount || 0,
          professorsCount: usersData.professorsCount || 0,
        })
      } catch (error) {
        console.error("Error fetching establishment data:", error)
        setError("Une erreur s'est produite lors du chargement des données")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return <div>Chargement des données...</div>
  }

  if (error || !data) {
    return <div className="text-red-500">{error || "Impossible de charger les données"}</div>
  }

  const { establishment, usersCount, professorsCount } = data

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Informations générales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Code établissement</p>
              <p className="font-medium">{establishment.code}</p>
            </div>

            {establishment.address && (
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> Adresse
                </p>
                <p className="font-medium">{establishment.address}</p>
                <p>
                  {establishment.zipCode} {establishment.city}, {establishment.country || ""}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {establishment.email && (
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-4 w-4" /> Email
                </p>
                <p className="font-medium">{establishment.email}</p>
              </div>
            )}

            {establishment.phone && (
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-4 w-4" /> Téléphone
                </p>
                <p className="font-medium">{establishment.phone}</p>
              </div>
            )}

            {establishment.website && (
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Globe className="h-4 w-4" /> Site web
                </p>
                <a
                  href={
                    establishment.website.startsWith("http")
                      ? establishment.website
                      : `https://${establishment.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  {establishment.website}
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Utilisateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Nombre d'utilisateurs</p>
              <p className="text-2xl font-bold">{usersCount}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Nombre de professeurs</p>
              <p className="text-2xl font-bold">{professorsCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full sm:w-auto" onClick={onManageUsers}>
              Gérer les utilisateurs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
