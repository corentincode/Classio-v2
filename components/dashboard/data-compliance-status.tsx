"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const complianceItems = [
  {
    id: 1,
    name: "Consentements utilisateurs",
    status: "compliant",
    percentage: 100,
  },
  {
    id: 2,
    name: "Politique de rétention des données",
    status: "compliant",
    percentage: 100,
  },
  {
    id: 3,
    name: "Traitement des demandes d'accès",
    status: "warning",
    percentage: 85,
  },
  {
    id: 4,
    name: "Chiffrement des données sensibles",
    status: "compliant",
    percentage: 100,
  },
  {
    id: 5,
    name: "Journalisation des accès aux données",
    status: "non-compliant",
    percentage: 60,
  },
]

export function DataComplianceStatus() {
  const overallCompliance = Math.round(
    complianceItems.reduce((acc, item) => acc + item.percentage, 0) / complianceItems.length,
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Conformité globale</h4>
          <span className="text-sm font-medium">{overallCompliance}%</span>
        </div>
        <Progress value={overallCompliance} className="h-2" />
      </div>

      <div className="space-y-4">
        {complianceItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  item.status === "compliant"
                    ? "bg-green-500/10 text-green-500 hover:bg-green-500/10 hover:text-green-500"
                    : item.status === "warning"
                      ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-500"
                      : "bg-destructive/10 text-destructive hover:bg-destructive/10 hover:text-destructive"
                }
              >
                {item.status === "compliant" && "Conforme"}
                {item.status === "warning" && "À améliorer"}
                {item.status === "non-compliant" && "Non conforme"}
              </Badge>
              <span className="text-sm">{item.name}</span>
            </div>
            <span className="text-sm font-medium">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
