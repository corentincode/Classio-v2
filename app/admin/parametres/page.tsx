import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SchoolSettings } from "@/components/admin/school-settings"
import { UserPermissions } from "@/components/admin/user-permissions"
import { SystemSettings } from "@/components/admin/system-settings"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Paramètres</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration de l'établissement</CardTitle>
          <CardDescription>Gérez les paramètres de votre établissement</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="etablissement">
            <TabsList className="mb-6">
              <TabsTrigger value="etablissement">Établissement</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="systeme">Système</TabsTrigger>
            </TabsList>

            <TabsContent value="etablissement">
              <SchoolSettings />
            </TabsContent>
            <TabsContent value="permissions">
              <UserPermissions />
            </TabsContent>
            <TabsContent value="systeme">
              <SystemSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
