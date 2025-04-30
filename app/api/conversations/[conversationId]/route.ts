import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Récupérer les détails d'une conversation
export async function GET(req: NextRequest, { params }: { params: { conversationId: string } }) {
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

    // Récupérer les détails de la conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversation non trouvée" }, { status: 404 })
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error("Erreur lors de la récupération de la conversation:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// Mettre à jour une conversation (titre, participants, etc.)
export async function PATCH(req: NextRequest, { params }: { params: { conversationId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { conversationId } = params
    const userId = session.user.id
    const body = await req.json()
    const { title, participantIds } = body

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

    // Récupérer la conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        participants: true,
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversation non trouvée" }, { status: 404 })
    }

    // Mettre à jour le titre si fourni
    if (title !== undefined) {
      await prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          title,
        },
      })
    }

    // Mettre à jour les participants si fournis
    if (participantIds && conversation.isGroup) {
      // Récupérer les participants actuels
      const currentParticipantIds = conversation.participants.map((p) => p.userId)

      // Participants à ajouter
      const participantsToAdd = participantIds.filter((id: string) => !currentParticipantIds.includes(id))

      // Participants à supprimer
      const participantsToRemove = currentParticipantIds.filter((id) => !participantIds.includes(id) && id !== userId)

      // Ajouter les nouveaux participants
      if (participantsToAdd.length > 0) {
        await prisma.conversationParticipant.createMany({
          data: participantsToAdd.map((id: string) => ({
            userId: id,
            conversationId,
          })),
        })
      }

      // Supprimer les participants
      if (participantsToRemove.length > 0) {
        await prisma.conversationParticipant.deleteMany({
          where: {
            conversationId,
            userId: {
              in: participantsToRemove,
            },
          },
        })
      }
    }

    // Récupérer la conversation mise à jour
    const updatedConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(updatedConversation)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la conversation:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// Supprimer une conversation
export async function DELETE(req: NextRequest, { params }: { params: { conversationId: string } }) {
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

    // Pour les conversations de groupe, supprimer uniquement le participant
    // Pour les conversations directes, supprimer la conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        participants: true,
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversation non trouvée" }, { status: 404 })
    }

    if (conversation.isGroup) {
      // Supprimer le participant
      await prisma.conversationParticipant.delete({
        where: {
          userId_conversationId: {
            userId,
            conversationId,
          },
        },
      })

      // Si c'était le dernier participant, supprimer la conversation
      if (conversation.participants.length <= 1) {
        await prisma.conversation.delete({
          where: {
            id: conversationId,
          },
        })
      }
    } else {
      // Supprimer la conversation directe
      await prisma.conversation.delete({
        where: {
          id: conversationId,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de la conversation:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}