import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import ConversationList from "@/components/messaging/conversation-list"
import Conversation from "@/components/messaging/conversation"

interface ProfesseurMessagerieConversationPageProps {
  params: {
    conversationId: string
  }
  searchParams: {
    establishmentId?: string
  }
}

export default async function ProfesseurMessagerieConversationPage({ 
  params, 
  searchParams 
}: ProfesseurMessagerieConversationPageProps) {
  // Attendre les paramètres avant de les utiliser
  const conversationId = await params.conversationId
  const establishmentId = searchParams.establishmentId
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  if (session.user.role !== "PROFESSEUR") {
    redirect("/")
  }

  // Vérifier si l'establishmentId est fourni
  if (!establishmentId) {
    redirect("/professeur/select-establishment")
  }

  // Vérifier si le professeur a accès à cet établissement
  const professorEstablishment = await prisma.establishmentProfessor.findFirst({
    where: {
      professorId: session.user.id,
      establishmentId: establishmentId,
    },
    include: {
      establishment: true,
    },
  })

  if (!professorEstablishment) {
    redirect("/professeur/select-establishment")
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
    redirect(`/professeur/messagerie?establishmentId=${establishmentId}`)
  }

  const isParticipant = conversation.participants.some((participant) => participant.userId === session.user.id)

  if (!isParticipant) {
    redirect(`/professeur/messagerie?establishmentId=${establishmentId}`)
  }

  return (
    <div className="h-full">
      <div className="h-full flex">
        <div className="hidden md:block w-80 border-r h-full">
          <ConversationList
            currentUser={session.user}
            establishmentId={establishmentId}
          />
        </div>
        <div className="flex-1 h-full">
          <Conversation conversationId={conversationId} currentUser={session.user} />
        </div>
      </div>
    </div>
  )
}