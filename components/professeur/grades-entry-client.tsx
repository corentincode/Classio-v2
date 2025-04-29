"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Save } from "lucide-react"

interface Student {
  id: string
  name: string | null
  email: string
}

interface Grade {
  id: string | null
  studentId: string
  value: number | null
  comment: string | null
  isAbsent: boolean
  isExcused: boolean
  student: Student
}

export function GradesEntryClient({ evaluationId, maxGrade }: { evaluationId: string; maxGrade: number }) {
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch grades
  const fetchGrades = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/evaluations/${evaluationId}/grades`)
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
    fetchGrades()
  }, [evaluationId])

  // Update grade value
  const updateGradeValue = (studentId: string, value: string) => {
    setGrades((prevGrades) =>
      prevGrades.map((grade) => {
        if (grade.studentId === studentId) {
          const numValue = value === "" ? null : Number.parseFloat(value)
          return {
            ...grade,
            value: numValue,
            // Si une note est saisie, l'élève n'est pas absent
            isAbsent: numValue === null ? grade.isAbsent : false,
          }
        }
        return grade
      }),
    )
  }

  // Update grade comment
  const updateGradeComment = (studentId: string, comment: string) => {
    setGrades((prevGrades) =>
      prevGrades.map((grade) => {
        if (grade.studentId === studentId) {
          return { ...grade, comment }
        }
        return grade
      }),
    )
  }

  // Update absence status
  const updateAbsenceStatus = (studentId: string, isAbsent: boolean) => {
    setGrades((prevGrades) =>
      prevGrades.map((grade) => {
        if (grade.studentId === studentId) {
          return {
            ...grade,
            isAbsent,
            // Si l'élève est marqué comme absent, sa note est mise à null
            value: isAbsent ? null : grade.value,
          }
        }
        return grade
      }),
    )
  }

  // Update excuse status
  const updateExcuseStatus = (studentId: string, isExcused: boolean) => {
    setGrades((prevGrades) =>
      prevGrades.map((grade) => {
        if (grade.studentId === studentId) {
          return { ...grade, isExcused }
        }
        return grade
      }),
    )
  }

  // Save grades
  const saveGrades = async () => {
    try {
      setSaving(true)

      // Vérifier que les notes sont valides
      const invalidGrades = grades.filter(
        (grade) => grade.value !== null && (grade.value < 0 || grade.value > maxGrade),
      )

      if (invalidGrades.length > 0) {
        toast({
          title: "Notes invalides",
          description: `Certaines notes sont en dehors de la plage autorisée (0-${maxGrade})`,
          variant: "destructive",
        })
        setSaving(false)
        return
      }

      const response = await fetch(`/api/evaluations/${evaluationId}/grades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grades: grades.map((grade) => ({
            studentId: grade.studentId,
            value: grade.value === null ? 0 : grade.value,
            comment: grade.comment,
            isAbsent: grade.isAbsent,
            isExcused: grade.isExcused,
          })),
        }),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Les notes ont été enregistrées avec succès",
        })
        fetchGrades()
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.error || "Impossible d'enregistrer les notes",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving grades:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des notes",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">Saisie des notes</h2>
              <p className="text-sm text-gray-500">Note maximale: {maxGrade}</p>
            </div>
            <Button onClick={saveGrades} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>

          <div className="space-y-6">
            {grades.map((grade) => (
              <div key={grade.studentId} className="p-4 border rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium">{grade.student.name || grade.student.email}</h3>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`absent-${grade.studentId}`}
                        checked={grade.isAbsent}
                        onCheckedChange={(checked) => updateAbsenceStatus(grade.studentId, checked === true)}
                      />
                      <Label htmlFor={`absent-${grade.studentId}`}>Absent</Label>
                    </div>
                    {grade.isAbsent && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`excused-${grade.studentId}`}
                          checked={grade.isExcused}
                          onCheckedChange={(checked) => updateExcuseStatus(grade.studentId, checked === true)}
                        />
                        <Label htmlFor={`excused-${grade.studentId}`}>Justifié</Label>
                      </div>
                    )}
                    <div className="w-24">
                      <Input
                        type="number"
                        min="0"
                        max={maxGrade}
                        step="0.25"
                        value={grade.value === null ? "" : grade.value}
                        onChange={(e) => updateGradeValue(grade.studentId, e.target.value)}
                        disabled={grade.isAbsent}
                        placeholder={`/ ${maxGrade}`}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <Textarea
                    placeholder="Commentaire (optionnel)"
                    value={grade.comment || ""}
                    onChange={(e) => updateGradeComment(grade.studentId, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={saveGrades} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
