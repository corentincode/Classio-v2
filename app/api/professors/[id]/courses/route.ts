import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

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

    // Vérifier si l'utilisateur est autorisé à accéder à ces données
    if (session.user.id !== professorId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    // Récupérer tous les cours enseignés par ce professeur
    const coursesQuery = {
      where: {
        professorId: professorId,
      },
      include: {
        class: {
          include: {
            establishment: true,
            students: {
              select: {
                id: true,
              },
            },
          },
        },
        sessions: true,
      },
    }

    // Si un establishmentId est fourni, filtrer par établissement
    if (establishmentId) {
      coursesQuery.where = {
        ...coursesQuery.where,
        class: {
          establishmentId: establishmentId,
        },
      }
    }

    const courses = await prisma.course.findMany(coursesQuery)

    // Formater les données pour l'affichage
    const formattedCourses = courses.map((course, index) => {
      return {
        id: course.id,
        name: course.name,
        description: course.description,
        color: courseColors[index % courseColors.length],
        class: {
          id: course.class.id,
          name: course.class.name,
          level: course.class.level,
          section: course.class.section,
        },
        establishment: {
          id: course.class.establishment.id,
          name: course.class.establishment.name,
        },
        sessionsCount: course.sessions.length,
        studentsCount: course.class.students.length,
      }
    })

    return NextResponse.json(formattedCourses)
  } catch (error) {
    console.error("Erreur lors de la récupération des cours:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de la récupération des cours" }, { status: 500 })
  }
}
