import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// Créer un nouvel enregistrement d'assiduité
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Vérifier si l'utilisateur est un professeur ou un administrateur
    if (session.user.role !== "PROFESSEUR" && session.user.role !== "ADMINISTRATION") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    const data = await request.json()
    const { studentId, courseId, date, status, minutesLate, reason, sessionId } = data

    // Validation des données
    if (!studentId || !courseId || !date || !status) {
      return NextResponse.json({ error: "Données incomplètes" }, { status: 400 })
    }

    // Vérifier si l'enregistrement existe déjà
    const existingRecord = await prisma.attendanceRecord.findFirst({
      where: {
        studentId,
        courseId,
        date: new Date(date),
      },
    })

    if (existingRecord) {
      // Mettre à jour l'enregistrement existant
      const updatedRecord = await prisma.attendanceRecord.update({
        where: {
          id: existingRecord.id,
        },
        data: {
          status,
          minutesLate: status === "LATE" ? minutesLate : null,
          reason,
          sessionId,
          updatedAt: new Date(),
        },
      })

      return NextResponse.json(updatedRecord)
    }

    // Créer un nouvel enregistrement
    const attendanceRecord = await prisma.attendanceRecord.create({
      data: {
        student: {
          connect: { id: studentId },
        },
        course: {
          connect: { id: courseId },
        },
        recordedBy: {
          connect: { id: session.user.id },
        },
        date: new Date(date),
        status,
        minutesLate: status === "LATE" ? minutesLate : null,
        reason,
        session: sessionId
          ? {
              connect: { id: sessionId },
            }
          : undefined,
      },
    })

    return NextResponse.json(attendanceRecord)
  } catch (error) {
    console.error("Erreur lors de la création de l'enregistrement d'assiduité:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// Récupérer tous les enregistrements d'assiduité
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Paramètres de filtrage
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const courseId = searchParams.get("courseId")
    const classId = searchParams.get("classId")
    const fromDate = searchParams.get("fromDate")
    const toDate = searchParams.get("toDate")
    const status = searchParams.get("status")
    const establishmentId = searchParams.get("establishmentId")

    // Construire la requête
    const whereClause: any = {}

    if (studentId) {
      whereClause.studentId = studentId
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

    // Si l'utilisateur est un professeur, limiter aux cours qu'il enseigne
    if (session.user.role === "PROFESSEUR") {
      whereClause.course = {
        professorId: session.user.id,
      }
    }

    // Si l'utilisateur est un élève, limiter à ses propres enregistrements
    if (session.user.role === "ELEVE") {
      whereClause.studentId = session.user.id
    }

    // Si l'utilisateur est un parent, limiter aux enregistrements de ses enfants
    if (session.user.role === "PARENT") {
      const children = await prisma.parentChild.findMany({
        where: {
          parentId: session.user.id,
        },
        select: {
          childId: true,
        },
      })

      const childrenIds = children.map((child) => child.childId)

      if (childrenIds.length === 0) {
        return NextResponse.json([])
      }

      whereClause.studentId = {
        in: childrenIds,
      }
    }

    // Si un ID de classe est fourni, filtrer par classe
    if (classId) {
      whereClause.course = {
        ...whereClause.course,
        classId,
      }
    }

    // Si un ID d'établissement est fourni, filtrer par établissement
    if (establishmentId) {
      whereClause.course = {
        ...whereClause.course,
        class: {
          establishmentId,
        },
      }
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
