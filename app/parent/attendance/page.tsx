import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { ParentAttendanceClient } from "@/components/parent/parent-attendance-client"

export default async function ParentAttendancePage() {
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

  if (children.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucun enfant associé</h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas encore d'enfants associés à votre compte. Veuillez contacter l'administration de
            l'établissement.
          </p>
        </div>
      </div>
    )
  }

  return <ParentAttendanceClient children={children} />
}
