import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimeTableView } from "@/components/admin/time-table-view"
import { TimeTableFilters } from "@/components/admin/time-table-filters"

export default function TimeTablePage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Emplois du temps</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des emplois du temps</CardTitle>
          <CardDescription>Consultez et modifiez les emplois du temps</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="classes">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="classes">Classes</TabsTrigger>
                <TabsTrigger value="enseignants">Enseignants</TabsTrigger>
                <TabsTrigger value="salles">Salles</TabsTrigger>
              </TabsList>
              <TimeTableFilters />
            </div>

            <TabsContent value="classes" className="mt-6">
              <TimeTableView type="class" />
            </TabsContent>
            <TabsContent value="enseignants" className="mt-6">
              <TimeTableView type="teacher" />
            </TabsContent>
            <TabsContent value="salles" className="mt-6">
              <TimeTableView type="room" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
