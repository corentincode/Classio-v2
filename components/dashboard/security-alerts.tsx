import { AlertTriangle, ShieldOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const alerts = [
  {
    id: 1,
    title: "Tentative d'accès non autorisée",
    description: "Plusieurs tentatives de connexion échouées depuis l'IP 192.168.1.45",
    severity: "high",
    time: "Il y a 5 heures",
    icon: ShieldOff,
  },
  {
    id: 2,
    title: "Export massif de données",
    description: "Un administrateur a exporté plus de 1000 dossiers d'élèves",
    severity: "medium",
    time: "Il y a 1 jour",
    icon: AlertTriangle,
  },
]

export function SecurityAlerts() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Alertes de sécurité</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-start gap-3 rounded-lg border p-3 sm:p-4 ${
              alert.severity === "high"
                ? "border-destructive/50 bg-destructive/10"
                : "border-orange-500/50 bg-orange-500/10"
            }`}
          >
            <alert.icon
              className={`h-5 w-5 flex-shrink-0 ${alert.severity === "high" ? "text-destructive" : "text-orange-500"}`}
            />
            <div className="flex-1 space-y-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <p className="font-medium">{alert.title}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</span>
              </div>
              <p className="text-sm text-muted-foreground break-words">{alert.description}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className={`shrink-0 hidden sm:inline-flex ${
                alert.severity === "high"
                  ? "border-destructive/50 bg-destructive/10 hover:bg-destructive/20 text-destructive"
                  : "border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500"
              }`}
            >
              Examiner
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
