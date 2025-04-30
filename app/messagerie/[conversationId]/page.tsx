import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

import ConversationList from "@/components/messaging/conversation-list"
import Conversation from "@/components/messaging/conversation"

interface ConversationPageProps {
  params: {
    conversationId: string
  }
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const { conversationId } = params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  // Vérifier que l'utilisateur est participant à la conversation
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      userId_conversationId: {
        userId: session.user.id,
        conversationId,
      },
    },
  })

  if (!participant) {
    redirect("/messagerie")
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
              image: true,
              role: true,
            },
          },
        },
      },
    },
  })

  if (!conversation) {
    redirect("/messagerie")
  }

  // Récupérer l'établissement actuel de l'utilisateur
  const userWithEstablishment = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      currentEstablishment: true,
    },
  })

  const establishmentId = userWithEstablishment?.currentEstablishmentId || null

  return (
    <div className="h-full">
      <div className="md:hidden h-full">
        <Conversation conversationId={conversationId} currentUser={session.user} initialConversation={conversation} />
      </div>
      <div className="hidden md:block h-full">
        <div className="h-full flex">
          <div className="w-80 border-r h-full">
            <ConversationList currentUser={session.user} establishmentId={establishmentId || undefined} />
          </div>
          <div className="flex-1 h-full">
            <Conversation
              conversationId={conversationId}
              currentUser={session.user}
              initialConversation={conversation}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
