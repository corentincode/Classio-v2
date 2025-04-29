import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { EleveDashboardClient } from "@/components/eleve/eleve-dashboard-client"

const prisma = new PrismaClient()

export default async function EleveDashboard() {
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
      email: true,
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

  if (!user.establishmentId) {
    redirect("/eleve/no-establishment")
  }

  // Vérifier si l'élève est dans une classe
  if (!user.studentClasses || user.studentClasses.length === 0) {
    redirect("/eleve/no-class")
  }

  // Utiliser la première classe de l'élève
  const studentClass = user.studentClasses[0].class

  // Récupérer les cours de l'élève
  const courses = await prisma.course.findMany({
    where: {
      classId: studentClass.id,
    },
    include: {
      professor: true,
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
    },
  })

  // Récupérer les notes récentes
  const recentGrades = await prisma.grade.findMany({
    where: {
      studentId: user.id,
    },
    include: {
      evaluation: {
        include: {
          course: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
  })

  // Récupérer les statistiques d'assiduité
  const attendanceStats = await prisma.attendanceRecord.groupBy({
    by: ["status"],
    where: {
      studentId: user.id,
      date: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)), // 30 derniers jours
      },
    },
    _count: {
      id: true,
    },
  })

  // Calculer le taux de présence
  const totalAttendance = attendanceStats.reduce((acc, stat) => acc + stat._count.id, 0)
  const presentCount = attendanceStats.find((stat) => stat.status === "PRESENT")?._count.id || 0
  const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 100

  // Récupérer les prochaines évaluations
  const upcomingEvaluations = await prisma.evaluation.findMany({
    where: {
      course: {
        classId: studentClass.id,
      },
      date: {
        gte: new Date(),
      },
    },
    include: {
      course: true,
    },
    orderBy: {
      date: "asc",
    },
    take: 5,
  })

  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
        </div>

        <EleveDashboardClient
          student={{
            id: user.id,
            name: user.name,
            email: user.email,
            class: studentClass,
          }}
          courses={courses}
          recentGrades={recentGrades}
          attendanceRate={attendanceRate}
          totalAttendance={totalAttendance}
          upcomingEvaluations={upcomingEvaluations}
        />
      </div>
    </div>
  )
}
