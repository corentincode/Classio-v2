import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TeachersList } from "@/components/admin/teachers-list"
import { TeacherFilters } from "@/components/admin/teacher-filters"

export default function TeachersPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Gestion des enseignants</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un enseignant
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des enseignants</CardTitle>
          <CardDescription>Gérez l'équipe pédagogique de l'établissement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <TeacherFilters />
          </div>
          <TeachersList />
        </CardContent>
      </Card>
    </div>
  )
}
