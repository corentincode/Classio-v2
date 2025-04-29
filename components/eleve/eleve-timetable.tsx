"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, BookOpen, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, addDays, startOfWeek } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Session = {
  id: string
  title: string | null
  description: string | null
  startTime: string
  endTime: string
  recurrent: boolean
  dayOfWeek: number
  room: string | null
  course: {
    id: string
    name: string
    color: string | null
    professor: {
      id: string
      email: string
    }
  }
}

interface EleveTimetableProps {
  userId: string
  classId: string
  establishmentId: string
}

// Fonction pour obtenir le nom du jour de la semaine
const getDayName = (dayIndex: number): string => {
  const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
  return days[dayIndex]
}

// Fonction pour formater l'heure (HH:MM)
const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", hour12: false })
}

export function EleveTimetable({ userId, classId, establishmentId }: EleveTimetableProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }))

  // Récupérer toutes les sessions des cours de la classe
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/establishments/${establishmentId}/classes/${classId}/timetable`)

        if (!response.ok) {
          throw new Error("Impossible de charger l'emploi du temps")
        }

        const data = await response.json()
        setSessions(data)
      } catch (error) {
        console.error("Error fetching timetable:", error)
        setError("Impossible de charger l'emploi du temps")
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [classId, establishmentId])

  // Fonction pour naviguer à la semaine précédente
  const goToPreviousWeek = () => {
    setCurrentWeekStart((prevWeek) => addDays(prevWeek, -7))
  }

  // Fonction pour naviguer à la semaine suivante
  const goToNextWeek = () => {
    setCurrentWeekStart((prevWeek) => addDays(prevWeek, 7))
  }

  // Fonction pour revenir à la semaine actuelle
  const goToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
  }

  // Générer les jours de la semaine actuelle
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(currentWeekStart, i))

  // Fonction pour vérifier si une session est pour un jour spécifique
  const getSessionsForDay = (day: Date, sessions: Session[]) => {
    return sessions
      .filter((session) => {
        if (session.recurrent) {
          // Pour les sessions récurrentes, vérifier le jour de la semaine
          return session.dayOfWeek === day.getDay()
        } else {
          // Pour les sessions non récurrentes, vérifier la date exacte
          const sessionDate = new Date(session.startTime)
          return (
            sessionDate.getDate() === day.getDate() &&
            sessionDate.getMonth() === day.getMonth() &&
            sessionDate.getFullYear() === day.getFullYear()
          )
        }
      })
      .sort((a, b) => {
        // Trier par heure de début
        const timeA = new Date(a.startTime).getHours() * 60 + new Date(a.startTime).getMinutes()
        const timeB = new Date(b.startTime).getHours() * 60 + new Date(b.startTime).getMinutes()
        return timeA - timeB
      })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (sessions.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Aucun cours</AlertTitle>
        <AlertDescription>
          Vous n'avez aucun cours planifié pour le moment. Contactez votre professeur principal pour plus
          d'informations.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Emploi du temps</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            Semaine précédente
          </Button>
          <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
            Aujourd'hui
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            Semaine suivante
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {weekDays.map((day, index) => (
          <Card
            key={index}
            className={cn("overflow-hidden", day.toDateString() === new Date().toDateString() ? "border-primary" : "")}
          >
            <CardHeader className="bg-muted p-2">
              <CardTitle className="text-center text-sm">{format(day, "EEEE d MMMM", { locale: fr })}</CardTitle>
            </CardHeader>
            <CardContent className="p-2 min-h-[300px]">
              {getSessionsForDay(day, sessions).length > 0 ? (
                getSessionsForDay(day, sessions).map((session) => (
                  <div
                    key={session.id}
                    className="mb-2 p-2 rounded-md"
                    style={{
                      backgroundColor: session.course.color || "#f3f4f6",
                      borderLeft: `4px solid ${session.course.color || "#9ca3af"}`,
                    }}
                  >
                    <div className="font-medium">
                      {session.title || session.course.name}
                      {!session.recurrent && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Session unique
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(session.startTime)} - {formatTime(session.endTime)}
                    </div>
                    {session.room && (
                      <div className="text-xs flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {session.room}
                      </div>
                    )}
                    <div className="text-xs flex items-center mt-1">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {session.course.name}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">Aucun cours</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
