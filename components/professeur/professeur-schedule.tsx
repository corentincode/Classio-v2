"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Course {
  id: string
  name: string
  color: string
  class: {
    id: string
    name: string
  }
}

interface Session {
  id: string
  title: string | null
  description: string | null
  dayOfWeek: number
  startTime: string | Date
  endTime: string | Date
  room: string | null
  recurrent: boolean
  course: Course
}

interface ProfesseurScheduleProps {
  sessions: Session[]
  courses: Course[]
  establishmentId: string
}

export function ProfesseurSchedule({ sessions, courses, establishmentId }: ProfesseurScheduleProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all")
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date()
    const day = today.getDay() || 7 // Convert Sunday (0) to 7
    const diff = today.getDate() - day + 1 // Adjust to Monday
    return new Date(today.setDate(diff))
  })
  const [filteredSessions, setFilteredSessions] = useState<Session[]>(sessions)
  const [weekDays, setWeekDays] = useState<Date[]>([])

  // Générer les jours de la semaine
  useEffect(() => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart)
      day.setDate(day.getDate() + i)
      days.push(day)
    }
    setWeekDays(days)
  }, [currentWeekStart])

  // Filtrer les sessions en fonction du cours sélectionné
  useEffect(() => {
    if (selectedCourseId === "all") {
      setFilteredSessions(sessions)
    } else {
      setFilteredSessions(sessions.filter((session) => session.course.id === selectedCourseId))
    }
  }, [selectedCourseId, sessions])

  // Naviguer à la semaine précédente
  const goToPreviousWeek = () => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(newStart.getDate() - 7)
    setCurrentWeekStart(newStart)
  }

  // Naviguer à la semaine suivante
  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(newStart.getDate() + 7)
    setCurrentWeekStart(newStart)
  }

  // Revenir à la semaine actuelle
  const goToCurrentWeek = () => {
    const today = new Date()
    const day = today.getDay() || 7 // Convert Sunday (0) to 7
    const diff = today.getDate() - day + 1 // Adjust to Monday
    setCurrentWeekStart(new Date(today.setDate(diff)))
  }

  // Formater l'heure
  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Vérifier si une date est aujourd'hui
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Vérifier si deux dates sont le même jour
  const isSameDay = (date1: Date, date2: Date | string) => {
    const d2 = new Date(date2)
    return (
      date1.getDate() === d2.getDate() && date1.getMonth() === d2.getMonth() && date1.getFullYear() === d2.getFullYear()
    )
  }

  // Obtenir les sessions pour un jour spécifique
  const getSessionsForDay = (day: Date) => {
    // Convertir le jour de la semaine de Date (0 = dimanche, 1 = lundi, ...)
    // à notre format (1 = lundi, 2 = mardi, ..., 0 = dimanche)
    const dayOfWeek = day.getDay()

    return filteredSessions
      .filter((session) => {
        // Si la session est récurrente, vérifier si le jour de la semaine correspond
        if (session.recurrent) {
          return session.dayOfWeek === dayOfWeek
        } else {
          // Si la session n'est pas récurrente, vérifier si la date correspond exactement
          return isSameDay(day, session.startTime)
        }
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToCurrentWeek}>
            Aujourd'hui
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm font-medium">
          Semaine du {formatDate(currentWeekStart)} au{" "}
          {formatDate(new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000))}
        </div>
        <div className="w-full sm:w-64">
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les cours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les cours</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name} - {course.class.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, index) => (
          <Card key={index} className={`${isToday(day) ? "border-primary" : ""}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-center">
                {day.toLocaleDateString("fr-FR", { weekday: "long" }).charAt(0).toUpperCase() +
                  day.toLocaleDateString("fr-FR", { weekday: "long" }).slice(1)}
                <div className={`text-lg mt-1 ${isToday(day) ? "text-primary font-bold" : ""}`}>{day.getDate()}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {getSessionsForDay(day).length === 0 ? (
                <div className="text-center py-4 text-sm text-gray-500">Aucun cours</div>
              ) : (
                <div className="space-y-2">
                  {getSessionsForDay(day).map((session) => (
                    <Link
                      key={session.id}
                      href={`/professeur/sessions/${session.id}?establishmentId=${establishmentId}`}
                      className="block"
                    >
                      <div
                        className="p-2 rounded-md text-white text-sm"
                        style={{ backgroundColor: session.course.color || "#3b82f6" }}
                      >
                        <div className="font-medium truncate">{session.title || session.course.name}</div>
                        <div className="flex items-center text-xs mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </div>
                        <div className="flex items-center text-xs mt-1">
                          <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                            {session.course.class.name}
                          </Badge>
                        </div>
                        {session.room && (
                          <div className="flex items-center text-xs mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {session.room}
                          </div>
                        )}
                        {!session.recurrent && (
                          <Badge variant="outline" className="bg-white/20 text-white border-white/30 mt-1">
                            Session unique
                          </Badge>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
