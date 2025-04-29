import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ProfesseurAttendanceClient } from "@/components/professeur/attendance-client"
import prisma from "@/lib/prisma"

export default async function ProfesseurAttendancePage({
  searchParams,
}: {
  searchParams: { establishmentId?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  if (session.user.role !== "PROFESSEUR") {
    redirect("/")
  }

  // Utiliser la déstructuration avec une valeur par défaut pour éviter les erreurs
  const { establishmentId = "" } = searchParams

  if (!establishmentId) {
    redirect("/professeur/select-establishment")
  }

  // Vérifier si l'établissement existe
  const establishment = await prisma.establishment.findUnique({
    where: { id: establishmentId },
  })

  if (!establishment) {
    redirect("/professeur/select-establishment")
  }

  // Vérifier si le professeur est associé à cet établissement
  const professorEstablishment = await prisma.establishmentProfessor.findFirst({
    where: {
      professorId: session.user.id,
      establishmentId,
    },
  })

  if (!professorEstablishment) {
    redirect("/professeur/select-establishment")
  }

  // Récupérer les cours du professeur dans cet établissement
  const courses = await prisma.course.findMany({
    where: {
      professorId: session.user.id,
      class: {
        establishmentId,
      },
    },
    include: {
      class: true,
    },
    orderBy: {
      name: "asc",
    },
  })

  // Trouver le cours actuel (si le professeur a un cours en ce moment)
  const now = new Date()
  const currentDay = now.getDay() // 0 = dimanche, 1 = lundi, etc.

  // Récupérer toutes les sessions du jour actuel
  const todaySessions = await prisma.session.findMany({
    where: {
      course: {
        professorId: session.user.id,
        class: {
          establishmentId,
        },
      },
      dayOfWeek: currentDay,
    },
    include: {
      course: true,
    },
  })

  // Filtrer côté serveur pour trouver la session actuelle
  let currentCourseId = null
  if (todaySessions.length > 0) {
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    // Convertir l'heure actuelle en minutes depuis minuit pour faciliter la comparaison
    const currentTimeInMinutes = currentHour * 60 + currentMinute

    // Fonction pour convertir une heure au format "HH:MM" en minutes
    const timeToMinutes = (timeStr: string): number => {
      if (!timeStr || typeof timeStr !== "string") return 0
      const parts = timeStr.split(":")
      if (parts.length !== 2) return 0
      const hours = Number.parseInt(parts[0], 10)
      const minutes = Number.parseInt(parts[1], 10)
      if (isNaN(hours) || isNaN(minutes)) return 0
      return hours * 60 + minutes
    }

    const currentSession = todaySessions.find((sessionItem) => {
      if (!sessionItem || !sessionItem.startTime || !sessionItem.endTime) {
        return false
      }

      try {
        // Convertir les heures en minutes
        const startTimeInMinutes = timeToMinutes(sessionItem.startTime)
        const endTimeInMinutes = timeToMinutes(sessionItem.endTime)

        // Vérifier si l'heure actuelle est entre le début et la fin de la session
        return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes
      } catch (error) {
        console.error("Erreur lors de la conversion des heures:", error)
        return false
      }
    })

    if (currentSession && currentSession.course) {
      currentCourseId = currentSession.course.id
    }
  }

  // Vérifier si des appels ont déjà été faits aujourd'hui pour les cours du professeur
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const courseIds = courses.map((course) => course.id)

  const existingAttendanceRecords = await prisma.attendanceRecord.findMany({
    where: {
      courseId: {
        in: courseIds,
      },
      date: {
        gte: today,
        lt: tomorrow,
      },
      recordedById: session.user.id,
    },
    select: {
      courseId: true,
    },
    distinct: ["courseId"],
  })

  const completedCourseIds = existingAttendanceRecords.map((record) => record.courseId)

  return (
    <ProfesseurAttendanceClient
      professorId={session.user.id}
      establishment={establishment}
      courses={courses}
      currentCourseId={currentCourseId}
      completedCourseIds={completedCourseIds}
    />
  )
}
