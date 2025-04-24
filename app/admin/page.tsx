import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentActivity } from "@/components/admin/recent-activity"
import { UpcomingEvents } from "@/components/admin/upcoming-events"
import { AttendanceStats } from "@/components/admin/attendance-stats"
import { GradeDistribution } from "@/components/admin/grade-distribution"

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Lycée Victor Hugo</span>
          <span className="text-sm font-medium">|</span>
          <span className="text-sm text-muted-foreground">Année scolaire 2023-2024</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Événements à venir</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingEvents />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Statistiques de présence</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceStats />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Distribution des notes</CardTitle>
          </CardHeader>
          <CardContent>
            <GradeDistribution />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
