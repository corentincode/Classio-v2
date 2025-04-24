import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  try {
    // Récupérer l'utilisateur avec son établissement
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        establishment: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Si l'utilisateur n'a pas d'établissement, vérifier s'il est professeur dans un établissement
    if (!user.establishment && user.role === "PROFESSOR") {
      const professorEstablishment = await prisma.establishmentUser.findFirst({
        where: { userId: user.id },
        include: {
          establishment: true,
        },
      })

      if (professorEstablishment) {
        return NextResponse.json({ establishment: professorEstablishment.establishment })
      }
    }

    return NextResponse.json({ establishment: user.establishment })
  } catch (error) {
    console.error("Erreur lors de la récupération de l'établissement:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération de l'établissement" },
      { status: 500 },
    )
  }
}
