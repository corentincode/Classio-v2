import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Supprimer un utilisateur d'un établissement
export async function DELETE(request: Request, { params }: { params: { id: string; userId: string } }) {
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

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Vérifier si l'utilisateur est associé à cet établissement
    if (user.establishmentId !== params.id) {
      // Vérifier si c'est un professeur associé à cet établissement
      const professorRelation = await prisma.establishmentProfessor.findUnique({
        where: {
          professorId_establishmentId: {
            professorId: params.userId,
            establishmentId: params.id,
          },
        },
      })

      if (!professorRelation) {
        return NextResponse.json({ error: "User is not associated with this establishment" }, { status: 400 })
      }

      // Supprimer la relation professeur-établissement
      await prisma.establishmentProfessor.delete({
        where: {
          professorId_establishmentId: {
            professorId: params.userId,
            establishmentId: params.id,
          },
        },
      })
    } else {
      // Mettre à jour l'utilisateur pour supprimer l'association avec l'établissement
      await prisma.user.update({
        where: { id: params.userId },
        data: { establishmentId: null },
      })
    }

    return NextResponse.json({ message: "User removed from establishment successfully" })
  } catch (error) {
    console.error("Error removing user from establishment:", error)
    return NextResponse.json({ error: "An error occurred while removing user from establishment" }, { status: 500 })
  }
}
