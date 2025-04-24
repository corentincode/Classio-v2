"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, addDays, startOfWeek, isSameDay, isWithinInterval, set } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"

type Session = {
  id: string
  title: string | null
  description: string | null
  startTime: string | Date
  endTime: string | Date
  recurrent: boolean
  dayOfWeek?: number
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

type TimetableProps = {
  sessions: Session[]
  userRole: "PROFESSOR" | "STUDENT"
  className?: string
}

export function Timetable({ sessions, userRole, className }: TimetableProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentWeek, setCurrentWeek] = useState<Date[]>([])
  const [currentView, setCurrentView] = useState<"week" | "day">("week")
  const timelineRef = useRef<HTMLDivElement>(null)

  // Heures de début et de fin de la journée (8h - 18h)
  const startHour = 8
  const endHour = 18
  const hourHeight = 100 // hauteur en pixels pour une heure

  // Générer les heures de la journée
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i)

  // Générer les jours de la semaine
  useEffect(() => {
    const monday = startOfWeek(currentDate, { weekStartsOn: 1 })
    const weekDays = Array.from({ length: 5 }, (_, i) => addDays(monday, i))
    setCurrentWeek(weekDays)
  }, [currentDate])

  // Mettre à jour la date et l'heure actuelles toutes les minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Faire défiler jusqu'à l'heure actuelle lors du chargement
  useEffect(() => {
    if (timelineRef.current) {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()

      if (currentHour >= startHour && currentHour <= endHour) {
        const scrollPosition = (currentHour - startHour) * hourHeight + (currentMinute / 60) * hourHeight - 100
        timelineRef.current.scrollTop = scrollPosition
      }
    }
  }, [])

  // Formater les sessions pour l'affichage
  const formatSessions = (day: Date) => {
    return sessions
      .filter((session) => {
        const sessionStart = new Date(session.startTime)
        const sessionEnd = new Date(session.endTime)

        // Pour les sessions récurrentes, vérifier si le jour de la semaine correspond
        if (session.recurrent && session.dayOfWeek !== undefined) {
          const dayOfWeek = day.getDay() || 7 // Transformer 0 (dimanche) en 7
          return dayOfWeek === session.dayOfWeek
        }

        // Pour les sessions non récurrentes, vérifier si la date correspond
        return isSameDay(sessionStart, day)
      })
      .map((session) => {
        const startTime = new Date(session.startTime)
        const endTime = new Date(session.endTime)

        // Pour les sessions récurrentes, ajuster la date au jour actuel
        let start = startTime
        let end = endTime

        if (session.recurrent) {
          const startHours = startTime.getHours()
          const startMinutes = startTime.getMinutes()
          const endHours = endTime.getHours()
          const endMinutes = endTime.getMinutes()

          start = set(day, { hours: startHours, minutes: startMinutes })
          end = set(day, { hours: endHours, minutes: endMinutes })
        }

        return {
          ...session,
          start,
          end,
          top: (start.getHours() - startHour + start.getMinutes() / 60) * hourHeight,
          height: (end.getHours() - start.getHours() + (end.getMinutes() - start.getMinutes()) / 60) * hourHeight,
          isActive: isWithinInterval(currentDate, { start, end }),
        }
      })
      .sort((a, b) => a.start.getTime() - b.start.getTime())
  }

  // Calculer la position de la ligne d'heure actuelle
  const getCurrentTimePosition = () => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()

    if (hours < startHour || hours > endHour) return -1

    return (hours - startHour + minutes / 60) * hourHeight
  }

  // Formater l'heure
  const formatTime = (date: Date) => {
    return format(date, "HH:mm", { locale: fr })
  }

  // Vérifier si le jour est aujourd'hui
  const isToday = (date: Date) => {
    return isSameDay(date, new Date())
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Tabs defaultValue="week" onValueChange={(value) => setCurrentView(value as "week" | "day")}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="week">Semaine</TabsTrigger>
            <TabsTrigger value="day">Aujourd'hui</TabsTrigger>
          </TabsList>

          <div className="text-sm font-medium">
            {format(currentWeek[0] || new Date(), "dd MMMM", { locale: fr })} -
            {format(currentWeek[4] || new Date(), "dd MMMM yyyy", { locale: fr })}
          </div>
        </div>

        <TabsContent value="week" className="mt-4">
          <div className="relative overflow-x-auto">
            <div className="grid grid-cols-6 gap-2">
              {/* Colonne des heures */}
              <div className="sticky left-0 z-10 bg-background">
                <div className="h-12"></div> {/* Espace pour l'en-tête */}
                <div ref={timelineRef} className="overflow-y-auto max-h-[600px]">
                  {hours.map((hour) => (
                    <div key={hour} className="h-[100px] border-t flex items-start px-2 text-sm text-muted-foreground">
                      {hour}:00
                    </div>
                  ))}
                </div>
              </div>

              {/* Colonnes des jours */}
              {currentWeek.map((day, index) => (
                <div key={index} className="min-w-[150px]">
                  <div
                    className={cn(
                      "h-12 flex flex-col items-center justify-center font-medium",
                      isToday(day) && "bg-primary/10 rounded-t-md",
                    )}
                  >
                    <div>{format(day, "EEEE", { locale: fr })}</div>
                    <div className="text-sm text-muted-foreground">{format(day, "dd/MM", { locale: fr })}</div>
                  </div>

                  <div
                    className={cn(
                      "relative h-[600px] overflow-y-auto border rounded-b-md",
                      isToday(day) && "bg-primary/5 border-primary/20",
                    )}
                  >
                    {/* Grille des heures */}
                    {hours.map((hour) => (
                      <div key={hour} className="h-[100px] border-t"></div>
                    ))}

                    {/* Sessions du jour */}
                    {formatSessions(day).map((session, idx) => (
                      <div
                        key={`${session.id}-${idx}`}
                        className={cn(
                          "absolute left-1 right-1 rounded-md p-2 overflow-hidden text-xs shadow-sm border transition-all",
                          session.isActive ? "ring-2 ring-primary" : "",
                        )}
                        style={{
                          top: `${session.top}px`,
                          height: `${session.height}px`,
                          backgroundColor: session.course.color ? `${session.course.color}20` : "hsl(var(--muted))",
                          borderColor: session.course.color || "hsl(var(--border))",
                        }}
                      >
                        <div className="font-medium truncate">{session.title || session.course.name}</div>
                        <div className="text-muted-foreground mt-1">
                          {formatTime(session.start)} - {formatTime(session.end)}
                        </div>
                        {session.room && <div className="mt-1 truncate">Salle: {session.room}</div>}
                        {userRole === "STUDENT" && (
                          <div className="mt-1 truncate">Prof: {session.course.professor.email.split("@")[0]}</div>
                        )}
                      </div>
                    ))}

                    {/* Ligne d'heure actuelle */}
                    {isToday(day) && getCurrentTimePosition() >= 0 && (
                      <div
                        className="absolute left-0 right-0 border-t-2 border-primary z-10 pointer-events-none"
                        style={{ top: `${getCurrentTimePosition()}px` }}
                      >
                        <div className="absolute -left-1 -top-2 h-4 w-4 rounded-full bg-primary"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="day">
          <Card>
            <CardHeader>
              <CardTitle>Aujourd'hui</CardTitle>
              <CardDescription>{format(new Date(), "EEEE dd MMMM yyyy", { locale: fr })}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Heures de la journée */}
                <div className="grid grid-cols-[60px_1fr] gap-2">
                  <div>
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className="h-[100px] border-t flex items-start px-2 text-sm text-muted-foreground"
                      >
                        {hour}:00
                      </div>
                    ))}
                  </div>

                  <div className="relative border rounded-md">
                    {/* Grille des heures */}
                    {hours.map((hour) => (
                      <div key={hour} className="h-[100px] border-t"></div>
                    ))}

                    {/* Sessions du jour */}
                    {formatSessions(new Date()).map((session, idx) => (
                      <div
                        key={`${session.id}-${idx}`}
                        className={cn(
                          "absolute left-1 right-1 rounded-md p-2 overflow-hidden text-sm shadow-sm border transition-all",
                          session.isActive ? "ring-2 ring-primary" : "",
                        )}
                        style={{
                          top: `${session.top}px`,
                          height: `${session.height}px`,
                          backgroundColor: session.course.color ? `${session.course.color}20` : "hsl(var(--muted))",
                          borderColor: session.course.color || "hsl(var(--border))",
                        }}
                      >
                        <div className="font-medium">{session.title || session.course.name}</div>
                        <div className="text-muted-foreground mt-1">
                          {formatTime(session.start)} - {formatTime(session.end)}
                        </div>
                        {session.room && <div className="mt-1">Salle: {session.room}</div>}
                        {userRole === "STUDENT" && (
                          <div className="mt-1">Prof: {session.course.professor.email.split("@")[0]}</div>
                        )}
                        {session.description && <div className="mt-2 text-xs">{session.description}</div>}
                      </div>
                    ))}

                    {/* Ligne d'heure actuelle */}
                    {getCurrentTimePosition() >= 0 && (
                      <div
                        className="absolute left-0 right-0 border-t-2 border-primary z-10 pointer-events-none"
                        style={{ top: `${getCurrentTimePosition()}px` }}
                      >
                        <div className="absolute -left-1 -top-2 h-4 w-4 rounded-full bg-primary"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
