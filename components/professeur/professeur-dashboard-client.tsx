"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Users, BookOpen, ClipboardList, GraduationCap } from "lucide-react"
import { formatDate } from "@/lib/utils"

export function ProfesseurDashboardClient({ user, courses, attendanceStats, classes, establishment }) {
  const [selectedCourseId, setSelectedCourseId] = useState("all")

  // Calculer les statistiques d'assiduité
  const totalAttendance = attendanceStats.reduce((acc, stat) => acc + stat._count.status, 0)
  const attendanceData = {
    present: attendanceStats.find((stat) => stat.status === "PRESENT")?._count.status || 0,
    absent: attendanceStats.find((stat) => stat.status === "ABSENT")?._count.status || 0,
    late: attendanceStats.find((stat) => stat.status === "LATE")?._count.status || 0,
    excused: attendanceStats.find((stat) => stat.status === "EXCUSED")?._count.status || 0,
  }

  // Filtrer les sessions en fonction du cours sélectionné
  const filteredSessions = courses
    .flatMap((course) =>
      selectedCourseId === "all" || selectedCourseId === course.id
        ? course.sessions.map((session) => ({ ...session, courseName: course.name, className: course.class.name }))
        : [],
    )
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  // Filtrer les évaluations en fonction du cours sélectionné
  const filteredEvaluations = courses
    .flatMap((course) =>
      selectedCourseId === "all" || selectedCourseId === course.id
        ? course.evaluations.map((evaluation) => ({
            ...evaluation,
            courseName: course.name,
            className: course.class.name,
          }))
        : [],
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">{courses.length > 1 ? "Cours enseignés" : "Cours enseigné"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">
              {classes.length > 1 ? "Classes enseignées" : "Classe enseignée"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Élèves</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.reduce((acc, cls) => acc + cls._count.students, 0)}</div>
            <p className="text-xs text-muted-foreground">Élèves au total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de présence</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAttendance > 0 ? `${Math.round((attendanceData.present / totalAttendance) * 100)}%` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Sur les 30 derniers jours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Prochaines sessions</CardTitle>
            <CardDescription>
              <div className="flex items-center justify-between">
                <span>Sessions à venir pour vos cours</span>
                <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tous les cours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les cours</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session) => (
                  <div key={session.id} className="flex items-center">
                    <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{session.title || session.courseName}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.className} • {formatDate(session.startTime)} •
                        {new Date(session.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -
                        {new Date(session.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <Badge variant={session.recurrent ? "outline" : "secondary"}>
                      {session.recurrent ? "Récurrent" : "Unique"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">Aucune session à venir</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/professeur/timetable?establishmentId=${establishment.id}`}>
                Voir l'emploi du temps complet
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Statistiques d'assiduité</CardTitle>
            <CardDescription>Répartition des présences sur les 30 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            {totalAttendance > 0 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Présents</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{attendanceData.present}</span>
                      <span className="text-sm text-muted-foreground">
                        ({Math.round((attendanceData.present / totalAttendance) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${(attendanceData.present / totalAttendance) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm">Absents</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{attendanceData.absent}</span>
                      <span className="text-sm text-muted-foreground">
                        ({Math.round((attendanceData.absent / totalAttendance) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-red-500"
                      style={{ width: `${(attendanceData.absent / totalAttendance) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-sm">En retard</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{attendanceData.late}</span>
                      <span className="text-sm text-muted-foreground">
                        ({Math.round((attendanceData.late / totalAttendance) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-yellow-500"
                      style={{ width: `${(attendanceData.late / totalAttendance) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm">Excusés</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{attendanceData.excused}</span>
                      <span className="text-sm text-muted-foreground">
                        ({Math.round((attendanceData.excused / totalAttendance) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${(attendanceData.excused / totalAttendance) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">Aucune donnée d'assiduité disponible</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/professeur/attendance?establishmentId=${establishment.id}`}>Gérer les présences</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Prochaines évaluations</CardTitle>
            <CardDescription>Évaluations à venir pour vos cours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEvaluations.length > 0 ? (
                filteredEvaluations.map((evaluation) => (
                  <div key={evaluation.id} className="flex items-center">
                    <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                      <ClipboardList className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{evaluation.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {evaluation.courseName} • {evaluation.className} • {formatDate(evaluation.date)}
                      </p>
                    </div>
                    <Badge variant={evaluation.isPublished ? "default" : "outline"}>
                      {evaluation.isPublished ? "Publié" : "Non publié"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">Aucune évaluation à venir</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/professeur/evaluations?establishmentId=${establishment.id}`}>Gérer les évaluations</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques des classes</CardTitle>
            <CardDescription>Répartition des élèves par classe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <div key={cls.id} className="flex items-center">
                    <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                      <Users className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{cls.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {cls._count.students} élèves • {cls.level} {cls.section}
                      </p>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/professeur/classes/${cls.id}?establishmentId=${establishment.id}`}>Détails</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">Aucune classe assignée</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/professeur/classes?establishmentId=${establishment.id}`}>Voir toutes les classes</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
