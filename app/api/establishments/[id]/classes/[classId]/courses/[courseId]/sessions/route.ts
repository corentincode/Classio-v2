import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Récupérer toutes les sessions d'un cours
export async function GET(request: Request, { params }: { params: { id: string; classId: string; courseId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Vérifier si le cours existe
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Vérifier si le cours appartient à la classe spécifiée
    if (course.classId !== params.classId) {
      return NextResponse.json({ error: "Course does not belong to the specified class" }, { status: 400 })
    }

    // Récupérer la classe pour vérifier l'établissement
    const classData = await prisma.class.findUnique({
      where: { id: params.classId },
    })

    if (!classData || classData.establishmentId !== params.id) {
      return NextResponse.json({ error: "Class not found or does not belong to the establishment" }, { status: 404 })
    }

    // Récupérer les sessions
    const sessions = await prisma.session.findMany({
      where: { courseId: params.courseId },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json({ error: "An error occurred while fetching sessions" }, { status: 500 })
  }
}

// Créer une nouvelle session
export async function POST(
  request: Request,
  { params }: { params: { id: string; classId: string; courseId: string } },
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Vérifier si le cours existe
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Vérifier si le cours appartient à la classe spécifiée
    if (course.classId !== params.classId) {
      return NextResponse.json({ error: "Course does not belong to the specified class" }, { status: 400 })
    }

    // Récupérer la classe pour vérifier l'établissement
    const classData = await prisma.class.findUnique({
      where: { id: params.classId },
    })

    if (!classData || classData.establishmentId !== params.id) {
      return NextResponse.json({ error: "Class not found or does not belong to the establishment" }, { status: 404 })
    }

    // Vérifier les permissions
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      select: { id: true, role: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isAdmin = user.role === "SUPERADMIN" || user.role === "ADMINISTRATION"
    const isProfessor = user.role === "PROFESSEUR" && course.professorId === user.id

    if (!isAdmin && !isProfessor) {
      return NextResponse.json({ error: "Not authorized to create sessions for this course" }, { status: 403 })
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

    // Créer la session
    const newSession = await prisma.session.create({
      data: {
        title,
        description,
        dayOfWeek,
        startTime: start,
        endTime: end,
        recurrent: recurrent !== undefined ? recurrent : true,
        room,
        courseId: params.courseId,
      },
    })

    return NextResponse.json(newSession, { status: 201 })
  } catch (error) {
    console.error("Error creating session:", error)
    return NextResponse.json({ error: "An error occurred while creating the session" }, { status: 500 })
  }
}
