import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataRetentionPolicy } from "@/components/dashboard/data-retention-policy"
import { DataAccessRequests } from "@/components/dashboard/data-access-requests"
import { DataDeletionRequests } from "@/components/dashboard/data-deletion-requests"
import { ComplianceChecklist } from "@/components/dashboard/compliance-checklist"

export const metadata: Metadata = {
  title: "Classio - Conformité RGPD",
  description: "Gestion de la conformité RGPD et protection des données",
}

export default function RGPDPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Conformité RGPD</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Protection des données</CardTitle>
          <CardDescription>Gestion des données personnelles</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="checklist">
            <TabsList className="mb-6">
              <TabsTrigger value="checklist">Checklist de conformité</TabsTrigger>
              <TabsTrigger value="retention">Politique de rétention</TabsTrigger>
              <TabsTrigger value="access">Demandes d'accès</TabsTrigger>
              <TabsTrigger value="deletion">Demandes de suppression</TabsTrigger>
            </TabsList>

            <TabsContent value="checklist">
              <ComplianceChecklist />
            </TabsContent>
            <TabsContent value="retention">
              <DataRetentionPolicy />
            </TabsContent>
            <TabsContent value="access">
              <DataAccessRequests />
            </TabsContent>
            <TabsContent value="deletion">
              <DataDeletionRequests />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
