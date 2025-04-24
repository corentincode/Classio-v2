"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, Users, School, FileText, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

const metrics = [
  {
    title: "Utilisateurs actifs",
    value: "8,249",
    change: "+12.5%",
    trend: "up",
    description: "vs mois précédent",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "Établissements",
    value: "342",
    change: "+4.3%",
    trend: "up",
    description: "vs mois précédent",
    icon: School,
    color: "bg-green-500",
  },
  {
    title: "Documents générés",
    value: "12,543",
    change: "-2.1%",
    trend: "down",
    description: "vs mois précédent",
    icon: FileText,
    color: "bg-amber-500",
  },
  {
    title: "Alertes de sécurité",
    value: "3",
    change: "-50%",
    trend: "down",
    description: "vs mois précédent",
    icon: ShieldAlert,
    color: "bg-red-500",
  },
]

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="overflow-hidden border-none shadow-md">
          <div className={cn("h-1", metric.color)} />
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
              </div>
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", metric.color + "/10")}>
                <metric.icon className={cn("h-5 w-5", metric.color.replace("bg-", "text-"))} />
              </div>
            </div>
            <div className="flex items-center mt-3">
              <div
                className={cn(
                  "flex items-center text-xs font-medium",
                  metric.trend === "up" ? "text-green-600" : "text-red-600",
                )}
              >
                {metric.trend === "up" ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                {metric.change}
              </div>
              <div className="text-xs text-muted-foreground ml-2">{metric.description}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
