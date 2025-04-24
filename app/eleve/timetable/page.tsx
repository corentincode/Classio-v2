import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { EleveTimetable } from "@/components/eleve/eleve-timetable"

export default async function EleveTimetablePage() {
  const session = await getServerSession(authOptions)

  // Redirect if not authenticated
  if (!session) {
    redirect("/auth/signin")
  }

  // Only students can access this page
  if (session.user.role !== "ELEVE") {
    redirect("/dashboard")
  }

  // Get the user details
  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
    select: {
      id: true,
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

  // If the student has no establishment, redirect
  if (!user.establishmentId) {
    redirect("/eleve/no-establishment")
  }

  // If the student is not enrolled in any class, redirect
  if (user.studentClasses.length === 0) {
    redirect("/eleve/no-class")
  }

  // Get the current class
  const currentClass = user.studentClasses[0].class

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Mon emploi du temps</h1>
      <EleveTimetable userId={user.id} classId={currentClass.id} establishmentId={user.establishmentId} />
    </div>
  )
}
