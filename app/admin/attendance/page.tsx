import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { AdminAttendanceManagement } from "@/components/admin/attendance-management"
import prisma from "@/lib/prisma"

export default async function AdminAttendancePage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  if (session.user.role !== "ADMINISTRATION") {
    redirect("/")
  }

  // Récupérer les classes de l'établissement
  const classes = await prisma.class.findMany({
    where: {
      establishmentId: session.user.establishmentId as string,
    },
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          students: true,
        },
      },
    },
  })

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des absences et retards</h1>
      <AdminAttendanceManagement
        adminId={session.user.id}
        establishmentId={session.user.establishmentId as string}
        classes={classes}
      />
    </div>
  )
}
