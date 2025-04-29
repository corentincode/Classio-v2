import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { ProfesseurSchedule } from "@/components/professeur/professeur-schedule"

const prisma = new PrismaClient()

export default async function ProfesseurSchedulePage({
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

  // Récupérer l'ID de l'utilisateur
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })

  if (!user) {
    redirect("/auth/signin")
  }

  // Vérifier si le professeur a accès à cet établissement
  const professorEstablishment = await prisma.establishmentProfessor.findFirst({
    where: {
      professorId: user.id,
      establishmentId: establishmentId,
    },
  })

  if (!professorEstablishment) {
    redirect("/professeur/select-establishment")
  }

  // Récupérer les sessions du professeur pour la semaine en cours
  const startOfWeek = new Date()
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1) // Lundi
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(endOfWeek.getDate() + 6) // Dimanche
  endOfWeek.setHours(23, 59, 59, 999)

  const sessions = await prisma.session.findMany({
    where: {
      course: {
        professorId: user.id,
        class: {
          establishmentId: establishmentId,
        },
      },
      startTime: {
        gte: startOfWeek,
        lte: endOfWeek,
      },
    },
    include: {
      course: {
        select: {
          id: true,
          name: true,
          color: true,
          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  })

  // Récupérer les cours du professeur pour filtrer
  const courses = await prisma.course.findMany({
    where: {
      professorId: user.id,
      class: {
        establishmentId: establishmentId,
      },
    },
    select: {
      id: true,
      name: true,
      color: true,
      class: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mon emploi du temps</h1>
      <ProfesseurSchedule 
        sessions={sessions} 
        courses={courses} 
        establishmentId={establishmentId} 
      />
    </div>
  )
}
