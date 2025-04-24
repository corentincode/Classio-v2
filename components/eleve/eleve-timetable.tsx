"use client"

import { useState, useEffect } from "react"
import { Timetable } from "@/components/shared/timetable"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
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

export function EleveTimetable({ userId, classId, establishmentId }: EleveTimetableProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  return <Timetable sessions={sessions} userRole="STUDENT" />
}
