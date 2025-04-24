"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function UpcomingAssignments() {
  // Données fictives pour les devoirs à venir
  const assignments = [
    {
      id: 1,
      subject: "Mathématiques",
      title: "Exercices sur les équations",
      dueDate: "15/05/2023",
      teacher: "M. Dupont",
      status: "pending",
      priority: "high",
    },
    {
      id: 2,
      subject: "Français",
      title: "Dissertation sur Molière",
      dueDate: "18/05/2023",
      teacher: "Mme Laurent",
      status: "pending",
      priority: "medium",
    },
    {
      id: 3,
      subject: "Histoire-Géographie",
      title: "Exposé sur la Seconde Guerre mondiale",
      dueDate: "22/05/2023",
      teacher: "M. Martin",
      status: "pending",
      priority: "low",
    },
  ]

  return (
    <div className="space-y-4 bg-white rounded-lg border border-gray-100 shadow-sm p-4">
      {assignments.map((assignment) => (
        <div key={assignment.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{assignment.subject}</span>
              <Badge
                className={
                  assignment.priority === "high"
                    ? "bg-red-100 text-red-800 hover:bg-red-100 border-0"
                    : assignment.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-0"
                      : "bg-blue-100 text-blue-800 hover:bg-blue-100 border-0"
                }
              >
                {assignment.priority === "high" && "Prioritaire"}
                {assignment.priority === "medium" && "Normal"}
                {assignment.priority === "low" && "Faible"}
              </Badge>
            </div>
            <p className="text-sm mt-1">{assignment.title}</p>
            <p className="text-xs text-gray-500 mt-1">{assignment.teacher}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-sm font-medium">À rendre le {assignment.dueDate}</div>
            <Button size="sm" variant="outline">
              Voir
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
