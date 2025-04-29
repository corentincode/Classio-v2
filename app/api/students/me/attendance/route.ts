import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const userId = session.user.id

    // Dans notre schéma, nous n'avons pas de table "student" séparée
    // Nous utilisons directement la table User avec le rôle ELEVE
    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where: {
        studentId: userId, // L'ID de l'utilisateur est directement utilisé comme studentId
      },
      include: {
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
    console.error("Erreur lors de la récupération des présences:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des présences" }, { status: 500 })
  }
}
