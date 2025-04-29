import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { EvaluationsClient } from "@/components/professeur/evaluations-client"

const prisma = new PrismaClient()

export const metadata: Metadata = {
  title: "Évaluations | Classio",
  description: "Gérer les évaluations du cours",
}

export default async function CourseEvaluationsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Récupérer le cours
  const course = await prisma.course.findUnique({
    where: {
      id: params.id,
    },
    include: {
      class: {
        select: {
          id: true,
          name: true,
          establishmentId: true,
        },
      },
      professor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  if (!course) {
    redirect("/professeur/courses")
  }

  // Vérifier si l'utilisateur est le professeur du cours ou un administrateur
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    select: {
      id: true,
      role: true,
    },
  })

  if (!user) {
    redirect("/auth/signin")
  }

  const isAdmin = user.role === "SUPERADMIN" || user.role === "ADMINISTRATION"
  const isProfessor = user.role === "PROFESSEUR" && course.professorId === user.id

  if (!isAdmin && !isProfessor) {
    redirect("/professeur/courses")
  }

  // Récupérer les périodes de l'établissement
  const periods = await prisma.periodConfig.findMany({
    where: {
      establishmentId: course.class.establishmentId,
      isActive: true,
    },
    orderBy: [{ schoolYear: "desc" }, { startDate: "asc" }],
  })

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Évaluations - {course.name}</h1>
        <div className="text-sm text-gray-500">Classe: {course.class.name}</div>
      </div>

      <EvaluationsClient courseId={params.id} periods={periods} />
    </div>
  )
}
