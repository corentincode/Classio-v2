"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, BookOpen, CheckCircle, AlertCircle, GraduationCap, ClipboardList } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export function EleveDashboardClient({
  student,
  courses,
  recentGrades,
  attendanceRate,
  totalAttendance,
  upcomingEvaluations,
}) {
  // Calculer la moyenne générale
  const averageGrade =
    recentGrades.length > 0 ? recentGrades.reduce((acc, grade) => acc + grade.value, 0) / recentGrades.length : 0

  return (
    <>
      <div className="mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
                <h3 className="text-2xl font-bold">{student.name}</h3>
                <p className="text-muted-foreground">Classe: {student.class?.name}</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Moyenne générale</p>
                  <p className="text-2xl font-bold">{averageGrade.toFixed(1)}/20</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Assiduité</p>
                  <p className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Mes cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <div key={course.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{course.name}</p>
                      <p className="text-sm text-muted-foreground">Prof: {course.professor.name}</p>
                    </div>
                    <Badge variant="outline">{course.sessions.length} sessions</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Aucun cours pour le moment</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Prochaines sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {courses.some((course) => course.sessions.length > 0) ? (
                courses
                  .flatMap((course) =>
                    course.sessions.map((session) => ({
                      ...session,
                      courseName: course.name,
                      professorName: course.professor.name,
                    })),
                  )
                  .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                  .slice(0, 5)
                  .map((session) => (
                    <div key={session.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{session.courseName}</p>
                        <p className="text-sm text-muted-foreground">
                          <Clock className="inline mr-1 h-3 w-3" />
                          {formatDate(session.startTime)}
                        </p>
                      </div>
                      <Badge>
                        {Math.round(
                          (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000,
                        )}{" "}
                        min
                      </Badge>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-muted-foreground">Aucune session à venir</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <ClipboardList className="mr-2 h-5 w-5" />
              Prochaines évaluations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingEvaluations.length > 0 ? (
                upcomingEvaluations.map((evaluation) => (
                  <div key={evaluation.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{evaluation.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {evaluation.course.name} - {formatDate(evaluation.date)}
                      </p>
                    </div>
                    <Badge variant="outline">{evaluation.coefficient}x</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Aucune évaluation prévue</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <GraduationCap className="mr-2 h-5 w-5" />
              Notes récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentGrades.length > 0 ? (
                recentGrades.map((grade) => (
                  <div key={grade.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{grade.evaluation.title}</p>
                      <p className="text-sm text-muted-foreground">{grade.evaluation.course.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={grade.value >= 10 ? "default" : "destructive"}>{grade.value}/20</Badge>
                      <Badge variant="outline">Coef. {grade.evaluation.coefficient}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Aucune note récente</p>
              )}
              <div className="mt-4 pt-4 border-t">
                <Link href="/eleve/grades" className="text-blue-600 hover:underline">
                  Voir toutes mes notes →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Assiduité
            </CardTitle>
            <CardDescription>30 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Taux de présence</p>
                </div>
                <div className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${attendanceRate}%` }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                  Présent
                </div>
                <div className="flex items-center">
                  <AlertCircle className="mr-1 h-3 w-3 text-red-500" />
                  Absent
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Total: {totalAttendance} présences enregistrées
              </div>
              <div className="mt-2 pt-2 border-t">
                <Link href="/eleve/attendance" className="text-blue-600 hover:underline">
                  Voir toutes mes présences →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
