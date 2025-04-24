"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"

export function SystemSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Paramètres système</h3>
        <p className="text-sm text-muted-foreground">Configurez les paramètres généraux du système.</p>
      </div>
      <Separator />
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="maintenance-mode">Mode maintenance</Label>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Activer le mode maintenance</p>
              <p className="text-xs text-muted-foreground">
                Empêche l'accès à la plateforme pour les utilisateurs non administrateurs.
              </p>
            </div>
            <Switch id="maintenance-mode" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="system-notifications">Notifications système</Label>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Activer les notifications système</p>
              <p className="text-xs text-muted-foreground">Envoie des notifications importantes aux administrateurs.</p>
            </div>
            <Switch id="system-notifications" defaultChecked />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="api-keys">Clés API</Label>
          <Textarea
            id="api-keys"
            placeholder="Entrez vos clés API ici"
            rows={3}
            className="resize-none"
            defaultValue="API_KEY_1=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
API_KEY_2=yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  )
}
"
\
