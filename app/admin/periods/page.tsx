import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { PeriodsManagementClient } from "@/components/admin/periods-management-client"

const prisma = new PrismaClient()

export const metadata: Metadata = {
  title: "Gestion des périodes | Classio",
  description: "Gérer les périodes d'évaluation",
}

export default async function PeriodsManagementPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Récupérer l'utilisateur
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    select: {
      id: true,
      role: true,
      establishmentId: true,
    },
  })

  if (!user) {
    redirect("/auth/signin")
  }

  if (user.role !== "ADMINISTRATION" && user.role !== "SUPERADMIN") {
    redirect("/")
  }

  if (!user.establishmentId) {
    redirect("/admin")
  }

  // Récupérer l'établissement
  const establishment = await prisma.establishment.findUnique({
    where: {
      id: user.establishmentId,
    },
  })

  if (!establishment) {
    redirect("/admin")
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des périodes - {establishment.name}</h1>
      <PeriodsManagementClient establishmentId={establishment.id} />
    </div>
  )
}
