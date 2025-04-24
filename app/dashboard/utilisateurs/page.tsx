import type { Metadata } from "next"
import { UsersTable } from "@/components/dashboard/users-table"
import { UserFilters } from "@/components/dashboard/user-filters"

export const metadata: Metadata = {
  title: "Classio - Gestion des utilisateurs",
  description: "Gestion des utilisateurs de la plateforme Classio",
}

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium tracking-tight">Utilisateurs</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col gap-6">
          <UserFilters />
          <UsersTable />
        </div>
      </div>
    </div>
  )
}
