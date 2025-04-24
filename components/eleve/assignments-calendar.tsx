"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fr } from "date-fns/locale"

export function AssignmentsCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Données fictives pour les devoirs
  const assignments = [
    {
      id: 1,
      subject: "Mathématiques",
      title: "Exercices sur les équations",
      dueDate: new Date(2023, 4, 15), // 15 mai 2023
      priority: "high",
    },
    {
      id: 2,
      subject: "Français",
      title: "Dissertation sur Molière",
      dueDate: new Date(2023, 4, 18), // 18 mai 2023
      priority: "medium",
    },
    {
      id: 3,
      subject: "Histoire-Géographie",
      title: "Exposé sur la Seconde Guerre mondiale",
      dueDate: new Date(2023, 4, 22), // 22 mai 2023
      priority: "low",
    },
    {
      id: 4,
      subject: "Sciences",
      title: "Rapport d'expérience",
      dueDate: new Date(2023, 4, 25), // 25 mai 2023
      priority: "medium",
    },
    {
      id: 5,
      subject: "Anglais",
      title: "Présentation orale",
      dueDate: new Date(2023, 4, 20), // 20 mai 2023
      priority: "medium",
    },
  ]

  // Fonction pour vérifier si une date a des devoirs
  const hasAssignments = (day: Date) => {
    return assignments.some(
      (assignment) =>
        assignment.dueDate.getDate() === day.getDate() &&
        assignment.dueDate.getMonth() === day.getMonth() &&
        assignment.dueDate.getFullYear() === day.getFullYear(),
    )
  }

  // Filtrer les devoirs pour la date sélectionnée
  const selectedDateAssignments = assignments.filter(
    (assignment) =>
      date &&
      assignment.dueDate.getDate() === date.getDate() &&
      assignment.dueDate.getMonth() === date.getMonth() &&
      assignment.dueDate.getFullYear() === date.getFullYear(),
  )

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={fr}
          modifiers={{
            hasAssignment: (date) => hasAssignments(date),
          }}
          modifiersClassNames={{
            hasAssignment: "bg-primary/10 font-bold text-primary",
          }}
          className="rounded-md border"
        />
      </div>
      <div>
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium">
              Devoirs pour le{" "}
              {date?.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h3>
            <div className="mt-4 space-y-3">
              {selectedDateAssignments.length === 0 ? (
                <p className="text-center text-muted-foreground">Aucun devoir pour cette date.</p>
              ) : (
                selectedDateAssignments.map((assignment) => (
                  <div key={assignment.id} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
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
                    <p className="mt-1">{assignment.title}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
