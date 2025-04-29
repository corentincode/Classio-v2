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
    const dayOfWeekParam = url.searchParams.get("dayOfWeek")

    const whereClause: any = {
      courseId,
    }

    if (dayOfWeekParam) {
      whereClause.dayOfWeek = Number.parseInt(dayOfWeekParam, 10)
    }

    const sessions = await prisma.session.findMany({
      where: whereClause,
      orderBy: {
        startTime: "asc",
      },
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des sessions" }, { status: 500 })
  }
}
