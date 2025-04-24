import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Récupérer les professeurs d'un établissement
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Vérifier si l'établissement existe
    const establishment = await prisma.establishment.findUnique({
      where: { id: params.id },
    })

    if (!establishment) {
      return NextResponse.json({ error: "Establishment not found" }, { status: 404 })
    }

    // Récupérer les professeurs de l'établissement
    const professorRelations = await prisma.establishmentProfessor.findMany({
      where: { establishmentId: params.id },
      include: {
        professor: {
          select: {
            id: true,
            email: true,
            lastLogin: true,
            createdAt: true,
          },
        },
      },
    })

    const professors = professorRelations.map((relation) => relation.professor)

    return NextResponse.json(professors)
  } catch (error) {
    console.error("Error fetching professors:", error)
    return NextResponse.json({ error: "An error occurred while fetching professors" }, { status: 500 })
  }
}
