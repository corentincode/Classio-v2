import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { StudentGradesClient } from "@/components/eleve/student-grades-client"

const prisma = new PrismaClient()

export const metadata: Metadata = {
  title: "Mes notes | Classio",
  description: "Consulter mes notes",
}

export default async function StudentGradesPage() {
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
      studentClasses: {
        include: {
          class: true,
        },
      },
    },
  })

  if (!user) {
    redirect("/auth/signin")
  }

  if (user.role !== "ELEVE") {
    redirect("/")
  }

  if (!user.establishmentId) {
    redirect("/eleve/no-establishment")
  }

  if (user.studentClasses.length === 0) {
    redirect("/eleve/no-class")
  }

  // Récupérer les périodes de l'établissement
  const periods = await prisma.periodConfig.findMany({
    where: {
      establishmentId: user.establishmentId,
      isActive: true,
    },
    orderBy: [{ schoolYear: "desc" }, { startDate: "asc" }],
  })

  // Récupérer les cours de l'élève
  const studentClass = user.studentClasses[0]
  const courses = await prisma.course.findMany({
    where: {
      classId: studentClass.class.id,
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Mes notes</h1>
      <StudentGradesClient studentId={user.id} periods={periods} courses={courses} />
    </div>
  )
}
