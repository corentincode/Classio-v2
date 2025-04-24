import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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

    // Compter les utilisateurs associés à cet établissement
    const usersCount = await prisma.user.count({
      where: { establishmentId: params.id },
    })

    // Compter les professeurs associés à cet établissement
    const professorsCount = await prisma.establishmentProfessor.count({
      where: { establishmentId: params.id },
    })

    return NextResponse.json({
      usersCount,
      professorsCount,
    })
  } catch (error) {
    console.error("Error counting users:", error)
    return NextResponse.json({ error: "An error occurred while counting users" }, { status: 500 })
  }
}
