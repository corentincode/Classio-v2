import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const sessionId = params.id

    // Vérifier que la session existe
    const courseSession = await prisma.session.findUnique({
      where: { id: sessionId },
    })

    if (!courseSession) {
      return NextResponse.json({ error: "Session non trouvée" }, { status: 404 })
    }

    // Récupérer toutes les présences pour cette session
    const attendances = await prisma.attendance.findMany({
      where: { sessionId: sessionId },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(attendances)
  } catch (error) {
    console.error("Erreur lors de la récupération des présences:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des présences" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const sessionId = params.id
    const { studentId, status, comment } = await request.json()

    // Vérifier que la session existe
    const courseSession = await prisma.session.findUnique({
      where: { id: sessionId },
    })

    if (!courseSession) {
      return NextResponse.json({ error: "Session non trouvée" }, { status: 404 })
    }

    // Vérifier que l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    })

    if (!student) {
      return NextResponse.json({ error: "Étudiant non trouvé" }, { status: 404 })
    }

    // Vérifier si une présence existe déjà pour cet étudiant et cette session
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        sessionId: sessionId,
        studentId: studentId,
      },
    })

    let attendance
    if (existingAttendance) {
      // Mettre à jour la présence existante
      attendance = await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: {
          status,
          comment,
        },
      })
    } else {
      // Créer une nouvelle présence
      attendance = await prisma.attendance.create({
        data: {
          sessionId,
          studentId,
          status,
          comment,
          date: new Date(),
        },
      })
    }

    return NextResponse.json(attendance)
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la présence:", error)
    return NextResponse.json({ error: "Erreur lors de l'enregistrement de la présence" }, { status: 500 })
  }
}
