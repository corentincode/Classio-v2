import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import prisma from "@/lib/prisma"

export default async function ProfesseurEvaluationsPage({
  searchParams,
}: {
  searchParams: { establishmentId?: string }
}) {
  // Vérifier l'authentification
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  // Récupérer l'ID de l'établissement depuis les paramètres de recherche
  let establishmentId = searchParams.establishmentId

  // Si pas d'ID d'établissement dans les paramètres, récupérer l'établissement actuel de l'utilisateur
  if (!establishmentId) {
    const userEstablishment = await prisma.userEstablishment.findFirst({
      where: {
        userId: session.user.id,
        isActive: true,
      },
    })

    if (userEstablishment) {
      establishmentId = userEstablishment.establishmentId
    } else {
      redirect("/professeur/select-establishment")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Évaluations</h1>
        <Button variant="outline" asChild>
          <Link href={`/professeur/courses?establishmentId=${establishmentId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux cours
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground mb-4">
            Veuillez sélectionner un cours pour voir ou créer des évaluations.
          </p>
          <div className="flex justify-center">
            <Button asChild>
              <Link href={`/professeur/courses?establishmentId=${establishmentId}`}>Voir mes cours</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
