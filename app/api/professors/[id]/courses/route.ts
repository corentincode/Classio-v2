import { NextResponse } from "next/server"
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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Récupérer l'ID du professeur et de l'établissement
    const professorId = params.id
    const url = new URL(request.url)
    const establishmentId = url.searchParams.get("establishmentId")

    if (!establishmentId) {
      return NextResponse.json({ error: "ID d'établissement manquant" }, { status: 400 })
    }

    // Vérifier si l'utilisateur est autorisé à accéder à ces données
    if (session.user.id !== professorId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    // Récupérer tous les cours enseignés par ce professeur dans cet établissement
    const courses = await prisma.course.findMany({
      where: {
        professorId: professorId,
        class: {
          establishmentId: establishmentId,
        },
      },
      include: {
        class: true,
        sessions: true,
      },
    })

    // Formater les données pour l'emploi du temps
    const sessions = courses.flatMap((course, index) => {
      return course.sessions.map((session) => ({
        id: session.id,
        courseName: course.name,
        className: course.class.name,
        dayOfWeek: session.dayOfWeek,
        startTime: session.startTime,
        endTime: session.endTime,
        room: session.room || "Non spécifiée",
        color: courseColors[index % courseColors.length],
      }))
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Erreur lors de la récupération des cours:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de la récupération des cours" }, { status: 500 })
  }
}
