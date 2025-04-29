import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// Récupérer les enregistrements d'assiduité pour un élève spécifique
export async function GET(request: NextRequest, { params }: { params: { studentId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const studentId = params.studentId

    // Vérifier les autorisations
    if (
      session.user.role !== "ADMINISTRATION" &&
      session.user.id !== studentId &&
      !(session.user.role === "PARENT" && (await isParentOfStudent(session.user.id, studentId))) &&
      !(session.user.role === "PROFESSEUR" && (await isTeacherOfStudent(session.user.id, studentId)))
    ) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    // Paramètres de filtrage
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")
    const fromDate = searchParams.get("fromDate")
    const toDate = searchParams.get("toDate")
    const status = searchParams.get("status")

    // Construire la requête
    const whereClause: any = {
      studentId,
    }

    if (courseId) {
      whereClause.courseId = courseId
    }

    if (fromDate && toDate) {
      whereClause.date = {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      }
    } else if (fromDate) {
      whereClause.date = {
        gte: new Date(fromDate),
      }
    } else if (toDate) {
      whereClause.date = {
        lte: new Date(toDate),
      }
    }

    if (status) {
      whereClause.status = status
    }

    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where: whereClause,
      include: {
        course: {
          select: {
            id: true,
            name: true,
            class: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        session: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            room: true,
          },
        },
        recordedBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    })

    return NextResponse.json(attendanceRecords)
  } catch (error) {
    console.error("Erreur lors de la récupération des enregistrements d'assiduité:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// Fonction utilitaire pour vérifier si un utilisateur est parent d'un élève
async function isParentOfStudent(parentId: string, studentId: string): Promise<boolean> {
  const parentChild = await prisma.parentChild.findFirst({
    where: {
      parentId,
      childId: studentId,
    },
  })

  return !!parentChild
}

// Fonction utilitaire pour vérifier si un professeur enseigne à un élève
async function isTeacherOfStudent(teacherId: string, studentId: string): Promise<boolean> {
  // Récupérer les classes de l'élève
  const studentClasses = await prisma.studentClass.findMany({
    where: {
      studentId,
    },
    select: {
      classId: true,
    },
  })

  const classIds = studentClasses.map((sc) => sc.classId)

  if (classIds.length === 0) {
    return false
  }

  // Vérifier si le professeur enseigne dans l'une de ces classes
  const courses = await prisma.course.findFirst({
    where: {
      professorId: teacherId,
      classId: {
        in: classIds,
      },
    },
  })

  return !!courses
}
