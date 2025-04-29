import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { ParentChildrenClient } from "@/components/parent/parent-children-client"

export default async function ParentChildrenPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "PARENT") {
    redirect("/auth/signin")
  }

  // Rediriger si l'utilisateur n'a pas d'établissement sélectionné
  if (!session.user.establishmentId) {
    redirect("/parent/no-establishment")
  }

  // Récupérer les enfants du parent
  const children = await prisma.parentChild.findMany({
    where: {
      parentId: session.user.id,
    },
    include: {
      child: {
        select: {
          id: true,
          email: true,
          role: true,
          studentClasses: {
            include: {
              class: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  })

  return (
    <ParentChildrenClient
      parentId={session.user.id}
      establishmentId={session.user.establishmentId}
      initialChildren={children}
    />
  )
}
