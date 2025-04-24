import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Couleurs pour les différentes matières
const courseColors = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  // Vérifier si l'utilisateur est autorisé à accéder à ces données
  if (session.user.id !== params.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const establishmentId = searchParams.get("establishmentId")

  if (!establishmentId) {
    return NextResponse.json({ error: "ID d'établissement manquant" }, { status: 400 })
  }

  try {
    // Récupérer tous les cours enseignés par ce professeur
    const professorCourses = await prisma.course.findMany({
      where: {
        professorId: params.id,
        class: {
          establishmentId: establishmentId,
        },
      },
      include: {
        sessions: true,
        class: true,
      },
    })

    // Transformer les données pour l'affichage dans l'emploi du temps
    const sessions = professorCourses.flatMap((course, courseIndex) => {
      return course.sessions.map((session) => {
        // Convertir le jour de la semaine (0-6) en nom de jour
        const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
        const day = days[session.dayOfWeek]

        // Formater les heures
        const formatTime = (date: Date) => {
          return date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        }

        return {
          id: session.id,
          title: `${course.name} (${course.class.name})`,
          startTime: formatTime(session.startTime),
          endTime: formatTime(session.endTime),
          day,
          room: session.room || "Salle non spécifiée",
          courseId: course.id,
          courseName: course.name,
          color: courseColors[courseIndex % courseColors.length],
        }
      })
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de la récupération des sessions" }, { status: 500 })
  }
}
