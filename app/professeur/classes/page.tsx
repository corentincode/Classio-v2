import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { ProfesseurClassesList } from "@/components/professeur/professeur-classes-list"

const prisma = new PrismaClient()

export default async function ProfesseurClassesPage({
  searchParams,
}: {
  searchParams: { establishmentId?: string }
}) {
  // Vérifier l'authentification
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  // Récupérer l'ID de l'établissement
  const establishmentId = searchParams.establishmentId || ""

  // Si pas d'ID d'établissement, rediriger vers la sélection
  if (!establishmentId) {
    redirect("/professeur/select-establishment")
  }

  // Récupérer l'ID de l'utilisateur
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    select: { id: true },
  })

  if (!user) {
    redirect("/auth/signin")
  }

  // Récupérer les cours du professeur
  const courses = await prisma.course.findMany({
    where: {
      professorId: user.id,
      class: {
        establishmentId: establishmentId,
      },
    },
    include: {
      class: {
        include: {
          _count: {
            select: {
              students: true,
            },
          },
        },
      },
    },
  })

  // Regrouper les cours par classe
  const classesMap = new Map()

  courses.forEach((course) => {
    if (!classesMap.has(course.class.id)) {
      classesMap.set(course.class.id, {
        id: course.class.id,
        name: course.class.name,
        level: course.class.level,
        section: course.class.section,
        schoolYear: course.class.schoolYear,
        studentCount: course.class._count.students,
        courses: [],
      })
    }

    classesMap.get(course.class.id).courses.push({
      id: course.id,
      name: course.name,
      color: course.color,
    })
  })

  const classes = Array.from(classesMap.values())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mes classes</h1>
        <p className="text-gray-500">
          {classes.length} classe{classes.length !== 1 ? "s" : ""} où vous enseignez
        </p>
      </div>

      <ProfesseurClassesList classes={classes} establishmentId={establishmentId} />
    </div>
  )
}
