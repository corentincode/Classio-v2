import type { Metadata } from "next"
import { SchoolsTable } from "@/components/dashboard/schools-table"
import { AddEstablishmentForm } from "@/components/dashboard/add-establishment-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Classio - Gestion des établissements",
  description: "Gestion des établissements scolaires sur Classio",
}

export default async function SchoolsPage() {
  const session = await getServerSession(authOptions)

  // Redirect if not authenticated
  if (!session) {
    redirect("/auth/signin")
  }

  // Only admin can access this page
  if (session.user.role !== "SUPERADMIN" && session.user.role !== "ADMINISTRATION") {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Établissements scolaires</h1>
        <AddEstablishmentForm />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des établissements</CardTitle>
          <CardDescription>Gérez les établissements scolaires</CardDescription>
        </CardHeader>
        <CardContent>
          <SchoolsTable />
        </CardContent>
      </Card>
    </div>
  )
}
