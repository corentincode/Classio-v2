import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { SecurityAlerts } from "@/components/dashboard/security-alerts"
import { ComplianceStatus } from "@/components/dashboard/compliance-status"

export function MobileOverview() {
  return (
    <div className="flex flex-col gap-4">
      <StatsCards />

      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity" className="text-xs px-1">
            Activité
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs px-1">
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="compliance" className="text-xs px-1">
            RGPD
          </TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="mt-2">
          <ActivityFeed />
        </TabsContent>
        <TabsContent value="security" className="mt-2">
          <SecurityAlerts />
        </TabsContent>
        <TabsContent value="compliance" className="mt-2">
          <ComplianceStatus />
        </TabsContent>
      </Tabs>
    </div>
  )
}
