"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ShieldOff, ArrowRight, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

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
  {
    id: 3,
    title: "Mise à jour de sécurité disponible",
    description: "Une nouvelle mise à jour de sécurité est disponible pour le système",
    severity: "low",
    time: "Il y a 2 jours",
    icon: AlertCircle,
  },
]

export function RecentAlerts() {
  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
        <CardTitle className="text-base font-medium">Alertes de sécurité</CardTitle>
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
          Voir tout <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-lg",
                alert.severity === "high"
                  ? "bg-red-50 dark:bg-red-950/20"
                  : alert.severity === "medium"
                    ? "bg-amber-50 dark:bg-amber-950/20"
                    : "bg-blue-50 dark:bg-blue-950/20",
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0",
                  alert.severity === "high"
                    ? "bg-red-100 dark:bg-red-900/30"
                    : alert.severity === "medium"
                      ? "bg-amber-100 dark:bg-amber-900/30"
                      : "bg-blue-100 dark:bg-blue-900/30",
                )}
              >
                <alert.icon
                  className={cn(
                    "h-5 w-5",
                    alert.severity === "high"
                      ? "text-red-600 dark:text-red-400"
                      : alert.severity === "medium"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-blue-600 dark:text-blue-400",
                  )}
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p
                    className={cn(
                      "font-medium",
                      alert.severity === "high"
                        ? "text-red-800 dark:text-red-300"
                        : alert.severity === "medium"
                          ? "text-amber-800 dark:text-amber-300"
                          : "text-blue-800 dark:text-blue-300",
                    )}
                  >
                    {alert.title}
                  </p>
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 text-xs",
                      alert.severity === "high"
                        ? "border-red-200 hover:border-red-300 text-red-600 dark:border-red-800 dark:hover:border-red-700 dark:text-red-400"
                        : alert.severity === "medium"
                          ? "border-amber-200 hover:border-amber-300 text-amber-600 dark:border-amber-800 dark:hover:border-amber-700 dark:text-amber-400"
                          : "border-blue-200 hover:border-blue-300 text-blue-600 dark:border-blue-800 dark:hover:border-blue-700 dark:text-blue-400",
                    )}
                  >
                    Examiner
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </>
  )
}
