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

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        class: true,
      },
    })

    if (!course) {
      return NextResponse.json({ error: "Cours non trouvé" }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error("Erreur lors de la récupération du cours:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération du cours" }, { status: 500 })
  }
}
