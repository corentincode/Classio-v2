import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { GradesEntryClient } from "@/components/professeur/grades-entry-client"

const prisma = new PrismaClient()

export const metadata: Metadata = {
  title: "Saisie des notes | Classio",
  description: "Saisir les notes pour une évaluation",
}

export default async function EvaluationGradesPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Récupérer l'évaluation
  const evaluation = await prisma.evaluation.findUnique({
    where: {
      id: params.id,
    },
    include: {
      course: {
        select: {
          id: true,
          name: true,
          professorId: true,
          classId: true,
          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  })

  if (!evaluation) {
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
  const isProfessor = user.role === "PROFESSEUR" && evaluation.course.professorId === user.id

  if (!isAdmin && !isProfessor) {
    redirect("/professeur/courses")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Saisie des notes - {evaluation.title}</h1>
        <div className="text-sm text-gray-500 mt-1">
          Cours: {evaluation.course.name} | Classe: {evaluation.course.class.name}
        </div>
      </div>

      <GradesEntryClient evaluationId={params.id} maxGrade={evaluation.maxGrade} />
    </div>
  )
}
