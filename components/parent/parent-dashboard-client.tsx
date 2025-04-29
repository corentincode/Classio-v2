"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, BookOpenIcon, GraduationCapIcon, UserIcon, BarChart3Icon } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

export function ParentDashboardClient({ parent, children, recentGrades, attendanceStats, upcomingEvaluations }) {
  const [selectedChildId, setSelectedChildId] = useState(children.length > 0 ? children[0].id : null)

  // Filtrer les données en fonction de l'enfant sélectionné
  const filteredGrades = selectedChildId
    ? recentGrades.filter((grade) => grade.student.id === selectedChildId)
    : recentGrades

  const filteredAttendance = selectedChildId
    ? attendanceStats.filter((record) => record.student.id === selectedChildId)
    : attendanceStats

  const selectedChild = children.find((child) => child.id === selectedChildId)

  // Calculer les statistiques d'assiduité
  const totalAttendance = filteredAttendance.length
  const presentCount = filteredAttendance.filter((record) => record.status === "PRESENT").length
  const absentCount = filteredAttendance.filter((record) => record.status === "ABSENT").length
  const lateCount = filteredAttendance.filter((record) => record.status === "LATE").length
  const excusedCount = filteredAttendance.filter((record) => record.status === "EXCUSED").length

  const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 100

  // Calculer la moyenne des notes
  const averageGrade =
    filteredGrades.length > 0 ? filteredGrades.reduce((sum, grade) => sum + grade.value, 0) / filteredGrades.length : 0

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enfants</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{children.length}</div>
            <p className="text-xs text-muted-foreground">Enfants enregistrés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne générale</CardTitle>
            <GraduationCapIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageGrade.toFixed(2)}/20</div>
            <p className="text-xs text-muted-foreground">{filteredGrades.length} notes récentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de présence</CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</div>
            <Progress value={attendanceRate} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prochaines évaluations</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvaluations.length}</div>
            <p className="text-xs text-muted-foreground">Dans les prochains jours</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4">
        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Sélectionner un enfant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les enfants</SelectItem>
            {children.map((child) => (
              <SelectItem key={child.id} value={child.id}>
                {child.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="grades">Notes</TabsTrigger>
          <TabsTrigger value="attendance">Assiduité</TabsTrigger>
          <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Enfants</CardTitle>
                <CardDescription>Liste de vos enfants et leurs classes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {children.map((child) => (
                  <div key={child.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <p className="font-medium">{child.name}</p>
                      <p className="text-sm text-muted-foreground">{child.email}</p>
                    </div>
                    <div>
                      {child.studentClasses?.map((sc) => (
                        <Badge key={sc.class.id} variant="outline" className="ml-2">
                          {sc.class.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Prochaines évaluations</CardTitle>
                <CardDescription>Évaluations à venir</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {upcomingEvaluations.length > 0 ? (
                  upcomingEvaluations.slice(0, 5).map((evaluation) => (
                    <div key={evaluation.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div>
                        <p className="font-medium">{evaluation.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {evaluation.course.name} - {evaluation.course.class.name}
                        </p>
                      </div>
                      <div className="text-sm">{format(new Date(evaluation.date), "dd MMMM", { locale: fr })}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune évaluation à venir</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Notes récentes</CardTitle>
                <CardDescription>Dernières notes obtenues</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {filteredGrades.length > 0 ? (
                  filteredGrades.slice(0, 5).map((grade) => (
                    <div key={grade.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div>
                        <p className="font-medium">{grade.evaluation.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {grade.evaluation.course.name} - {grade.student.name}
                        </p>
                      </div>
                      <div>
                        <Badge
                          className={grade.value >= 10 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {grade.value}/{grade.evaluation.maxGrade}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune note récente</p>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Assiduité</CardTitle>
                <CardDescription>Statistiques de présence des 30 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Présent</div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{presentCount}</span>
                      <span className="ml-1 text-xs text-muted-foreground">/{totalAttendance}</span>
                    </div>
                  </div>
                  <Progress value={(presentCount / Math.max(totalAttendance, 1)) * 100} className="h-2 bg-gray-100" />
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Absent</div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{absentCount}</span>
                      <span className="ml-1 text-xs text-muted-foreground">/{totalAttendance}</span>
                    </div>
                  </div>
                  <Progress value={(absentCount / Math.max(totalAttendance, 1)) * 100} className="h-2 bg-gray-100" />
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Retard</div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{lateCount}</span>
                      <span className="ml-1 text-xs text-muted-foreground">/{totalAttendance}</span>
                    </div>
                  </div>
                  <Progress value={(lateCount / Math.max(totalAttendance, 1)) * 100} className="h-2 bg-gray-100" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="grades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notes détaillées</CardTitle>
              <CardDescription>Toutes les notes récentes</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredGrades.length > 0 ? (
                <div className="space-y-2">
                  {filteredGrades.map((grade) => (
                    <div key={grade.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div>
                        <p className="font-medium">{grade.evaluation.title}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <BookOpenIcon className="mr-1 h-4 w-4" />
                          {grade.evaluation.course.name}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {grade.student.name} - {format(new Date(grade.updatedAt), "dd/MM/yyyy")}
                        </p>
                      </div>
                      <div>
                        <Badge
                          className={
                            grade.value >= grade.evaluation.maxGrade * 0.8
                              ? "bg-green-100 text-green-800"
                              : grade.value >= grade.evaluation.maxGrade * 0.5
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {grade.value}/{grade.evaluation.maxGrade}
                        </Badge>
                        {grade.comment && <p className="text-xs italic mt-1">{grade.comment}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucune note disponible</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registre d'assiduité</CardTitle>
              <CardDescription>Historique des présences et absences</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAttendance.length > 0 ? (
                <div className="space-y-2">
                  {filteredAttendance.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div>
                        <p className="font-medium">{record.student.name}</p>
                        <p className="text-sm text-muted-foreground">{record.course.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(record.date), "EEEE dd MMMM yyyy", { locale: fr })}
                        </p>
                      </div>
                      <div>
                        <Badge
                          className={
                            record.status === "PRESENT"
                              ? "bg-green-100 text-green-800"
                              : record.status === "ABSENT"
                                ? "bg-red-100 text-red-800"
                                : record.status === "LATE"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                          }
                        >
                          {record.status === "PRESENT"
                            ? "Présent"
                            : record.status === "ABSENT"
                              ? "Absent"
                              : record.status === "LATE"
                                ? `En retard (${record.minutesLate} min)`
                                : "Excusé"}
                        </Badge>
                        {record.reason && <p className="text-xs italic mt-1">{record.reason}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucun enregistrement d'assiduité disponible</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des évaluations</CardTitle>
              <CardDescription>Toutes les évaluations à venir</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvaluations.length > 0 ? (
                <div className="space-y-2">
                  {upcomingEvaluations.map((evaluation) => (
                    <div key={evaluation.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div>
                        <p className="font-medium">{evaluation.title}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <BookOpenIcon className="mr-1 h-4 w-4" />
                          {evaluation.course.name} - {evaluation.course.class.name}
                        </div>
                        <p className="text-xs text-muted-foreground">Type: {evaluation.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {format(new Date(evaluation.date), "EEEE dd MMMM", { locale: fr })}
                        </p>
                        <p className="text-xs text-muted-foreground">Coefficient: {evaluation.coefficient}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucune évaluation à venir</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Liens rapides</CardTitle>
            <CardDescription>Accès rapide aux fonctionnalités</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 md:grid-cols-3">
            <Link href="/parent/children" className="flex items-center p-3 border rounded-md hover:bg-gray-50">
              <UserIcon className="mr-2 h-5 w-5" />
              <span>Gérer les enfants</span>
            </Link>
            <Link href="/parent/grades" className="flex items-center p-3 border rounded-md hover:bg-gray-50">
              <GraduationCapIcon className="mr-2 h-5 w-5" />
              <span>Voir toutes les notes</span>
            </Link>
            <Link href="/parent/attendance" className="flex items-center p-3 border rounded-md hover:bg-gray-50">
              <CalendarIcon className="mr-2 h-5 w-5" />
              <span>Suivi d'assiduité</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
