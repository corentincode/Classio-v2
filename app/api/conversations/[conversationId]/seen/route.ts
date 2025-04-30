import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Marquer une conversation comme lue
export async function POST(req: NextRequest, { params }: { params: { conversationId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { conversationId } = params
    const userId = session.user.id

    // Vérifier que l'utilisateur est participant à la conversation
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          userId,
          conversationId,
        },
      },
    })

    if (!participant) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    // Mettre à jour le dernier message lu
    await prisma.conversationParticipant.update({
      where: {
        userId_conversationId: {
          userId,
          conversationId,
        },
      },
      data: {
        lastReadAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors du marquage de la conversation comme lue:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}