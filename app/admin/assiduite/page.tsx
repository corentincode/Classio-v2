import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AttendanceFilters } from "@/components/admin/attendance-filters"
import { AttendanceTable } from "@/components/admin/attendance-table"
import { AttendanceStats } from "@/components/admin/attendance-stats"
import { AttendanceMarking } from "@/components/admin/attendance-marking"
import { JustificationManagement } from "@/components/admin/justification-management"

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion de l'assiduité</h1>
          <p className="text-muted-foreground">Suivi des présences, retards et absences des élèves</p>
        </div>
      </div>

      <Tabs defaultValue="suivi">
        <TabsList className="mb-4">
          <TabsTrigger value="suivi">Suivi des absences</TabsTrigger>
          <TabsTrigger value="appel">Appel des classes</TabsTrigger>
          <TabsTrigger value="justificatifs">Justificatifs</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="suivi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Suivi des absences et retards</CardTitle>
              <CardDescription>Consultez et gérez les absences et retards des élèves</CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceFilters />
              <div className="mt-4">
                <AttendanceTable />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appel des classes</CardTitle>
              <CardDescription>Effectuez l'appel pour les classes et enregistrez les présences</CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceMarking />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="justificatifs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des justificatifs</CardTitle>
              <CardDescription>Traitez les justificatifs d'absence et de retard</CardDescription>
            </CardHeader>
            <CardContent>
              <JustificationManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistiques" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques d'assiduité</CardTitle>
              <CardDescription>Visualisez les tendances d'assiduité par classe, niveau et période</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <AttendanceStats />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
