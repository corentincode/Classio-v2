"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const complianceItems = [
  {
    id: "c1",
    category: "Documentation",
    title: "Registre des traitements",
    description: "Maintenir un registre à jour de tous les traitements de données personnelles",
    completed: true,
    required: true,
  },
  {
    id: "c2",
    category: "Documentation",
    title: "Politique de confidentialité",
    description: "Document expliquant comment les données personnelles sont collectées et traitées",
    completed: true,
    required: true,
  },
  {
    id: "c3",
    category: "Documentation",
    title: "Procédure de violation de données",
    description: "Procédure à suivre en cas de violation de données personnelles",
    completed: true,
    required: true,
  },
  {
    id: "c4",
    category: "Technique",
    title: "Chiffrement des données sensibles",
    description: "Toutes les données sensibles doivent être chiffrées au repos et en transit",
    completed: false,
    required: true,
  },
  {
    id: "c5",
    category: "Technique",
    title: "Journalisation des accès",
    description: "Enregistrement de tous les accès aux données personnelles",
    completed: false,
    required: true,
  },
  {
    id: "c6",
    category: "Technique",
    title: "Minimisation des données",
    description: "Ne collecter que les données strictement nécessaires",
    completed: true,
    required: true,
  },
  {
    id: "c7",
    category: "Organisationnel",
    title: "Désignation d'un DPO",
    description: "Désignation d'un Délégué à la Protection des Données",
    completed: true,
    required: true,
  },
  {
    id: "c8",
    category: "Organisationnel",
    title: "Formation du personnel",
    description: "Formation régulière du personnel sur la protection des données",
    completed: false,
    required: true,
  },
  {
    id: "c9",
    category: "Droits des personnes",
    title: "Procédure d'exercice des droits",
    description: "Procédure permettant aux personnes d'exercer leurs droits RGPD",
    completed: true,
    required: true,
  },
  {
    id: "c10",
    category: "Droits des personnes",
    title: "Consentement explicite",
    description: "Obtention du consentement explicite pour les traitements basés sur le consentement",
    completed: true,
    required: true,
  },
]

export function ComplianceChecklist() {
  const [items, setItems] = useState(complianceItems)

  const toggleItem = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const completedCount = items.filter((item) => item.completed).length
  const totalCount = items.length
  const completionPercentage = Math.round((completedCount / totalCount) * 100)

  const categories = Array.from(new Set(items.map((item) => item.category)))

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Progression globale</h4>
          <span className="text-sm font-medium">{completionPercentage}%</span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>

      <div className="grid gap-6">
        {categories.map((category) => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle>{category}</CardTitle>
              <CardDescription>
                {category === "Documentation" && "Documents requis par le RGPD"}
                {category === "Technique" && "Mesures techniques de protection des données"}
                {category === "Organisationnel" && "Mesures organisationnelles"}
                {category === "Droits des personnes" && "Respect des droits des personnes concernées"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <div key={item.id} className="flex items-start space-x-4">
                      <Checkbox id={item.id} checked={item.completed} onCheckedChange={() => toggleItem(item.id)} />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={item.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {item.title}
                          </label>
                          {item.required && (
                            <Badge variant="outline" className="text-xs">
                              Obligatoire
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button>Générer un rapport de conformité</Button>
      </div>
    </div>
  )
}
