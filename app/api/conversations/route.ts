import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Récupérer toutes les conversations de l'utilisateur connecté
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const userId = session.user.id

    // Récupérer les conversations avec les derniers messages et participants
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
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
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        lastMessageAt: "desc",
      },
    })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error("Erreur lors de la récupération des conversations:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// Créer une nouvelle conversation
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await req.json()
    const { title, participantIds, isGroup, initialMessage } = body

    // Vérifier que les participants existent
    if (!participantIds || participantIds.length === 0) {
      return NextResponse.json({ error: "Participants requis" }, { status: 400 })
    }

    // S'assurer que l'utilisateur actuel est inclus dans les participants
    const allParticipantIds = [...new Set([...participantIds, userId])]

    // Pour les conversations directes (non groupe), vérifier si elle existe déjà
    if (!isGroup && allParticipantIds.length === 2) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          isGroup: false,
          AND: [
            {
              participants: {
                some: {
                  userId: allParticipantIds[0],
                },
              },
            },
            {
              participants: {
                some: {
                  userId: allParticipantIds[1],
                },
              },
            },
          ],
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
      })

      if (existingConversation) {
        return NextResponse.json(existingConversation)
      }
    }

    // Créer une nouvelle conversation
    const conversation = await prisma.conversation.create({
      data: {
        title: isGroup ? title : null,
        isGroup,
        participants: {
          createMany: {
            data: allParticipantIds.map((id: string) => ({
              userId: id,
            })),
          },
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    })

    // Ajouter un message initial si fourni
    if (initialMessage) {
      await prisma.message.create({
        data: {
          content: initialMessage,
          conversation: {
            connect: {
              id: conversation.id,
            },
          },
          sender: {
            connect: {
              id: userId,
            },
          },
        },
      })
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error("Erreur lors de la création de la conversation:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}