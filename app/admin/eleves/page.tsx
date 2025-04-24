import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { StudentsList } from "@/components/admin/students-list"
import { StudentFilters } from "@/components/admin/student-filters"

export default function StudentsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Gestion des élèves</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un élève
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des élèves</CardTitle>
          <CardDescription>Gérez les dossiers des élèves de l'établissement</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tous">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="tous">Tous</TabsTrigger>
                <TabsTrigger value="college">Collège</TabsTrigger>
                <TabsTrigger value="lycee">Lycée</TabsTrigger>
              </TabsList>
              <StudentFilters />
            </div>

            <TabsContent value="tous" className="mt-6">
              <StudentsList />
            </TabsContent>
            <TabsContent value="college" className="mt-6">
              <StudentsList level="college" />
            </TabsContent>
            <TabsContent value="lycee" className="mt-6">
              <StudentsList level="lycee" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
