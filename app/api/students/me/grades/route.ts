import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// Récupérer toutes les notes de l'élève connecté
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const url = new URL(request.url)
  const periodId = url.searchParams.get("periodId")
  const courseId = url.searchParams.get("courseId")

  try {
    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      select: {
        id: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.role !== "ELEVE") {
      return NextResponse.json({ error: "Only students can access this endpoint" }, { status: 403 })
    }

    // Construire la requête
    const whereClause: any = {
      studentId: user.id,
      evaluation: {
        isPublished: true,
      },
    }

    if (periodId) {
      whereClause.evaluation = {
        ...whereClause.evaluation,
        periodId,
      }
    }

    if (courseId) {
      whereClause.evaluation = {
        ...whereClause.evaluation,
        courseId,
      }
    }

    // Récupérer les notes
    const grades = await prisma.grade.findMany({
      where: whereClause,
      include: {
        evaluation: {
          include: {
            course: {
              select: {
                id: true,
                name: true,
                coefficient: true,
              },
            },
            period: true,
          },
        },
      },
      orderBy: [
        {
          evaluation: {
            date: "desc",
          },
        },
      ],
    })

    return NextResponse.json(grades)
  } catch (error) {
    console.error("Error fetching student grades:", error)
    return NextResponse.json({ error: "An error occurred while fetching student grades" }, { status: 500 })
  }
}
