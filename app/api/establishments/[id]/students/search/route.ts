import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.length < 3) {
      return NextResponse.json({ error: "Le terme de recherche doit contenir au moins 3 caractères" }, { status: 400 })
    }

    // Rechercher les élèves dans l'établissement
    const students = await prisma.user.findMany({
      where: {
        establishmentId: params.id,
        role: "ELEVE",
        email: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        studentClasses: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      take: 10,
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error("Erreur lors de la recherche d'élèves:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
