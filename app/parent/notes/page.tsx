import type { Metadata } from "next"
import { GradesOverview } from "@/components/parent/grades-overview"
import { GradesBySubject } from "@/components/parent/grades-by-subject"
import { GradesTimeline } from "@/components/parent/grades-timeline"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Notes | Espace Parent",
  description: "Suivi des notes de vos enfants",
}

export default function GradesPage() {
  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Notes</h2>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full md:w-auto mb-4 grid grid-cols-3 md:flex md:space-x-2">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="subjects">Par matière</TabsTrigger>
            <TabsTrigger value="timeline">Chronologie</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <GradesOverview />
          </TabsContent>

          <TabsContent value="subjects" className="space-y-4">
            <GradesBySubject />
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <GradesTimeline />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
