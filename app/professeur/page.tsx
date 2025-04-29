import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { ProfesseurDashboardClient } from "@/components/professeur/professeur-dashboard-client"

const prisma = new PrismaClient()

export default async function ProfesseurDashboard({
  searchParams,
}: {
  searchParams: { establishmentId?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role !== "PROFESSEUR") {
    redirect("/")
  }

  const { establishmentId } = searchParams

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

  // Vérifier si le professeur a accès à cet établissement
  const professorEstablishment = await prisma.establishmentProfessor.findFirst({
    where: {
      professorId: user.id,
      establishmentId: establishmentId,
    },
  })

  if (!professorEstablishment) {
    redirect("/professeur/select-establishment")
  }

  // Récupérer les cours du professeur dans cet établissement
  const courses = await prisma.course.findMany({
    where: {
      professorId: user.id,
      class: {
        establishmentId: establishmentId,
      },
    },
    include: {
      class: true,
      sessions: {
        where: {
          startTime: {
            gte: new Date(),
          },
        },
        orderBy: {
          startTime: "asc",
        },
        take: 5,
      },
      evaluations: {
        where: {
          date: {
            gte: new Date(),
          },
        },
        orderBy: {
          date: "asc",
        },
        take: 5,
      },
    },
  })

  // Récupérer les statistiques d'assiduité
  const attendanceStats = await prisma.attendanceRecord.groupBy({
    by: ["status"],
    where: {
      recordedById: user.id,
      date: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 derniers jours
      },
      course: {
        professorId: user.id,
        class: {
          establishmentId: establishmentId,
        },
      },
    },
    _count: {
      status: true,
    },
  })

  // Récupérer les classes du professeur
  const classes = await prisma.class.findMany({
    where: {
      establishmentId: establishmentId,
      courses: {
        some: {
          professorId: user.id,
        },
      },
    },
    include: {
      _count: {
        select: {
          students: true,
        },
      },
    },
  })

  // Récupérer l'établissement
  const establishment = await prisma.establishment.findUnique({
    where: {
      id: establishmentId,
    },
  })

  return (
    <ProfesseurDashboardClient
      user={user}
      courses={courses}
      attendanceStats={attendanceStats}
      classes={classes}
      establishment={establishment}
    />
  )
}
