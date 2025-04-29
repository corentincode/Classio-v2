import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { StudentAttendanceClient } from "@/components/eleve/student-attendance-client"
import prisma from "@/lib/prisma"

export default async function StudentAttendancePage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  if (session.user.role !== "ELEVE") {
    redirect("/")
  }

  // Vérifier si l'élève est associé à une classe
  const student = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      studentClasses: {
        include: {
          class: true,
        },
      },
    },
  })

  if (!student || student.studentClasses.length === 0) {
    redirect("/eleve/no-class")
  }

  const className = student.studentClasses[0].class.name

  // Récupérer les statistiques d'assiduité
  const currentMonth = new Date()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

  const attendanceStats = await prisma.attendanceRecord.groupBy({
    by: ["status"],
    where: {
      studentId: session.user.id,
      date: {
        gte: firstDayOfMonth,
        lte: lastDayOfMonth,
      },
    },
    _count: {
      status: true,
    },
  })

  // Calculer les statistiques
  const stats = {
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
  }

  attendanceStats.forEach((stat) => {
    const count = stat._count.status
    stats.total += count

    switch (stat.status) {
      case "PRESENT":
        stats.present = count
        break
      case "ABSENT":
        stats.absent = count
        break
      case "LATE":
        stats.late = count
        break
      case "EXCUSED":
        stats.excused = count
        break
    }
  })

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Mes absences et retards</h1>
      <StudentAttendanceClient studentId={session.user.id} className={className} initialStats={stats} />
    </div>
  )
}
