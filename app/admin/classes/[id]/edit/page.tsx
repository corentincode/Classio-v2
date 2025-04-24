import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { AdminShell } from "@/components/admin/admin-shell"
import { EditClassForm } from "@/components/admin/edit-class-form"

const prisma = new PrismaClient()

export default async function EditClassPage({ params }: { params: { id: string } }) {
  // Assurons-nous que params.id est disponible
  const classId = params.id

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
    where: { id: classId },
  })

  // If class doesn't exist or doesn't belong to the admin's establishment, redirect
  if (!classData || classData.establishmentId !== user.establishmentId) {
    redirect("/admin/classes")
  }

  return (
      <EditClassForm classData={classData} establishmentId={user.establishmentId} />
  )
}
