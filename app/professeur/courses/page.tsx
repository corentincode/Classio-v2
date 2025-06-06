import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { ProfesseurCoursesList } from "@/components/professeur/professeur-courses-list"

export default async function ProfesseurCoursesPage({
  searchParams,
}: {
  searchParams: { establishmentId?: string }
}) {
  // Vérifier l'authentification
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  // Récupérer l'ID de l'établissement directement depuis l'URL
  const establishmentId = searchParams.establishmentId

  // Si pas d'ID d'établissement, rediriger vers la sélection
  if (!establishmentId) {
    redirect("/professeur/select-establishment")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mes cours</h1>
      <ProfesseurCoursesList userId={session.user.id} />
    </div>
  )
}
