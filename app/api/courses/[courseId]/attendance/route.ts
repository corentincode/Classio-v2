import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const courseId = params.courseId
    const url = new URL(request.url)
    const dateParam = url.searchParams.get("date")

    if (!dateParam) {
      return NextResponse.json({ error: "Date requise" }, { status: 400 })
    }

    const date = new Date(dateParam)
    date.setHours(0, 0, 0, 0)

    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)

    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where: {
        courseId,
        date: {
          gte: date,
          lte: endDate,
        },
      },
      include: {
        student: true,
      },
    })

    return NextResponse.json(attendanceRecords)
  } catch (error) {
    console.error("Erreur lors de la récupération des enregistrements d'assiduité:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des enregistrements d'assiduité" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    if (session.user.role !== "PROFESSEUR" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const courseId = params.courseId
    const { date, records, sessionId } = await request.json()

    // Vérifier si le cours existe
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return NextResponse.json({ error: "Cours non trouvé" }, { status: 404 })
    }

    // Vérifier si le professeur est autorisé à enregistrer l'assiduité pour ce cours
    if (course.professorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé pour ce cours" }, { status: 403 })
    }

    // Vérifier si des enregistrements existent déjà pour ce cours à cette date
    const parsedDate = new Date(date)
    parsedDate.setHours(0, 0, 0, 0)

    const endDate = new Date(parsedDate)
    endDate.setHours(23, 59, 59, 999)

    const existingRecords = await prisma.attendanceRecord.findMany({
      where: {
        courseId,
        date: {
          gte: parsedDate,
          lte: endDate,
        },
      },
    })

    if (existingRecords.length > 0) {
      return NextResponse.json({ error: "L'appel a déjà été fait pour ce cours à cette date" }, { status: 400 })
    }

    // Créer les enregistrements d'assiduité
    const createdRecords = await Promise.all(
      records.map(async (record: any) => {
        return prisma.attendanceRecord.create({
          data: {
            date: parsedDate,
            status: record.status,
            minutesLate: record.minutesLate || null,
            reason: record.reason || null,
            student: {
              connect: { id: record.studentId },
            },
            course: {
              connect: { id: courseId },
            },
            recordedBy: {
              connect: { id: session.user.id },
            },
            session: sessionId
              ? {
                  connect: { id: sessionId },
                }
              : undefined,
          },
        })
      }),
    )

    return NextResponse.json(createdRecords)
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des présences:", error)
    return NextResponse.json({ error: "Erreur lors de l'enregistrement des présences" }, { status: 500 })
  }
}
