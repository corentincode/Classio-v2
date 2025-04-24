import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ClassesList } from "@/components/admin/classes-list"
import { ClassFilters } from "@/components/admin/class-filters"

export default function ClassesPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Gestion des classes</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Créer une classe
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des classes</CardTitle>
          <CardDescription>Gérez les classes de l'établissement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <ClassFilters />
          </div>
          <ClassesList />
        </CardContent>
      </Card>
    </div>
  )
}
