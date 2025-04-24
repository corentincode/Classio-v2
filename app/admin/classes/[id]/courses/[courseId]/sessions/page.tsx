import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { AdminShell } from "@/components/admin/admin-shell"
import { CourseSessionsList } from "@/components/admin/course-sessions-list"

const prisma = new PrismaClient()

export default async function AdminCourseSessionsPage({
  params,
}: {
  params: { id: string; courseId: string }
}) {
  const session = await getServerSession(authOptions)

  // Redirect if not authenticated
  if (!session) {
    redirect("/auth/signin")
  }

  // Only admin can access this page
  if (session.user.role !== "ADMINISTRATION") {
    redirect("/dashboard")
  }

  // Get the establishment ID for the admin
  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
    select: { establishmentId: true },
  })

  if (!user?.establishmentId) {
    redirect("/admin/no-establishment")
  }

  // Get the class details
  const classData = await prisma.class.findUnique({
    where: { id: params.id },
  })

  // If class doesn't exist or doesn't belong to the admin's establishment, redirect
  if (!classData || classData.establishmentId !== user.establishmentId) {
    redirect("/admin/classes")
  }

  // Get the course details
  const courseData = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      professor: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  })

  // If course doesn't exist or doesn't belong to the class, redirect
  if (!courseData || courseData.classId !== params.id) {
    redirect(`/admin/classes/${params.id}/courses`)
  }

  return (
      <CourseSessionsList classData={classData} courseData={courseData} establishmentId={user.establishmentId} />
  )
}
