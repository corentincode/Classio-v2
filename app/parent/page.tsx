import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { ParentDashboardClient } from "@/components/parent/parent-dashboard-client"

const prisma = new PrismaClient()

export default async function ParentDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Récupérer l'ID de l'utilisateur
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    select: {
      id: true,
      establishmentId: true,
      name: true,
      role: true,
    },
  })

  if (!user) {
    redirect("/auth/signin")
  }

  if (!user.establishmentId) {
    redirect("/parent/no-establishment")
  }

  // Récupérer les enfants du parent
  const parentChildRelations = await prisma.parentChild.findMany({
    where: {
      parentId: user.id,
    },
    include: {
      child: {
        select: {
          id: true,
          name: true,
          email: true,
          studentClasses: {
            include: {
              class: true,
            },
          },
        },
      },
    },
  })

  const children = parentChildRelations.map((relation) => relation.child)

  if (children.length === 0) {
    redirect("/parent/children")
  }

  // Récupérer les notes récentes des enfants
  const childrenIds = children.map((child) => child.id)

  const recentGrades = await prisma.grade.findMany({
    where: {
      studentId: {
        in: childrenIds,
      },
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
        },
      },
      evaluation: {
        include: {
          course: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 10,
  })

  // Récupérer les statistiques d'assiduité des enfants
  const attendanceStats = await prisma.attendanceRecord.findMany({
    where: {
      studentId: {
        in: childrenIds,
      },
      date: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)), // 30 derniers jours
      },
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
        },
      },
      course: true,
    },
  })

  // Récupérer les prochaines évaluations des enfants
  const classIds = children.flatMap((child) => child.studentClasses?.map((sc) => sc.class.id) || [])

  const upcomingEvaluations = await prisma.evaluation.findMany({
    where: {
      course: {
        classId: {
          in: classIds.length > 0 ? classIds : undefined,
        },
      },
      date: {
        gte: new Date(),
      },
    },
    include: {
      course: {
        include: {
          class: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
    take: 10,
  })

  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
        </div>

        <ParentDashboardClient
          parent={user}
          children={children}
          recentGrades={recentGrades}
          attendanceStats={attendanceStats}
          upcomingEvaluations={upcomingEvaluations}
        />
      </div>
    </div>
  )
}
