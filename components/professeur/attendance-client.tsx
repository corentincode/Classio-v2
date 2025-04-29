"use client"

import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Check, AlertTriangle, Info } from "lucide-react"

interface Course {
  id: string
  name: string
  classId: string
  class: {
    id: string
    name: string
  }
}

interface Establishment {
  id: string
  name: string
}

interface ProfesseurAttendanceClientProps {
  professorId: string
  establishment: Establishment
  courses: Course[]
  currentCourseId: string | null
  completedCourseIds: string[]
}

export function ProfesseurAttendanceClient({
  professorId,
  establishment,
  courses,
  currentCourseId,
  completedCourseIds,
}: ProfesseurAttendanceClientProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des présences</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Établissement: {establishment.name}</CardTitle>
          <CardDescription>
            Sélectionnez un cours pour faire l'appel ou consultez les absences enregistrées
          </CardDescription>
        </CardHeader>
      </Card>

      {currentCourseId && (
        <Alert className="mb-6 border-blue-500 bg-blue-50">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertTitle className="text-blue-700">Cours en cours</AlertTitle>
          <AlertDescription className="text-blue-600">
            Vous avez actuellement un cours en session. Vous pouvez faire l'appel directement.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="pt-6">
                  <div className="text-center py-6">
                    <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                    <h3 className="text-lg font-medium">Aucun cours trouvé</h3>
                    <p className="text-sm text-gray-500 mt-2">
                      Vous n'avez pas de cours assignés dans cet établissement.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              courses.map((course) => {
                const isCompleted = completedCourseIds.includes(course.id)
                const isCurrent = currentCourseId === course.id

                return (
                  <Card
                    key={course.id}
                    className={`overflow-hidden transition-all ${
                      isCurrent ? "border-blue-500 shadow-md" : isCompleted ? "opacity-70" : ""
                    }`}
                  >
                    <CardHeader className={`${isCurrent ? "bg-blue-50" : ""}`}>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{course.name}</CardTitle>
                        {isCompleted && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Check className="h-3 w-3 mr-1" /> Appel fait
                          </Badge>
                        )}
                        {isCurrent && !isCompleted && <Badge className="bg-blue-500">En cours</Badge>}
                      </div>
                      <CardDescription>Classe: {course.class.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {isCompleted
                            ? "L'appel a déjà été fait aujourd'hui"
                            : "L'appel n'a pas encore été fait aujourd'hui"}
                        </div>
                        <Button
                          variant={isCurrent ? "default" : "outline"}
                          size="sm"
                          className={isCurrent ? "bg-blue-500 hover:bg-blue-600" : ""}
                        >
                          <a
                            href={`/professeur/attendance/course/${course.id}?date=${format(new Date(), "yyyy-MM-dd")}&establishmentId=${establishment.id}`}
                          >
                            {isCompleted ? "Voir détails" : "Faire l'appel"}
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique des présences</CardTitle>
              <CardDescription>Consultez les présences enregistrées pour vos cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Sélectionnez une date</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="border rounded-md p-3"
                    locale={fr}
                  />
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-medium mb-2">Sélectionnez un cours</h3>
                  <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un cours" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name} - {course.class.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="mt-6">
                    <Button
                      className="w-full"
                      disabled={!selectedDate || !selectedCourseId}
                      onClick={() => {
                        if (selectedDate && selectedCourseId) {
                          const formattedDate = format(selectedDate, "yyyy-MM-dd")
                          window.location.href = `/professeur/attendance/course/${selectedCourseId}?date=${formattedDate}&establishmentId=${establishment.id}`
                        }
                      }}
                    >
                      Consulter les présences
                    </Button>
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
