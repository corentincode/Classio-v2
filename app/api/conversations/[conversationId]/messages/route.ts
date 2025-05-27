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

    // Récupérer les messages avec les fichiers
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
        files: true, // Inclure les fichiers associés
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    // Formater les messages pour correspondre à l'interface du frontend
    const formattedMessages = messages.map((message) => ({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      senderId: message.senderId,
      sender: message.sender,
      file: message.files[0] ? {
        id: message.files[0].id,
        name: message.files[0].name,
        type: message.files[0].type,
        size: message.files[0].size,
        url: message.files[0].url,
      } : null,
    }))

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

    return NextResponse.json(formattedMessages)
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
    const { content, fileId } = body // Ajouter fileId

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

    // Créer le message avec ou sans fichier
    const messageData: any = {
      content: content || "",
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
    }

    // Si un fichier est fourni, l'associer au message
    if (fileId) {
      // Vérifier que le fichier existe
      const file = await prisma.files.findUnique({
        where: { id: fileId },
      })

      if (!file) {
        return NextResponse.json({ error: "Fichier non trouvé" }, { status: 404 })
      }

      // Associer le fichier au message
      messageData.files = {
        connect: { id: fileId },
      }
    }

    const message = await prisma.message.create({
      data: messageData,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        files: true,
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

    // Formater la réponse pour correspondre à l'interface du frontend
    const formattedMessage = {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      senderId: message.senderId,
      sender: message.sender,
      file: message.files[0] ? {
        id: message.files[0].id,
        name: message.files[0].name,
        type: message.files[0].type,
        size: message.files[0].size,
        url: message.files[0].url,
      } : null,
    }

    return NextResponse.json(formattedMessage)
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
