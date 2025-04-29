import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// Récupérer les enregistrements d'assiduité pour une classe spécifique
export async function GET(request: NextRequest, { params }: { params: { classId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const classId = params.classId

    // Vérifier si la classe existe
    const classRecord = await prisma.class.findUnique({
      where: {
        id: classId,
      },
    })

    if (!classRecord) {
      return NextResponse.json({ error: "Classe non trouvée" }, { status: 404 })
    }

    // Vérifier les autorisations
    if (
      session.user.role !== "ADMINISTRATION" &&
      !(session.user.role === "PROFESSEUR" && (await isTeacherOfClass(session.user.id, classId))) &&
      !(session.user.role === "ELEVE" && (await isStudentInClass(session.user.id, classId))) &&
      !(session.user.role === "PARENT" && (await hasChildInClass(session.user.id, classId)))
    ) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    // Paramètres de filtrage
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")
    const studentId = searchParams.get("studentId")
    const fromDate = searchParams.get("fromDate")
    const toDate = searchParams.get("toDate")
    const status = searchParams.get("status")

    // Récupérer les cours de la classe
    const courses = await prisma.course.findMany({
      where: {
        classId,
      },
      select: {
        id: true,
      },
    })

    const courseIds = courses.map((course) => course.id)

    if (courseIds.length === 0) {
      return NextResponse.json([])
    }

    // Construire la requête
    const whereClause: any = {
      courseId: {
        in: courseIds,
      },
    }

    if (courseId) {
      whereClause.courseId = courseId
    }

    if (studentId) {
      whereClause.studentId = studentId
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
        student: {
          select: {
            id: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            name: true,
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

// Fonction utilitaire pour vérifier si un professeur enseigne dans une classe
async function isTeacherOfClass(teacherId: string, classId: string): Promise<boolean> {
  const course = await prisma.course.findFirst({
    where: {
      professorId: teacherId,
      classId,
    },
  })

  return !!course
}

// Fonction utilitaire pour vérifier si un élève est dans une classe
async function isStudentInClass(studentId: string, classId: string): Promise<boolean> {
  const studentClass = await prisma.studentClass.findFirst({
    where: {
      studentId,
      classId,
    },
  })

  return !!studentClass
}

// Fonction utilitaire pour vérifier si un parent a un enfant dans une classe
async function hasChildInClass(parentId: string, classId: string): Promise<boolean> {
  const children = await prisma.parentChild.findMany({
    where: {
      parentId,
    },
    select: {
      childId: true,
    },
  })

  const childrenIds = children.map((child) => child.childId)

  if (childrenIds.length === 0) {
    return false
  }

  const studentClass = await prisma.studentClass.findFirst({
    where: {
      studentId: {
        in: childrenIds,
      },
      classId,
    },
  })

  return !!studentClass
}
