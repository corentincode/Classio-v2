"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function AssignmentsList() {
  const [searchQuery, setSearchQuery] = useState("")

  // Données fictives pour les devoirs
  const assignments = [
    {
      id: 1,
      subject: "Mathématiques",
      title: "Exercices sur les équations",
      description: "Résoudre les exercices 1 à 10 page 45 du manuel.",
      dueDate: "15/05/2023",
      assignedDate: "08/05/2023",
      teacher: "M. Dupont",
      status: "pending",
      priority: "high",
    },
    {
      id: 2,
      subject: "Français",
      title: "Dissertation sur Molière",
      description: "Rédiger une dissertation de 3 pages sur l'œuvre de Molière.",
      dueDate: "18/05/2023",
      assignedDate: "05/05/2023",
      teacher: "Mme Laurent",
      status: "pending",
      priority: "medium",
    },
    {
      id: 3,
      subject: "Histoire-Géographie",
      title: "Exposé sur la Seconde Guerre mondiale",
      description: "Préparer un exposé de 15 minutes sur un aspect de la Seconde Guerre mondiale.",
      dueDate: "22/05/2023",
      assignedDate: "01/05/2023",
      teacher: "M. Martin",
      status: "pending",
      priority: "low",
    },
    {
      id: 4,
      subject: "Sciences",
      title: "Rapport d'expérience",
      description: "Rédiger un rapport sur l'expérience réalisée en laboratoire.",
      dueDate: "25/05/2023",
      assignedDate: "10/05/2023",
      teacher: "Mme Dubois",
      status: "pending",
      priority: "medium",
    },
    {
      id: 5,
      subject: "Anglais",
      title: "Présentation orale",
      description: "Préparer une présentation orale de 5 minutes sur un sujet libre.",
      dueDate: "20/05/2023",
      assignedDate: "03/05/2023",
      teacher: "M. Johnson",
      status: "pending",
      priority: "medium",
    },
    {
      id: 6,
      subject: "Mathématiques",
      title: "Contrôle sur les fonctions",
      description: "Réviser les chapitres 5 et 6 pour le contrôle.",
      dueDate: "05/05/2023",
      assignedDate: "28/04/2023",
      teacher: "M. Dupont",
      status: "completed",
      priority: "high",
      grade: "16/20",
    },
    {
      id: 7,
      subject: "Français",
      title: "Commentaire de texte",
      description: "Rédiger un commentaire de texte sur l'extrait distribué en classe.",
      dueDate: "02/05/2023",
      assignedDate: "25/04/2023",
      teacher: "Mme Laurent",
      status: "completed",
      priority: "medium",
      grade: "14/20",
    },
  ]

  // Filtrer les devoirs en fonction de l'onglet et de la recherche
  const pendingAssignments = assignments
    .filter((a) => a.status === "pending")
    .filter(
      (a) =>
        a.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  const completedAssignments = assignments
    .filter((a) => a.status === "completed")
    .filter(
      (a) =>
        a.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher un devoir..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">À faire ({pendingAssignments.length})</TabsTrigger>
          <TabsTrigger value="completed">Terminés ({completedAssignments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <div className="space-y-4">
            {pendingAssignments.length === 0 ? (
              <div className="rounded-md border p-4 text-center text-muted-foreground">
                Aucun devoir à faire pour le moment.
              </div>
            ) : (
              pendingAssignments.map((assignment) => (
                <div key={assignment.id} className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{assignment.subject}</span>
                      <Badge
                        variant="outline"
                        className={
                          assignment.priority === "high"
                            ? "bg-red-500/10 text-red-500"
                            : assignment.priority === "medium"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-blue-500/10 text-blue-500"
                        }
                      >
                        {assignment.priority === "high" && "Prioritaire"}
                        {assignment.priority === "medium" && "Normal"}
                        {assignment.priority === "low" && "Faible"}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium">À rendre le {assignment.dueDate}</div>
                  </div>
                  <h3 className="mt-2 text-lg font-medium">{assignment.title}</h3>
                  <p className="mt-1 text-sm">{assignment.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Assigné le {assignment.assignedDate} par {assignment.teacher}
                    </div>
                    <Button>Voir le devoir</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <div className="space-y-4">
            {completedAssignments.length === 0 ? (
              <div className="rounded-md border p-4 text-center text-muted-foreground">Aucun devoir terminé.</div>
            ) : (
              completedAssignments.map((assignment) => (
                <div key={assignment.id} className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{assignment.subject}</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        Terminé
                      </Badge>
                    </div>
                    <div className="text-lg font-bold">{assignment.grade}</div>
                  </div>
                  <h3 className="mt-2 text-lg font-medium">{assignment.title}</h3>
                  <p className="mt-1 text-sm">{assignment.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Rendu le {assignment.dueDate} • {assignment.teacher}
                    </div>
                    <Button variant="outline">Voir le devoir</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
