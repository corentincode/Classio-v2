import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Récupérer les messages d'une conversation
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

    // Récupérer les messages
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })

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

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// Envoyer un nouveau message
export async function POST(req: NextRequest, { params }: { params: { conversationId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { conversationId } = params
    const userId = session.user.id
    const body = await req.json()
    const { content } = body

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

    // Créer le message
    const message = await prisma.message.create({
      data: {
        content,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    // Mettre à jour la date du dernier message de la conversation
    await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
      },
    })

    // Mettre à jour le dernier message lu pour l'expéditeur
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

    return NextResponse.json(message)
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}