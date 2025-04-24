"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

type Session = {
  id: string
  title: string | null
  description: string | null
  dayOfWeek: number
  startTime: string
  endTime: string
  recurrent: boolean
  room: string | null
  course: {
    id: string
    name: string
    color: string | null
    professor: {
      id: string
      email: string
    }
    class: {
      id: string
      name: string
    }
  }
}

type DaySession = {
  id: string
  title: string | null
  description: string | null
  start: Date
  end: Date
  room: string | null
  course: {
    id: string
    name: string
    color: string | null
    professor: {
      id: string
      email: string
    }
    class: {
      id: string
      name: string
    }
  }
}

type WeekDay = {
  name: string
  date: Date
  sessions: DaySession[]
}

interface ProfesseurTimetableProps {
  userId: string
  establishmentId: string
}

export function ProfesseurTimetable({ userId, establishmentId }: ProfesseurTimetableProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentWeek, setCurrentWeek] = useState<WeekDay[]>([])

  // Récupérer toutes les sessions des cours enseignés par le professeur
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/professors/${userId}/timetable?establishmentId=${establishmentId}`)

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
  }, [userId, establishmentId])

  // Générer l'emploi du temps pour la semaine en cours
  useEffect(() => {
    if (sessions.length > 0) {
      // Obtenir le lundi de la semaine en cours
      const today = new Date()
      const currentDay = today.getDay() || 7 // Transformer 0 (dimanche) en 7
      const mondayOffset = currentDay - 1
      const monday = new Date(today)
      monday.setDate(today.getDate() - mondayOffset)
      monday.setHours(0, 0, 0, 0)

      // Générer les jours de la semaine
      const weekDays: WeekDay[] = []
      const dayNames = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

      for (let i = 0; i < 7; i++) {
        const date = new Date(monday)
        date.setDate(monday.getDate() + i)

        weekDays.push({
          name: dayNames[i],
          date,
          sessions: [],
        })
      }

      // Ajouter les sessions à chaque jour
      for (const session of sessions) {
        if (session.recurrent) {
          // Pour les sessions récurrentes, les ajouter au jour de la semaine correspondant
          const dayIndex = session.dayOfWeek === 0 ? 6 : session.dayOfWeek - 1 // Ajuster pour notre format (lundi = 0)

          if (weekDays[dayIndex]) {
            const [startHour, startMinute] = session.startTime.split(":").map(Number)
            const [endHour, endMinute] = session.endTime.split(":").map(Number)

            const start = new Date(weekDays[dayIndex].date)
            start.setHours(startHour, startMinute, 0, 0)

            const end = new Date(weekDays[dayIndex].date)
            end.setHours(endHour, endMinute, 0, 0)

            weekDays[dayIndex].sessions.push({
              id: session.id,
              title: session.title,
              description: session.description,
              start,
              end,
              room: session.room,
              course: session.course,
            })
          }
        }
        // Pour les sessions uniques, vérifier si elles sont dans la semaine en cours
        else {
          const sessionStart = new Date(session.startTime)
          const sessionEnd = new Date(session.endTime)

          const sessionDay = sessionStart.getDay() || 7
          const dayIndex = sessionDay - 1

          const weekStart = new Date(monday)
          const weekEnd = new Date(monday)
          weekEnd.setDate(weekEnd.getDate() + 7)

          if (sessionStart >= weekStart && sessionStart < weekEnd && weekDays[dayIndex]) {
            weekDays[dayIndex].sessions.push({
              id: session.id,
              title: session.title,
              description: session.description,
              start: sessionStart,
              end: sessionEnd,
              room: session.room,
              course: session.course,
            })
          }
        }
      }

      // Trier les sessions par heure de début
      for (const day of weekDays) {
        day.sessions.sort((a, b) => a.start.getTime() - b.start.getTime())
      }

      setCurrentWeek(weekDays)
    }
  }, [sessions])

  // Formater la date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Mon emploi du temps</h1>
        <Tabs defaultValue="week">
          <TabsList>
            <TabsTrigger value="week">Semaine</TabsTrigger>
            <TabsTrigger value="day">Jour</TabsTrigger>
          </TabsList>
          <TabsContent value="week" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="h-[400px]">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <Skeleton key={j} className="h-20 w-full" />
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Mon emploi du temps</h1>

      <Tabs defaultValue="week">
        <TabsList>
          <TabsTrigger value="week">Semaine</TabsTrigger>
          <TabsTrigger value="day">Aujourd'hui</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* On affiche les 5 jours de la semaine (lundi - vendredi) */}
            {currentWeek.slice(0, 5).map((day) => (
              <Card key={day.name} className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{day.name}</CardTitle>
                  <CardDescription>{formatDate(day.date)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {day.sessions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Aucun cours</p>
                  ) : (
                    day.sessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-2 rounded-md text-sm"
                        style={{
                          backgroundColor: session.course.color
                            ? `${session.course.color}15`
                            : // 15 is for 15% opacity
                              "hsl(var(--muted))",
                        }}
                      >
                        <div className="font-medium flex items-center">
                          <div
                            className="h-2 w-2 rounded-full mr-2"
                            style={{ backgroundColor: session.course.color || "#9ca3af" }}
                          />
                          <div>{session.title || session.course.name}</div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                          <div className="font-medium">{session.course.class.name}</div>
                        </div>
                        {session.room && <div className="text-xs mt-1">Salle: {session.room}</div>}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="day">
          <Card>
            <CardHeader>
              <CardTitle>Aujourd'hui</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const today = new Date().getDay() || 7
                const dayIndex = today - 1
                const todayData = currentWeek[dayIndex]

                if (!todayData || todayData.sessions.length === 0) {
                  return <p className="text-center py-8 text-muted-foreground">Aucun cours aujourd'hui</p>
                }

                return (
                  <div className="space-y-4">
                    {todayData.sessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-4 rounded-md border"
                        style={{
                          borderLeft: `4px solid ${session.course.color || "#9ca3af"}`,
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{session.title || session.course.name}</h3>
                            <p className="text-sm font-medium mt-1">Classe: {session.course.class.name}</p>
                            {session.description && (
                              <p className="text-sm text-muted-foreground mt-1">{session.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm">
                          {session.room && <div>Salle: {session.room}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
