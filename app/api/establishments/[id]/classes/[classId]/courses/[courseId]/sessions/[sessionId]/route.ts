import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Récupérer une session spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string; classId: string; courseId: string; sessionId: string } },
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const sessionData = await prisma.session.findUnique({
      where: { id: params.sessionId },
    })

    if (!sessionData) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Vérifier si la session appartient au cours spécifié
    if (sessionData.courseId !== params.courseId) {
      return NextResponse.json({ error: "Session does not belong to the specified course" }, { status: 400 })
    }

    // Vérifier le cours
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
    })

    if (!course || course.classId !== params.classId) {
      return NextResponse.json({ error: "Course not found or does not belong to the class" }, { status: 404 })
    }

    // Vérifier la classe
    const classData = await prisma.class.findUnique({
      where: { id: params.classId },
    })

    if (!classData || classData.establishmentId !== params.id) {
      return NextResponse.json({ error: "Class not found or does not belong to the establishment" }, { status: 404 })
    }

    return NextResponse.json(sessionData)
  } catch (error) {
    console.error("Error fetching session:", error)
    return NextResponse.json({ error: "An error occurred while fetching the session" }, { status: 500 })
  }
}

// Mettre à jour une session
export async function PUT(
  request: Request,
  { params }: { params: { id: string; classId: string; courseId: string; sessionId: string } },
) {
  const authSession = await getServerSession(authOptions)

  if (!authSession) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Vérifier si la session existe
    const existingSession = await prisma.session.findUnique({
      where: { id: params.sessionId },
    })

    if (!existingSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Vérifier si la session appartient au cours spécifié
    if (existingSession.courseId !== params.courseId) {
      return NextResponse.json({ error: "Session does not belong to the specified course" }, { status: 400 })
    }

    // Vérifier le cours
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
    })

    if (!course || course.classId !== params.classId) {
      return NextResponse.json({ error: "Course not found or does not belong to the class" }, { status: 404 })
    }

    // Vérifier la classe
    const classData = await prisma.class.findUnique({
      where: { id: params.classId },
    })

    if (!classData || classData.establishmentId !== params.id) {
      return NextResponse.json({ error: "Class not found or does not belong to the establishment" }, { status: 404 })
    }

    // Vérifier les permissions
    const user = await prisma.user.findUnique({
      where: { email: authSession.user?.email as string },
      select: { id: true, role: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isAdmin = user.role === "SUPERADMIN" || user.role === "ADMINISTRATION"
    const isProfessor = user.role === "PROFESSEUR" && course.professorId === user.id

    if (!isAdmin && !isProfessor) {
      return NextResponse.json({ error: "Not authorized to update this session" }, { status: 403 })
    }

    const { title, description, dayOfWeek, startTime, endTime, recurrent, room } = await request.json()

    // Valider les données requises
    if (dayOfWeek === undefined || !startTime || !endTime) {
      return NextResponse.json({ error: "Day of week, start time, and end time are required" }, { status: 400 })
    }

    // Valider le jour de la semaine (0-6)
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return NextResponse.json({ error: "Day of week must be between 0 and 6" }, { status: 400 })
    }

    // Valider les heures de début et de fin
    const start = new Date(startTime)
    const end = new Date(endTime)

    if (end <= start) {
      return NextResponse.json({ error: "End time must be after start time" }, { status: 400 })
    }

    // Mettre à jour la session
    const updatedSession = await prisma.session.update({
      where: { id: params.sessionId },
      data: {
        title,
        description,
        dayOfWeek,
        startTime: start,
        endTime: end,
        recurrent: recurrent !== undefined ? recurrent : true,
        room,
      },
    })

    return NextResponse.json(updatedSession)
  } catch (error) {
    console.error("Error updating session:", error)
    return NextResponse.json({ error: "An error occurred while updating the session" }, { status: 500 })
  }
}

// Supprimer une session
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; classId: string; courseId: string; sessionId: string } },
) {
  const authSession = await getServerSession(authOptions)

  if (!authSession) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Vérifier si la session existe
    const existingSession = await prisma.session.findUnique({
      where: { id: params.sessionId },
    })

    if (!existingSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Vérifier si la session appartient au cours spécifié
    if (existingSession.courseId !== params.courseId) {
      return NextResponse.json({ error: "Session does not belong to the specified course" }, { status: 400 })
    }

    // Vérifier le cours
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
    })

    if (!course || course.classId !== params.classId) {
      return NextResponse.json({ error: "Course not found or does not belong to the class" }, { status: 404 })
    }

    // Vérifier la classe
    const classData = await prisma.class.findUnique({
      where: { id: params.classId },
    })

    if (!classData || classData.establishmentId !== params.id) {
      return NextResponse.json({ error: "Class not found or does not belong to the establishment" }, { status: 404 })
    }

    // Vérifier les permissions
    const user = await prisma.user.findUnique({
      where: { email: authSession.user?.email as string },
      select: { id: true, role: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isAdmin = user.role === "SUPERADMIN" || user.role === "ADMINISTRATION"
    const isProfessor = user.role === "PROFESSEUR" && course.professorId === user.id

    if (!isAdmin && !isProfessor) {
      return NextResponse.json({ error: "Not authorized to delete this session" }, { status: 403 })
    }

    // Supprimer la session
    await prisma.session.delete({
      where: { id: params.sessionId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting session:", error)
    return NextResponse.json({ error: "An error occurred while deleting the session" }, { status: 500 })
  }
}
