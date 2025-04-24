"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentActivity } from "@/components/admin/recent-activity"
import { UpcomingEvents } from "@/components/admin/upcoming-events"

export function AdminOverview() {
  return (
    <Tabs defaultValue="activity" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:w-auto">
        <TabsTrigger value="activity">Activité récente</TabsTrigger>
        <TabsTrigger value="events">Événements à venir</TabsTrigger>
      </TabsList>
      <TabsContent value="activity" className="mt-4">
        <Card>
          <CardContent className="pt-6">
            <RecentActivity />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="events" className="mt-4">
        <Card>
          <CardContent className="pt-6">
            <UpcomingEvents />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
