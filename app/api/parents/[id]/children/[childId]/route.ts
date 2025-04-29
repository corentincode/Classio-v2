import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// Supprimer une relation parent-enfant
export async function DELETE(request: NextRequest, { params }: { params: { id: string; childId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Vérifier les autorisations (seul le parent lui-même ou un administrateur peut supprimer)
    if (session.user.role !== "ADMINISTRATION" && session.user.id !== params.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    // Vérifier si la relation existe
    const existingRelation = await prisma.parentChild.findFirst({
      where: {
        parentId: params.id,
        childId: params.childId,
      },
    })

    if (!existingRelation) {
      return NextResponse.json({ error: "Relation parent-enfant non trouvée" }, { status: 404 })
    }

    // Supprimer la relation
    await prisma.parentChild.delete({
      where: {
        id: existingRelation.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de la relation parent-enfant:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
