"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"

const retentionPolicies = [
  {
    id: 1,
    dataType: "Données d'identification",
    description: "Nom, prénom, date de naissance, etc.",
    retention: "Durée de scolarité + 2 ans",
    status: "active",
    lastReview: "15/03/2023",
  },
  {
    id: 2,
    dataType: "Données de contact",
    description: "Adresse, téléphone, email, etc.",
    retention: "Durée de scolarité + 1 an",
    status: "active",
    lastReview: "15/03/2023",
  },
  {
    id: 3,
    dataType: "Données scolaires",
    description: "Notes, appréciations, bulletins, etc.",
    retention: "Durée de scolarité + 5 ans",
    status: "active",
    lastReview: "15/03/2023",
  },
  {
    id: 4,
    dataType: "Données de santé",
    description: "Informations médicales, allergies, etc.",
    retention: "Durée de scolarité",
    status: "active",
    lastReview: "15/03/2023",
  },
  {
    id: 5,
    dataType: "Données de connexion",
    description: "Logs de connexion, adresses IP, etc.",
    retention: "1 an",
    status: "active",
    lastReview: "15/03/2023",
  },
  {
    id: 6,
    dataType: "Documents administratifs",
    description: "Contrats, attestations, etc.",
    retention: "Durée légale (10 ans)",
    status: "active",
    lastReview: "15/03/2023",
  },
]

export function DataRetentionPolicy() {
  const [expandedPolicy, setExpandedPolicy] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Détection de la taille d'écran
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  const toggleExpandPolicy = (policyId: number) => {
    setExpandedPolicy(expandedPolicy === policyId ? null : policyId)
  }

  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 w-full max-w-full">
        <p className="text-sm text-muted-foreground">
          Définissez la durée de conservation des différentes catégories de données personnelles.
        </p>
        <Button>Modifier</Button>
      </div>

      {/* Version mobile du tableau */}
      {isMobile ? (
        <div className="space-y-3">
          {retentionPolicies.map((policy) => (
            <div key={policy.id} className="rounded-md border overflow-hidden">
              <div
                className="flex items-center p-3 cursor-pointer bg-background"
                onClick={() => toggleExpandPolicy(policy.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{policy.dataType}</div>
                  <div className="text-xs text-muted-foreground truncate">{policy.retention}</div>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 ml-2">
                  Active
                </Badge>
                <ChevronDown
                  className={`h-4 w-4 ml-2 transition-transform ${expandedPolicy === policy.id ? "rotate-180" : ""}`}
                />
              </div>

              {expandedPolicy === policy.id && (
                <div className="p-3 border-t bg-muted/30 space-y-2">
                  <div className="grid gap-2 text-sm">
                    <div>
                      <div className="font-medium text-xs text-muted-foreground">Description</div>
                      <div>{policy.description}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="font-medium text-xs text-muted-foreground">Durée</div>
                        <div>{policy.retention}</div>
                      </div>
                      <div>
                        <div className="font-medium text-xs text-muted-foreground">Dernière révision</div>
                        <div>{policy.lastReview}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                    <Button variant="ghost" size="sm">
                      Détails
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Version desktop du tableau (inchangée)
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type de données</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Durée de conservation</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière révision</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {retentionPolicies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">{policy.dataType}</TableCell>
                  <TableCell>{policy.description}</TableCell>
                  <TableCell>{policy.retention}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell>{policy.lastReview}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="rounded-md border p-4 bg-muted/50">
        <h3 className="text-sm font-medium mb-2">Informations importantes</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
          <li>Les durées de conservation sont définies conformément aux exigences du RGPD.</li>
          <li>Une procédure automatique de suppression est en place pour respecter ces durées.</li>
          <li>Les données sont anonymisées lorsque cela est possible plutôt que supprimées.</li>
          <li>Une révision annuelle des politiques de rétention est obligatoire.</li>
        </ul>
      </div>
    </div>
  )
}
