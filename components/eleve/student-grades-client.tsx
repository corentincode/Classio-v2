"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface Period {
  id: string
  name: string
  period: string
  startDate: string
  endDate: string
  schoolYear: string
  isActive: boolean
}

interface Course {
  id: string
  name: string
  coefficient: number
}

interface Evaluation {
  id: string
  title: string
  type: string
  date: string
  maxGrade: number
  coefficient: number
  course: {
    id: string
    name: string
    coefficient: number
  }
}

interface Grade {
  id: string
  value: number
  comment: string | null
  isAbsent: boolean
  isExcused: boolean
  evaluation: Evaluation
}

export function StudentGradesClient({
  studentId,
  periods,
  courses,
}: {
  studentId: string
  periods: Period[]
  courses: Course[]
}) {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(periods.length > 0 ? periods[0].id : null)
  const [selectedCourse, setSelectedCourse] = useState<string>("all_courses")
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch grades
  const fetchGrades = async () => {
    try {
      setLoading(true)
      let url = `/api/students/${studentId}/grades`
      const params = new URLSearchParams()

      if (selectedPeriod) {
        params.append("periodId", selectedPeriod)
      }

      if (selectedCourse && selectedCourse !== "all_courses") {
        params.append("courseId", selectedCourse)
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setGrades(data)
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les notes",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching grades:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération des notes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (studentId) {
      fetchGrades()
    }
  }, [studentId, selectedPeriod, selectedCourse])

  // Group grades by course
  const gradesByCourse = grades.reduce(
    (acc, grade) => {
      const courseId = grade.evaluation.course.id
      if (!acc[courseId]) {
        acc[courseId] = {
          courseName: grade.evaluation.course.name,
          courseCoefficient: grade.evaluation.course.coefficient,
          grades: [],
        }
      }
      acc[courseId].grades.push(grade)
      return acc
    },
    {} as Record<string, { courseName: string; courseCoefficient: number; grades: Grade[] }>,
  )

  // Calculate average for each course
  const courseAverages = Object.entries(gradesByCourse).map(([courseId, { courseName, courseCoefficient, grades }]) => {
    const totalWeightedGrade = grades.reduce((sum, grade) => {
      if (grade.isAbsent && !grade.isExcused) {
        return sum + 0 * grade.evaluation.coefficient
      }
      return sum + (grade.value / grade.evaluation.maxGrade) * 20 * grade.evaluation.coefficient
    }, 0)

    const totalCoefficient = grades.reduce((sum, grade) => sum + grade.evaluation.coefficient, 0)

    const average = totalCoefficient > 0 ? totalWeightedGrade / totalCoefficient : 0

    return {
      courseId,
      courseName,
      courseCoefficient,
      average,
      totalCoefficient,
    }
  })

  // Calculate overall average
  const overallAverage = (() => {
    const totalWeightedAverage = courseAverages.reduce(
      (sum, course) => sum + course.average * course.courseCoefficient,
      0,
    )
    const totalCoefficient = courseAverages.reduce((sum, course) => sum + course.courseCoefficient, 0)
    return totalCoefficient > 0 ? totalWeightedAverage / totalCoefficient : 0
  })()

  // Format grade value
  const formatGrade = (value: number, maxGrade = 20) => {
    return `${value.toFixed(2)}/${maxGrade}`
  }

  // Get color based on grade
  const getGradeColor = (value: number, maxGrade = 20) => {
    const percentage = (value / maxGrade) * 100
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-blue-600"
    if (percentage >= 40) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="w-full md:w-1/3">
          <Select value={selectedPeriod || ""} onValueChange={setSelectedPeriod}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une période" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period.id} value={period.id}>
                  {period.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-1/3">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un cours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_courses">Tous les cours</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : grades.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500">Aucune note disponible pour cette période</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Moyenne générale</span>
                <span className={cn("text-2xl", getGradeColor(overallAverage))}>{overallAverage.toFixed(2)}/20</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {courseAverages.map((course) => (
                  <div key={course.courseId} className="flex justify-between items-center py-2 border-b">
                    <div className="flex items-center">
                      <span>{course.courseName}</span>
                      <span className="text-gray-500 text-sm ml-2">(Coef. {course.courseCoefficient})</span>
                    </div>
                    <span className={cn("font-medium", getGradeColor(course.average))}>
                      {course.average.toFixed(2)}/20
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(gradesByCourse).map(([courseId, { courseName, grades }]) => (
              <Card key={courseId}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{courseName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {grades.map((grade) => (
                      <div key={grade.id} className="border-b pb-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{grade.evaluation.title}</div>
                            <div className="text-sm text-gray-500">
                              {format(new Date(grade.evaluation.date), "dd MMMM yyyy", { locale: fr })}
                            </div>
                            <div className="text-xs text-gray-500">
                              {grade.evaluation.type === "CONTROLE"
                                ? "Contrôle"
                                : grade.evaluation.type === "DEVOIR"
                                  ? "Devoir"
                                  : grade.evaluation.type === "EXAMEN"
                                    ? "Examen"
                                    : grade.evaluation.type === "TP"
                                      ? "TP"
                                      : grade.evaluation.type === "ORAL"
                                        ? "Oral"
                                        : grade.evaluation.type === "PROJET"
                                          ? "Projet"
                                          : "Autre"}{" "}
                              (Coef. {grade.evaluation.coefficient})
                            </div>
                          </div>
                          <div className="text-right">
                            {grade.isAbsent ? (
                              <div className={grade.isExcused ? "text-amber-600" : "text-red-600"}>
                                {grade.isExcused ? "Absence justifiée" : "Absent"}
                              </div>
                            ) : (
                              <div className={getGradeColor(grade.value, grade.evaluation.maxGrade)}>
                                {formatGrade(grade.value, grade.evaluation.maxGrade)}
                              </div>
                            )}
                          </div>
                        </div>
                        {grade.comment && <div className="text-sm mt-1 italic">{grade.comment}</div>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
