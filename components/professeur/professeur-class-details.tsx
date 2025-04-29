"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Calendar, ClipboardList, ArrowLeft, User, Clock, CalendarDays } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Student {
  id: string
  user: {
    id: string
    name: string | null
    email: string
  }
}

interface Session {
  id: string
  title: string | null
  startTime: Date
  endTime: Date
  room: string | null
}

interface Evaluation {
  id: string
  title: string
  date: Date
  maxScore: number
  coefficient: number
}

interface Course {
  id: string
  name: string
  color: string | null
  professor: {
    id: string
    name: string | null
    email: string
  }
  sessions: Session[]
  evaluations: Evaluation[]
}

interface ClassDetails {
  id: string
  name: string
  level: string
  section: string | null
  schoolYear: string
  description: string | null
  students: Student[]
  courses: Course[]
}

interface ProfesseurClassDetailsProps {
  classDetails: ClassDetails
  establishmentId: string
  professorId: string
}

export function ProfesseurClassDetails({ classDetails, establishmentId, professorId }: ProfesseurClassDetailsProps) {
  const [activeTab, setActiveTab] = useState("students")

  // Filtrer les sessions à venir
  const now = new Date()
  const upcomingSessions = classDetails.courses
    .flatMap((course) =>
      course.sessions.map((session) => ({
        ...session,
        courseName: course.name,
        courseColor: course.color,
        courseId: course.id,
      })),
    )
    .filter((session) => new Date(session.startTime) > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5)

  // Filtrer les évaluations à venir
  const upcomingEvaluations = classDetails.courses
    .flatMap((course) =>
      course.evaluations.map((evaluation) => ({
        ...evaluation,
        courseName: course.name,
        courseColor: course.color,
        courseId: course.id,
      })),
    )
    .filter((evaluation) => new Date(evaluation.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button variant="outline" size="sm" asChild className="mb-2">
            <Link href={`/professeur/classes?establishmentId=${establishmentId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux classes
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{classDetails.name}</h1>
          <p className="text-gray-500">
            {classDetails.level}
            {classDetails.section && ` - ${classDetails.section}`} • {classDetails.schoolYear}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {classDetails.students.length} élève{classDetails.students.length !== 1 ? "s" : ""}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {classDetails.courses.length} cours
          </Badge>
        </div>
      </div>

      {classDetails.description && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">{classDetails.description}</p>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="students">
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Élèves</span>
            <span className="sm:hidden">Élèves</span>
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Sessions</span>
            <span className="sm:hidden">Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="evaluations">
            <ClipboardList className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Évaluations</span>
            <span className="sm:hidden">Éval.</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Liste des élèves</CardTitle>
              <CardDescription>
                {classDetails.students.length} élève{classDetails.students.length !== 1 ? "s" : ""} dans cette classe
              </CardDescription>
            </CardHeader>
            <CardContent>
              {classDetails.students.length === 0 ? (
                <div className="text-center py-4">
                  <User className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun élève</h3>
                  <p className="mt-1 text-sm text-gray-500">Cette classe n'a pas encore d'élèves.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {classDetails.students.map((student) => (
                    <div key={student.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                          {student.user.name ? student.user.name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div>
                          <p className="font-medium">{student.user.name || "Sans nom"}</p>
                          <p className="text-sm text-gray-500">{student.user.email}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/professeur/students/${student.user.id}?establishmentId=${establishmentId}`}>
                          Détails
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Prochaines sessions</CardTitle>
              <CardDescription>Les {upcomingSessions.length} prochaines sessions de cours</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingSessions.length === 0 ? (
                <div className="text-center py-4">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune session à venir</h3>
                  <p className="mt-1 text-sm text-gray-500">Il n'y a pas de sessions planifiées prochainement.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="py-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <Badge
                            style={{ backgroundColor: session.courseColor || "#3b82f6", color: "white" }}
                            className="mr-2"
                          >
                            {session.courseName}
                          </Badge>
                          <h4 className="font-medium">{session.title || "Sans titre"}</h4>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/professeur/sessions/${session.id}?establishmentId=${establishmentId}`}>
                            Détails
                          </Link>
                        </Button>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 gap-4">
                        <div className="flex items-center">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          {formatDate(new Date(session.startTime))}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(session.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -
                          {new Date(session.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                        {session.room && <div>Salle: {session.room}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button asChild>
              <Link href={`/professeur/courses?establishmentId=${establishmentId}`}>Gérer toutes les sessions</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="evaluations" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Prochaines évaluations</CardTitle>
              <CardDescription>Les {upcomingEvaluations.length} prochaines évaluations prévues</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvaluations.length === 0 ? (
                <div className="text-center py-4">
                  <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune évaluation à venir</h3>
                  <p className="mt-1 text-sm text-gray-500">Il n'y a pas d'évaluations planifiées prochainement.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {upcomingEvaluations.map((evaluation) => (
                    <div key={evaluation.id} className="py-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <Badge
                            style={{ backgroundColor: evaluation.courseColor || "#3b82f6", color: "white" }}
                            className="mr-2"
                          >
                            {evaluation.courseName}
                          </Badge>
                          <h4 className="font-medium">{evaluation.title}</h4>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/professeur/evaluations/${evaluation.id}?establishmentId=${establishmentId}`}>
                            Détails
                          </Link>
                        </Button>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 gap-4">
                        <div className="flex items-center">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          {formatDate(new Date(evaluation.date))}
                        </div>
                        <div>
                          Note max: {evaluation.maxScore} | Coefficient: {evaluation.coefficient}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button asChild>
              <Link href={`/professeur/evaluations?establishmentId=${establishmentId}`}>
                Gérer toutes les évaluations
              </Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
