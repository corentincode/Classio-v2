"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function TimeTable() {
  // Données fictives pour l'emploi du temps du jour
  const todaySchedule = [
    {
      id: 1,
      subject: "Mathématiques",
      time: "08:00 - 09:00",
      teacher: "M. Dupont",
      room: "Salle 102",
      status: "completed",
    },
    {
      id: 2,
      subject: "Français",
      time: "09:15 - 10:15",
      teacher: "Mme Laurent",
      room: "Salle 205",
      status: "completed",
    },
    {
      id: 3,
      subject: "Pause déjeuner",
      time: "12:00 - 13:00",
      teacher: "",
      room: "Cantine",
      status: "break",
    },
    {
      id: 4,
      subject: "Histoire-Géographie",
      time: "13:15 - 14:15",
      teacher: "M. Martin",
      room: "Salle 304",
      status: "current",
    },
    {
      id: 5,
      subject: "Sciences",
      time: "14:30 - 15:30",
      teacher: "Mme Dubois",
      room: "Labo 2",
      status: "upcoming",
    },
    {
      id: 6,
      subject: "Éducation physique",
      time: "15:45 - 16:45",
      teacher: "M. Bernard",
      room: "Gymnase",
      status: "upcoming",
    },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Emploi du temps</h2>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">Aujourd'hui</span>
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {todaySchedule.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between rounded-md p-2 ${
              item.status === "current"
                ? "bg-blue-50 border-l-4 border-blue-500"
                : item.status === "break"
                  ? "bg-gray-50"
                  : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium text-gray-500">{item.time}</div>
              <div>
                <div className="font-medium">{item.subject}</div>
                {item.teacher && <div className="text-xs text-gray-500">{item.teacher}</div>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500">{item.room}</div>
              {item.status === "completed" && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0">Terminé</Badge>
              )}
              {item.status === "current" && (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-0">En cours</Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
