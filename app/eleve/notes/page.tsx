import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradesBySubject } from "@/components/eleve/grades-by-subject"
import { GradesOverview } from "@/components/eleve/grades-overview"
import { GradesTimeline } from "@/components/eleve/grades-timeline"

export const metadata: Metadata = {
  title: "Classio - Mes notes",
  description: "Consultez vos notes et évaluations",
}

export default function NotesPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Mes notes</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relevé de notes</CardTitle>
          <CardDescription>Consultez vos notes et évaluations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="apercu">
            <TabsList className="mb-6">
              <TabsTrigger value="apercu">Aperçu</TabsTrigger>
              <TabsTrigger value="matieres">Par matière</TabsTrigger>
              <TabsTrigger value="chronologie">Chronologie</TabsTrigger>
            </TabsList>

            <TabsContent value="apercu">
              {/*<GradesOverview />*/}
            </TabsContent>
            <TabsContent value="matieres">
              <GradesBySubject />
            </TabsContent>
            <TabsContent value="chronologie">
              <GradesTimeline />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
