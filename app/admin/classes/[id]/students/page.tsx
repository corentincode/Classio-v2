import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { ClassStudentsList } from "@/components/admin/class-students-list"

const prisma = new PrismaClient()

export default async function AdminClassStudentsPage({ params }: { params: { id: string } }) {
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

  return (
      <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Élèves de la classe {classData.name}</h1>
        </div>

        <ClassStudentsList classId={params.id} establishmentId={user.establishmentId} />
      </div>
  )
}
