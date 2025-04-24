import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Récupérer toutes les sessions pour l'emploi du temps d'une classe
export async function GET(request: Request, { params }: { params: { id: string; classId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Vérifier si l'utilisateur a accès à cette classe
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      select: {
        id: true,
        role: true,
        establishmentId: true,
        studentClasses: {
          where: { classId: params.classId },
        },
        teachingAt: {
          select: {
            establishmentId: true,
          },
        },
        taughtCourses: {
          where: { classId: params.classId },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Vérifier l'accès
    let hasAccess = false

    // Les administrateurs ont accès à toutes les classes de leur établissement
    if (user.role === "SUPERADMIN" || (user.role === "ADMINISTRATION" && user.establishmentId === params.id)) {
      hasAccess = true
    }

    // Les élèves n'ont accès qu'aux classes auxquelles ils sont inscrits
    if (user.role === "ELEVE" && user.studentClasses.length > 0) {
      hasAccess = true
    }

    // Les professeurs n'ont accès qu'aux classes où ils enseignent
    if (user.role === "PROFESSEUR" && user.taughtCourses.length > 0) {
      hasAccess = true
    }

    if (!hasAccess) {
      return NextResponse.json({ error: "Not authorized to access this class timetable" }, { status: 403 })
    }

    // Récupérer tous les cours de la classe avec leurs sessions
    const courses = await prisma.course.findMany({
      where: { classId: params.classId },
      include: {
        professor: {
          select: {
            id: true,
            email: true,
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
        },
      })),
    )

    return NextResponse.json(timetableSessions)
  } catch (error) {
    console.error("Error fetching timetable:", error)
    return NextResponse.json({ error: "An error occurred while fetching the timetable" }, { status: 500 })
  }
}
