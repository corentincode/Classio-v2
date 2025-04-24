"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download, Printer } from "lucide-react"

interface TimeTableViewProps {
  type: "class" | "teacher" | "room"
}

const timeSlots = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
]

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]

const classOptions = ["6ème A", "5ème B", "4ème C", "3ème A", "2nde 3", "1ère S2", "Term ES1"]
const teacherOptions = [
  "Sophie Dupont",
  "Thomas Martin",
  "Julie Bernard",
  "Nicolas Petit",
  "Émilie Leroy",
  "Pierre Moreau",
  "Marie Lefebvre",
]
const roomOptions = ["A101", "A102", "B201", "B202", "C301", "C302", "Gymnase", "CDI", "Labo Physique", "Labo SVT"]

export function TimeTableView({ type }: TimeTableViewProps) {
  const [selectedOption, setSelectedOption] = useState(
    type === "class" ? classOptions[0] : type === "teacher" ? teacherOptions[0] : roomOptions[0],
  )

  const options = type === "class" ? classOptions : type === "teacher" ? teacherOptions : roomOptions
  const label = type === "class" ? "Classe" : type === "teacher" ? "Enseignant" : "Salle"

  // Exemple de données d'emploi du temps (simplifiées)
  const timetableData = {
    Lundi: {
      "08:00 - 09:00": { subject: "Mathématiques", teacher: "Sophie Dupont", room: "A101", class: "6ème A" },
      "09:00 - 10:00": { subject: "Français", teacher: "Thomas Martin", room: "A102", class: "6ème A" },
      "10:00 - 11:00": { subject: "Histoire-Géo", teacher: "Julie Bernard", room: "B201", class: "6ème A" },
      "11:00 - 12:00": { subject: "Anglais", teacher: "Émilie Leroy", room: "B202", class: "6ème A" },
      "14:00 - 15:00": { subject: "SVT", teacher: "Marie Lefebvre", room: "Labo SVT", class: "6ème A" },
      "15:00 - 16:00": { subject: "Physique-Chimie", teacher: "Nicolas Petit", room: "Labo Physique", class: "6ème A" },
    },
    Mardi: {
      "08:00 - 09:00": { subject: "EPS", teacher: "Pierre Moreau", room: "Gymnase", class: "6ème A" },
      "09:00 - 10:00": { subject: "EPS", teacher: "Pierre Moreau", room: "Gymnase", class: "6ème A" },
      "10:00 - 11:00": { subject: "Mathématiques", teacher: "Sophie Dupont", room: "A101", class: "6ème A" },
      "11:00 - 12:00": { subject: "Français", teacher: "Thomas Martin", room: "A102", class: "6ème A" },
      "14:00 - 15:00": { subject: "Arts plastiques", teacher: "Claire Dubois", room: "C301", class: "6ème A" },
      "15:00 - 16:00": { subject: "Musique", teacher: "Julien Blanc", room: "C302", class: "6ème A" },
    },
    Mercredi: {
      "08:00 - 09:00": { subject: "Mathématiques", teacher: "Sophie Dupont", room: "A101", class: "6ème A" },
      "09:00 - 10:00": { subject: "Histoire-Géo", teacher: "Julie Bernard", room: "B201", class: "6ème A" },
      "10:00 - 11:00": { subject: "Anglais", teacher: "Émilie Leroy", room: "B202", class: "6ème A" },
      "11:00 - 12:00": { subject: "Technologie", teacher: "Paul Roux", room: "C301", class: "6ème A" },
    },
    Jeudi: {
      "08:00 - 09:00": { subject: "Français", teacher: "Thomas Martin", room: "A102", class: "6ème A" },
      "09:00 - 10:00": { subject: "Mathématiques", teacher: "Sophie Dupont", room: "A101", class: "6ème A" },
      "10:00 - 11:00": { subject: "SVT", teacher: "Marie Lefebvre", room: "Labo SVT", class: "6ème A" },
      "11:00 - 12:00": { subject: "Physique-Chimie", teacher: "Nicolas Petit", room: "Labo Physique", class: "6ème A" },
      "14:00 - 15:00": { subject: "Anglais", teacher: "Émilie Leroy", room: "B202", class: "6ème A" },
      "15:00 - 16:00": { subject: "Histoire-Géo", teacher: "Julie Bernard", room: "B201", class: "6ème A" },
    },
    Vendredi: {
      "08:00 - 09:00": { subject: "Français", teacher: "Thomas Martin", room: "A102", class: "6ème A" },
      "09:00 - 10:00": { subject: "Mathématiques", teacher: "Sophie Dupont", room: "A101", class: "6ème A" },
      "10:00 - 11:00": { subject: "Technologie", teacher: "Paul Roux", room: "C301", class: "6ème A" },
      "11:00 - 12:00": { subject: "Vie de classe", teacher: "Thomas Martin", room: "A102", class: "6ème A" },
      "14:00 - 15:00": { subject: "EPS", teacher: "Pierre Moreau", room: "Gymnase", class: "6ème A" },
      "15:00 - 16:00": { subject: "EPS", teacher: "Pierre Moreau", room: "Gymnase", class: "6ème A" },
    },
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Select value={selectedOption} onValueChange={setSelectedOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={`Sélectionner un(e) ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Semaine précédente</span>
            </Button>
            <span className="text-sm font-medium">Semaine 19 (8-12 mai 2023)</span>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Semaine suivante</span>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-6 gap-1">
            <div className="p-2 font-medium text-center bg-muted rounded-tl-md"></div>
            {days.map((day) => (
              <div key={day} className="p-2 font-medium text-center bg-muted">
                {day}
              </div>
            ))}
          </div>

          {timeSlots.map((timeSlot, index) => (
            <div key={timeSlot} className="grid grid-cols-6 gap-1">
              <div
                className={`p-2 text-sm text-center bg-muted ${index === timeSlots.length - 1 ? "rounded-bl-md" : ""}`}
              >
                {timeSlot}
              </div>
              {days.map((day, dayIndex) => {
                const lesson = timetableData[day]?.[timeSlot]
                const isLunch = timeSlot === "12:00 - 13:00" || timeSlot === "13:00 - 14:00"

                return (
                  <Card
                    key={`${day}-${timeSlot}`}
                    className={`border-0 ${isLunch ? "bg-muted/50" : lesson ? "bg-primary/10" : "bg-muted/30"} ${dayIndex === days.length - 1 && index === timeSlots.length - 1 ? "rounded-br-md" : ""}`}
                  >
                    <CardContent className="p-2 text-xs">
                      {isLunch ? (
                        <div className="text-center text-muted-foreground">Pause déjeuner</div>
                      ) : lesson ? (
                        <div className="space-y-1">
                          <div className="font-medium">{lesson.subject}</div>
                          <div className="text-muted-foreground">{type !== "teacher" && lesson.teacher}</div>
                          <div className="text-muted-foreground">{type !== "room" && lesson.room}</div>
                          <div className="text-muted-foreground">{type !== "class" && lesson.class}</div>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
