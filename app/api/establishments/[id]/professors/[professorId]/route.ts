import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Supprimer un professeur d'un établissement
export async function DELETE(request: Request, { params }: { params: { id: string; professorId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Vérifier si l'utilisateur est admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      select: { role: true },
    })

    if (currentUser?.role !== "SUPERADMIN" && currentUser?.role !== "ADMINISTRATION") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Vérifier si l'établissement existe
    const establishment = await prisma.establishment.findUnique({
      where: { id: params.id },
    })

    if (!establishment) {
      return NextResponse.json({ error: "Establishment not found" }, { status: 404 })
    }

    // Vérifier si le professeur existe
    const professor = await prisma.user.findUnique({
      where: { id: params.professorId },
    })

    if (!professor) {
      return NextResponse.json({ error: "Professor not found" }, { status: 404 })
    }

    // Vérifier si le professeur est associé à cet établissement
    const professorRelation = await prisma.establishmentProfessor.findUnique({
      where: {
        professorId_establishmentId: {
          professorId: params.professorId,
          establishmentId: params.id,
        },
      },
    })

    if (!professorRelation) {
      return NextResponse.json({ error: "Professor is not associated with this establishment" }, { status: 400 })
    }

    // Supprimer la relation professeur-établissement
    await prisma.establishmentProfessor.delete({
      where: {
        professorId_establishmentId: {
          professorId: params.professorId,
          establishmentId: params.id,
        },
      },
    })

    // Vérifier si le professeur est encore associé à d'autres établissements
    const otherRelations = await prisma.establishmentProfessor.findMany({
      where: { professorId: params.professorId },
    })

    // Si le professeur n'est plus associé à aucun établissement, changer son rôle en ELEVE
    if (otherRelations.length === 0) {
      await prisma.user.update({
        where: { id: params.professorId },
        data: { role: "ELEVE" },
      })
    }

    return NextResponse.json({ message: "Professor removed from establishment successfully" })
  } catch (error) {
    console.error("Error removing professor from establishment:", error)
    return NextResponse.json(
      { error: "An error occurred while removing professor from establishment" },
      { status: 500 },
    )
  }
}
