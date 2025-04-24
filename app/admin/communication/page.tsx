import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessagingInterface } from "@/components/admin/messaging-interface"
import { AnnouncementManagement } from "@/components/admin/announcement-management"
import { EmailCampaigns } from "@/components/admin/email-campaigns"

export default function CommunicationPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Communication</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Outils de communication</CardTitle>
          <CardDescription>Gérez la communication avec les élèves, parents et enseignants</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="messagerie">
            <TabsList className="mb-6">
              <TabsTrigger value="messagerie">Messagerie</TabsTrigger>
              <TabsTrigger value="annonces">Annonces</TabsTrigger>
              <TabsTrigger value="emails">Campagnes d'emails</TabsTrigger>
            </TabsList>

            <TabsContent value="messagerie">
              <MessagingInterface />
            </TabsContent>
            <TabsContent value="annonces">
              <AnnouncementManagement />
            </TabsContent>
            <TabsContent value="emails">
              <EmailCampaigns />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
