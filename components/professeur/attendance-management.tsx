"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttendanceForm } from "./attendance-form"
import { AttendanceList } from "./attendance-list"
import { toast } from "@/components/ui/use-toast"

interface Course {
  id: string
  name: string
  class: {
    id: string
    name: string
  }
}

interface Student {
  student: {
    id: string
    email: string
  }
}

interface ProfesseurAttendanceManagementProps {
  professorId: string
  establishmentId: string
  courses: Course[]
  currentCourseId: string | null
}

export function ProfesseurAttendanceManagement({
  professorId,
  establishmentId,
  courses,
  currentCourseId,
}: ProfesseurAttendanceManagementProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState<string>("take")
  const [loading, setLoading] = useState<boolean>(false)
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])

  // Sélectionner automatiquement le cours actuel si disponible
  useEffect(() => {
    if (currentCourseId && courses.some((course) => course.id === currentCourseId)) {
      setSelectedCourse(currentCourseId)
      toast({
        title: "Cours actuel détecté",
        description: `Vous avez un cours en ce moment. Vous pouvez faire l'appel.`,
      })
    } else if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0].id)
    }
  }, [currentCourseId, courses, selectedCourse])

  // Charger les élèves du cours sélectionné
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedCourse) return

      setLoading(true)
      try {
        const course = courses.find((c) => c.id === selectedCourse)
        if (!course) return

        const response = await fetch(`/api/establishments/${establishmentId}/classes/${course.class.id}/students`)
        if (response.ok) {
          const data = await response.json()
          setStudents(data)
        } else {
          const errorData = await response.json()
          toast({
            title: "Erreur",
            description: `Impossible de charger les élèves: ${errorData.error || "Erreur inconnue"}`,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Erreur lors du chargement des élèves:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les élèves",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [selectedCourse, establishmentId, courses])

  // Charger les enregistrements d'assiduité pour le cours et la date sélectionnés
  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      if (!selectedCourse || !selectedDate) return

      setLoading(true)
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd")
        const response = await fetch(`/api/courses/${selectedCourse}/attendance?date=${formattedDate}`)
        if (response.ok) {
          const data = await response.json()
          setAttendanceRecords(data)
        } else {
          const errorData = await response.json()
          toast({
            title: "Erreur",
            description: `Impossible de charger les absences: ${errorData.error || "Erreur inconnue"}`,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Erreur lors du chargement des enregistrements d'assiduité:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les absences",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (activeTab === "take") {
      fetchAttendanceRecords()
    }
  }, [selectedCourse, selectedDate, activeTab])

  // Charger tous les enregistrements d'assiduité pour le cours sélectionné
  useEffect(() => {
    const fetchAllAttendanceRecords = async () => {
      if (!selectedCourse) return

      setLoading(true)
      try {
        const response = await fetch(`/api/courses/${selectedCourse}/attendance`)
        if (response.ok) {
          const data = await response.json()
          setAttendanceRecords(data)
        } else {
          const errorData = await response.json()
          toast({
            title: "Erreur",
            description: `Impossible de charger les absences: ${errorData.error || "Erreur inconnue"}`,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Erreur lors du chargement des enregistrements d'assiduité:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les absences",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (activeTab === "view") {
      fetchAllAttendanceRecords()
    }
  }, [selectedCourse, activeTab])

  const handleSaveAttendance = async (records: any[]) => {
    if (!selectedCourse || !selectedDate) return

    setLoading(true)
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd")
      const response = await fetch(`/api/courses/${selectedCourse}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formattedDate,
          records,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setAttendanceRecords(data)
        toast({
          title: "Succès",
          description: "Les absences ont été enregistrées avec succès",
        })
        return true
      } else {
        const errorData = await response.json()
        toast({
          title: "Erreur",
          description: `Impossible d'enregistrer les absences: ${errorData.error || "Erreur inconnue"}`,
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des absences:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les absences",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sélectionner un cours et une date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Cours</label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un cours" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name} - {course.class.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={!selectedCourse}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedCourse && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="take">Prendre les absences</TabsTrigger>
            <TabsTrigger value="view">Historique des absences</TabsTrigger>
          </TabsList>
          <TabsContent value="take">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : (
              <AttendanceForm
                students={students.map((s) => s.student)}
                attendanceRecords={attendanceRecords}
                onSave={handleSaveAttendance}
                date={selectedDate}
              />
            )}
          </TabsContent>
          <TabsContent value="view">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : (
              <AttendanceList attendanceRecords={attendanceRecords} />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
