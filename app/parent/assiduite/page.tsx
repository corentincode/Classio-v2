import type { Metadata } from "next"
import { AttendanceDetails } from "@/components/parent/attendance-details"
import { AttendanceCalendar } from "@/components/parent/attendance-calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Assiduité | Espace Parent",
  description: "Suivi des présences et absences de vos enfants",
}

export default function AttendancePage() {
  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Assiduité</h2>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full md:w-auto mb-4 grid grid-cols-2 md:flex md:space-x-2">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <AttendanceDetails />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <AttendanceCalendar />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
