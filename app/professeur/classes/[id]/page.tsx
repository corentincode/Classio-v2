import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { ProfesseurClassDetails } from "@/components/professeur/professeur-class-details"

const prisma = new PrismaClient()

export default async function ProfesseurClassDetailsPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { establishmentId?: string }
}) {
  // Vérifier l'authentification
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  // Récupérer l'ID de l'établissement et de la classe
  const establishmentId = searchParams.establishmentId || ""
  const classId = params.id

  // Si pas d'ID d'établissement, rediriger vers la sélection
  if (!establishmentId) {
    redirect("/professeur/select-establishment")
  }

  // Récupérer l'ID de l'utilisateur
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })

  if (!user) {
    redirect("/auth/signin")
  }

  // Vérifier si le professeur a accès à cette classe
  const classAccess = await prisma.course.findFirst({
    where: {
      professorId: user.id,
      classId: classId,
      class: {
        establishmentId: establishmentId,
      },
    },
  })

  if (!classAccess) {
    redirect("/professeur/classes?establishmentId=" + establishmentId)
  }

  // Récupérer les détails de la classe
  const classData = await prisma.class.findUnique({
    where: {
      id: classId,
    },
    include: {
      courses: {
        where: {
          professorId: user.id,
        },
        include: {
          professor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          sessions: {
            orderBy: {
              startTime: "asc",
            },
          },
          evaluations: {
            orderBy: {
              date: "asc",
            },
          },
        },
      },
    },
  })

  if (!classData) {
    redirect("/professeur/classes?establishmentId=" + establishmentId)
  }

  // Récupérer les étudiants de la classe séparément
  const studentsInClass = await prisma.studentClass.findMany({
    where: {
      classId: classId,
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  // Formater les données pour correspondre à l'interface attendue par le composant
  const classDetails = {
    ...classData,
    students: studentsInClass.map((sc) => ({
      id: sc.id,
      user: {
        id: sc.student.id,
        name: sc.student.name,
        email: sc.student.email,
      },
    })),
  }

  // Trier les étudiants par nom (en gérant les noms null)
  classDetails.students.sort((a, b) => {
    const nameA = a.user.name || ""
    const nameB = b.user.name || ""
    return nameA.localeCompare(nameB)
  })

  return (
    <div className="space-y-6">
      <ProfesseurClassDetails classDetails={classDetails} establishmentId={establishmentId} professorId={user.id} />
    </div>
  )
}
