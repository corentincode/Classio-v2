import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradeManagement } from "@/components/admin/grade-management"
import { ReportGeneration } from "@/components/admin/report-generation"
import { GradeFilters } from "@/components/admin/grade-filters"

export default function GradesPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Bulletins et évaluations</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des notes et bulletins</CardTitle>
          <CardDescription>Gérez les évaluations et générez les bulletins</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="notes">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="notes">Saisie des notes</TabsTrigger>
                <TabsTrigger value="bulletins">Génération des bulletins</TabsTrigger>
              </TabsList>
              <GradeFilters />
            </div>

            <TabsContent value="notes" className="mt-6">
              <GradeManagement />
            </TabsContent>
            <TabsContent value="bulletins" className="mt-6">
              <ReportGeneration />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
