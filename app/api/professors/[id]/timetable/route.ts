import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Récupérer toutes les sessions pour l'emploi du temps d'un professeur
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Récupérer l'ID de l'établissement depuis les paramètres de requête
    const url = new URL(request.url)
    const establishmentId = url.searchParams.get("establishmentId")

    if (!establishmentId) {
      return NextResponse.json({ error: "Establishment ID is required" }, { status: 400 })
    }

    // Vérifier si l'utilisateur est autorisé à accéder à ces données
    if (session.user.id !== params.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Récupérer tous les cours enseignés par ce professeur dans cet établissement
    const courses = await prisma.course.findMany({
      where: {
        professorId: params.id,
        class: {
          establishmentId: establishmentId,
        },
      },
      include: {
        professor: {
          select: {
            id: true,
            email: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        sessions: true,
      },
    })

    // Formater les sessions pour l'emploi du temps
    const timetableSessions = courses.flatMap((course) =>
      course.sessions.map((session) => ({
        id: session.id,
        title: session.title,
        description: session.description,
        dayOfWeek: session.dayOfWeek,
        startTime: session.startTime,
        endTime: session.endTime,
        recurrent: session.recurrent,
        room: session.room,
        course: {
          id: course.id,
          name: course.name,
          color: course.color,
          professor: course.professor,
          class: course.class,
        },
      })),
    )

    return NextResponse.json(timetableSessions)
  } catch (error) {
    console.error("Error fetching timetable:", error)
    return NextResponse.json({ error: "An error occurred while fetching the timetable" }, { status: 500 })
  }
}
