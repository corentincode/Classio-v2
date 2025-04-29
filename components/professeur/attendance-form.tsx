"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Check, Clock, X, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface Student {
  id: string
  email: string
}

interface AttendanceRecord {
  id?: string
  studentId: string
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"
  minutesLate?: number
  reason?: string
}

interface AttendanceFormProps {
  students: Student[]
  attendanceRecords: any[]
  onSave: (records: AttendanceRecord[]) => Promise<boolean>
  date: Date
}

export function AttendanceForm({ students, attendanceRecords, onSave, date }: AttendanceFormProps) {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [saving, setSaving] = useState<boolean>(false)

  // Initialiser les enregistrements avec les données existantes ou par défaut
  useEffect(() => {
    if (students.length > 0) {
      const initialRecords = students.map((student) => {
        const existingRecord = attendanceRecords.find((record) => record.student?.id === student.id)

        if (existingRecord) {
          return {
            id: existingRecord.id,
            studentId: student.id,
            status: existingRecord.status,
            minutesLate: existingRecord.minutesLate || undefined,
            reason: existingRecord.reason || undefined,
          }
        }

        return {
          studentId: student.id,
          status: "PRESENT" as const,
        }
      })

      setRecords(initialRecords)
    }
  }, [students, attendanceRecords])

  const handleStatusChange = (studentId: string, status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED") => {
    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.studentId === studentId
          ? { ...record, status, minutesLate: status === "LATE" ? record.minutesLate || 5 : undefined }
          : record,
      ),
    )
  }

  const handleMinutesLateChange = (studentId: string, minutes: number) => {
    setRecords((prevRecords) =>
      prevRecords.map((record) => (record.studentId === studentId ? { ...record, minutesLate: minutes } : record)),
    )
  }

  const handleReasonChange = (studentId: string, reason: string) => {
    setRecords((prevRecords) =>
      prevRecords.map((record) => (record.studentId === studentId ? { ...record, reason } : record)),
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const success = await onSave(records)
      if (success) {
        toast({
          title: "Absences enregistrées",
          description: "Les absences ont été enregistrées avec succès.",
        })
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'enregistrement des absences.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des absences:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des absences.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <p className="text-lg font-medium">Aucun élève trouvé pour ce cours</p>
            <p className="text-sm text-gray-500 mt-2">
              Veuillez vérifier que des élèves sont inscrits dans cette classe.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Absences du {format(date, "EEEE d MMMM yyyy", { locale: fr })}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => {
              const record = records.find((r) => r.studentId === student.id)
              if (!record) return null

              return (
                <Card key={student.id} className="overflow-hidden">
                  <CardHeader className="p-4 bg-gray-50">
                    <CardTitle className="text-base">{student.email}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={record.status === "PRESENT" ? "default" : "outline"}
                        className="flex items-center justify-center"
                        onClick={() => handleStatusChange(student.id, "PRESENT")}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Présent
                      </Button>
                      <Button
                        type="button"
                        variant={record.status === "ABSENT" ? "destructive" : "outline"}
                        className="flex items-center justify-center"
                        onClick={() => handleStatusChange(student.id, "ABSENT")}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Absent
                      </Button>
                      <Button
                        type="button"
                        variant={record.status === "LATE" ? "warning" : "outline"}
                        className={`flex items-center justify-center ${
                          record.status === "LATE" ? "bg-yellow-500 hover:bg-yellow-600" : ""
                        }`}
                        onClick={() => handleStatusChange(student.id, "LATE")}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        En retard
                      </Button>
                      <Button
                        type="button"
                        variant={record.status === "EXCUSED" ? "secondary" : "outline"}
                        className="flex items-center justify-center"
                        onClick={() => handleStatusChange(student.id, "EXCUSED")}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Excusé
                      </Button>
                    </div>

                    {record.status === "LATE" && (
                      <div>
                        <Label htmlFor={`minutes-${student.id}`}>Minutes de retard</Label>
                        <Input
                          id={`minutes-${student.id}`}
                          type="number"
                          min="1"
                          value={record.minutesLate || 5}
                          onChange={(e) => handleMinutesLateChange(student.id, Number.parseInt(e.target.value, 10))}
                          className="mt-1"
                        />
                      </div>
                    )}

                    {(record.status === "ABSENT" || record.status === "LATE" || record.status === "EXCUSED") && (
                      <div>
                        <Label htmlFor={`reason-${student.id}`}>Motif</Label>
                        <Textarea
                          id={`reason-${student.id}`}
                          value={record.reason || ""}
                          onChange={(e) => handleReasonChange(student.id, e.target.value)}
                          className="mt-1"
                          placeholder="Motif de l'absence ou du retard..."
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
