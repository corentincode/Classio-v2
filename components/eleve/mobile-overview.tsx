import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimeTable } from "@/components/eleve/time-table"
import { UpcomingAssignments } from "@/components/eleve/upcoming-assignments"
import { RecentGrades } from "@/components/eleve/recent-grades"
import { Announcements } from "@/components/eleve/announcements"

export function MobileOverview() {
  return (
    <div className="flex flex-col gap-4">
      <TimeTable />

      <Tabs defaultValue="devoirs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="devoirs" className="text-xs px-1">
            Devoirs
          </TabsTrigger>
          <TabsTrigger value="notes" className="text-xs px-1">
            Notes
          </TabsTrigger>
          <TabsTrigger value="annonces" className="text-xs px-1">
            Annonces
          </TabsTrigger>
        </TabsList>
        <TabsContent value="devoirs" className="mt-2">
          <UpcomingAssignments />
        </TabsContent>
        <TabsContent value="notes" className="mt-2">
          <RecentGrades />
        </TabsContent>
        <TabsContent value="annonces" className="mt-2">
          <Announcements />
        </TabsContent>
      </Tabs>
    </div>
  )
}
