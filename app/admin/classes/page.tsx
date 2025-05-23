import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { ClassesList } from "@/components/admin/classes-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const prisma = new PrismaClient()

export default async function AdminClassesPage() {
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

  return (
      <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Classes</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Classes</CardTitle>
            <CardDescription>Gérez les classes de votre établissement</CardDescription>
          </CardHeader>
          <CardContent>
            <ClassesList establishmentId={user.establishmentId} />
          </CardContent>
        </Card>
      </div>
  )
}
