import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import ConversationList from "@/components/messaging/conversation-list"

export default async function EleveMessagerieIndexPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  if (session.user.role !== "ELEVE") {
    redirect("/")
  }

  // Récupérer l'établissement actuel de l'élève
  const userWithEstablishment = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      establishment: true,
    },
  })

  if (!userWithEstablishment?.establishmentId) {
    redirect("/eleve/no-establishment")
  }

  return (
    <div className="h-full">
      <div className="md:hidden">
        <ConversationList currentUser={session.user} establishmentId={userWithEstablishment.establishmentId} />
      </div>
      <div className="hidden md:block h-full">
        <div className="h-full flex">
          <div className="w-80 border-r h-full">
            <ConversationList currentUser={session.user} establishmentId={userWithEstablishment.establishmentId} />
          </div>
          <div className="flex-1 flex items-center justify-center bg-muted/10">
            <div className="text-center px-4">
              <h3 className="text-xl font-semibold">Bienvenue dans la messagerie</h3>
              <p className="text-muted-foreground mt-2">
                Sélectionnez une conversation ou créez-en une nouvelle pour commencer à discuter
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}