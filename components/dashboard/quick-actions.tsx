"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, FileText, School, Settings } from "lucide-react"

const actions = [
  {
    title: "Ajouter un utilisateur",
    description: "Créer un nouveau compte utilisateur",
    icon: UserPlus,
    color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
  },
  {
    title: "Générer un rapport",
    description: "Créer un rapport personnalisé",
    icon: FileText,
    color: "text-green-500 bg-green-50 dark:bg-green-950/20",
  },
  {
    title: "Gérer les établissements",
    description: "Modifier les paramètres des écoles",
    icon: School,
    color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20",
  },
  {
    title: "Paramètres système",
    description: "Configurer les options du système",
    icon: Settings,
    color: "text-purple-500 bg-purple-50 dark:bg-purple-950/20",
  },
]

export function QuickActions() {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-2 pt-6 px-6">
        <CardTitle className="text-base font-medium">Actions rapides</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action, index) => (
            <Button key={index} variant="outline" className="h-auto justify-start p-3 border-dashed">
              <div className="flex items-center gap-3 w-full">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
