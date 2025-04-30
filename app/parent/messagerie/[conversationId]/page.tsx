import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import ConversationList from "@/components/messaging/conversation-list"
import Conversation from "@/components/messaging/conversation"

interface ParentMessagerieConversationPageProps {
  params: {
    conversationId: string
  }
}

export default async function ParentMessagerieConversationPage({ params }: ParentMessagerieConversationPageProps) {
  // Attendre les paramètres avant de les utiliser
  const conversationId = await params.conversationId
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  if (session.user.role !== "PARENT") {
    redirect("/")
  }

  // Récupérer l'établissement actuel du parent
  const userWithEstablishment = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      establishment: true,
    },
  })

  if (!userWithEstablishment?.establishmentId) {
    redirect("/parent/no-establishment")
  }

  // Vérifier que l'utilisateur a accès à cette conversation
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
    },
  })

  if (!conversation) {
    redirect("/parent/messagerie")
  }

  const isParticipant = conversation.participants.some((participant) => participant.userId === session.user.id)

  if (!isParticipant) {
    redirect("/parent/messagerie")
  }

  return (
    <div className="h-full">
      <div className="h-full flex">
        <div className="hidden md:block w-80 border-r h-full">
          <ConversationList
            currentUser={session.user}
            establishmentId={userWithEstablishment.establishmentId}
          />
        </div>
        <div className="flex-1 h-full">
          <Conversation conversationId={conversationId} currentUser={session.user} />
        </div>
      </div>
    </div>
  )
}