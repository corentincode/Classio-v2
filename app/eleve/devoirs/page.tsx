import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssignmentsList } from "@/components/eleve/assignments-list"
import { AssignmentsCalendar } from "@/components/eleve/assignments-calendar"

export const metadata: Metadata = {
  title: "Classio - Devoirs",
  description: "Gérez vos devoirs et travaux à rendre",
}

export default function DevoirsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Devoirs et travaux</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mes devoirs</CardTitle>
          <CardDescription>Suivez vos devoirs et travaux à rendre</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="liste">
            <TabsList className="mb-6">
              <TabsTrigger value="liste">Liste</TabsTrigger>
              <TabsTrigger value="calendrier">Calendrier</TabsTrigger>
            </TabsList>

            <TabsContent value="liste">
              <AssignmentsList />
            </TabsContent>
            <TabsContent value="calendrier">
              <AssignmentsCalendar />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
