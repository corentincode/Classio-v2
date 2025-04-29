import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { CourseAttendanceClient } from "@/components/professeur/course-attendance-client"
import prisma from "@/lib/prisma"
import { format, parse } from "date-fns"

export default async function CourseAttendancePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { date?: string; establishmentId?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  if (session.user.role !== "PROFESSEUR") {
    redirect("/")
  }

  const courseId = params.id
  const dateParam = searchParams.date || format(new Date(), "yyyy-MM-dd")
  const establishmentId = searchParams.establishmentId

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

  // Récupérer les informations du cours
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      class: true,
    },
  })

  if (!course) {
    redirect(`/professeur/attendance?establishmentId=${establishmentId}`)
  }

  // Vérifier que le cours appartient au professeur
  if (course.professorId !== session.user.id) {
    redirect(`/professeur/attendance?establishmentId=${establishmentId}`)
  }

  // Récupérer les étudiants de la classe - CORRECTION ICI
  const students = await prisma.user.findMany({
    where: {
      role: "ELEVE",
      studentClasses: {
        // Correction: studentClass -> studentClasses
        some: {
          // Utilisation de "some" pour filtrer sur la relation
          classId: course.classId,
        },
      },
    },
    orderBy: {
      email: "asc",
    },
  })

  // Récupérer les enregistrements d'assiduité existants pour ce cours à cette date
  const date = parse(dateParam, "yyyy-MM-dd", new Date())

  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const attendanceRecords = await prisma.attendanceRecord.findMany({
    where: {
      courseId,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      student: true,
    },
  })

  // Vérifier si l'appel a déjà été fait
  const alreadySubmitted = attendanceRecords.length > 0

  // Récupérer la session actuelle (si elle existe)
  const now = new Date()
  const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay()

  const todaySessions = await prisma.session.findMany({
    where: {
      courseId,
      dayOfWeek,
    },
  })

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

  // Trouver la session actuelle
  let currentSession = null
  if (todaySessions.length > 0 && format(now, "yyyy-MM-dd") === dateParam) {
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTimeInMinutes = currentHour * 60 + currentMinute

    currentSession = todaySessions.find((sessionItem) => {
      if (!sessionItem || !sessionItem.startTime || !sessionItem.endTime) {
        return false
      }

      try {
        const startTimeInMinutes = timeToMinutes(sessionItem.startTime)
        const endTimeInMinutes = timeToMinutes(sessionItem.endTime)
        return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes
      } catch (error) {
        return false
      }
    })
  }

  return (
    <CourseAttendanceClient
      course={course}
      students={students}
      attendanceRecords={attendanceRecords}
      date={date}
      alreadySubmitted={alreadySubmitted}
      currentSession={currentSession}
      professorId={session.user.id}
      establishmentId={establishmentId}
    />
  )
}
