"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Check, Clock, X, AlertTriangle, ArrowLeft, Save, Loader2, Info } from "lucide-react"

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

interface Course {
  id: string
  name: string
  class: {
    id: string
    name: string
  }
}

interface Session {
  id: string
  startTime: string
  endTime: string
  room?: string
  dayOfWeek: number
}

interface CourseAttendanceClientProps {
  course: Course
  students: Student[]
  attendanceRecords: any[]
  date: Date
  alreadySubmitted: boolean
  currentSession: Session | null
  professorId: string
  establishmentId: string
}

export function CourseAttendanceClient({
  course,
  students,
  attendanceRecords,
  date,
  alreadySubmitted,
  currentSession,
  professorId,
  establishmentId,
}: CourseAttendanceClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    return students.map((student) => {
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
  })

  const handleStatusChange = (studentId: string, status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED") => {
    if (alreadySubmitted) return

    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.studentId === studentId
          ? { ...record, status, minutesLate: status === "LATE" ? record.minutesLate || 5 : undefined }
          : record,
      ),
    )
  }

  const handleMinutesLateChange = (studentId: string, minutes: number) => {
    if (alreadySubmitted) return

    setRecords((prevRecords) =>
      prevRecords.map((record) => (record.studentId === studentId ? { ...record, minutesLate: minutes } : record)),
    )
  }

  const handleReasonChange = (studentId: string, reason: string) => {
    if (alreadySubmitted) return

    setRecords((prevRecords) =>
      prevRecords.map((record) => (record.studentId === studentId ? { ...record, reason } : record)),
    )
  }

  const handleSave = async () => {
    if (alreadySubmitted) {
      toast({
        title: "Appel déjà effectué",
        description: "L'appel pour ce cours a déjà été enregistré aujourd'hui et ne peut pas être modifié.",
        variant: "warning",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/courses/${course.id}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: format(date, "yyyy-MM-dd"),
          records,
          sessionId: currentSession?.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erreur lors de l'enregistrement des présences")
      }

      toast({
        title: "Présences enregistrées",
        description: "Les présences ont été enregistrées avec succès.",
      })

      // Rediriger vers la page d'accueil des présences
      router.push(`/professeur/attendance?establishmentId=${establishmentId}`)
      router.refresh()
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des présences:", error)
      toast({
        title: "Erreur",
        description:
          error instanceof Error ? error.message : "Une erreur est survenue lors de l'enregistrement des présences.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const formattedDate = format(date, "EEEE d MMMM yyyy", { locale: fr })

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            onClick={() => router.push(`/professeur/attendance?establishmentId=${establishmentId}`)}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour
          </Button>
          <h1 className="text-2xl font-bold">Appel du cours: {course.name}</h1>
        </div>

        {!alreadySubmitted && (
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Enregistrer
              </>
            )}
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Appel du {formattedDate}</CardTitle>
          <CardDescription>
            Classe: {course.class.name}
            {currentSession && (
              <span className="ml-2">
                • Session: {currentSession.startTime} - {currentSession.endTime}
                {currentSession.room && ` (Salle ${currentSession.room})`}
              </span>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      {alreadySubmitted && (
        <Alert className="mb-6 border-amber-500 bg-amber-50">
          <Info className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-700">Appel déjà effectué</AlertTitle>
          <AlertDescription className="text-amber-600">
            L'appel pour ce cours a déjà été enregistré aujourd'hui. Vous pouvez consulter les présences ci-dessous.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Liste des élèves</TabsTrigger>
          <TabsTrigger value="summary">Résumé</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardContent className="pt-6">
              {students.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                  <p className="text-lg font-medium">Aucun élève trouvé pour ce cours</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Veuillez vérifier que des élèves sont inscrits dans cette classe.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {students.map((student) => {
                    const record = records.find((r) => r.studentId === student.id)
                    if (!record) return null

                    return (
                      <Card key={student.id} className={`overflow-hidden ${alreadySubmitted ? "opacity-90" : ""}`}>
                        <CardHeader className="p-4 bg-gray-50">
                          <CardTitle className="text-base">{student.email}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              type="button"
                              variant={record.status === "PRESENT" ? "default" : "outline"}
                              className={`flex items-center justify-center ${
                                alreadySubmitted ? "cursor-not-allowed" : ""
                              }`}
                              onClick={() => handleStatusChange(student.id, "PRESENT")}
                              disabled={alreadySubmitted}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Présent
                            </Button>
                            <Button
                              type="button"
                              variant={record.status === "ABSENT" ? "destructive" : "outline"}
                              className={`flex items-center justify-center ${
                                alreadySubmitted ? "cursor-not-allowed" : ""
                              }`}
                              onClick={() => handleStatusChange(student.id, "ABSENT")}
                              disabled={alreadySubmitted}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Absent
                            </Button>
                            <Button
                              type="button"
                              variant={record.status === "LATE" ? "warning" : "outline"}
                              className={`flex items-center justify-center ${
                                record.status === "LATE" ? "bg-yellow-500 hover:bg-yellow-600" : ""
                              } ${alreadySubmitted ? "cursor-not-allowed" : ""}`}
                              onClick={() => handleStatusChange(student.id, "LATE")}
                              disabled={alreadySubmitted}
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              En retard
                            </Button>
                            <Button
                              type="button"
                              variant={record.status === "EXCUSED" ? "secondary" : "outline"}
                              className={`flex items-center justify-center ${alreadySubmitted ? "cursor-not-allowed" : ""}`}
                              onClick={() => handleStatusChange(student.id, "EXCUSED")}
                              disabled={alreadySubmitted}
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
                                onChange={(e) =>
                                  handleMinutesLateChange(student.id, Number.parseInt(e.target.value, 10))
                                }
                                className="mt-1"
                                disabled={alreadySubmitted}
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
                                disabled={alreadySubmitted}
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total d'élèves:</span>
                  <span>{students.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Présents:</span>
                  <span>{records.filter((r) => r.status === "PRESENT").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Absents:</span>
                  <span>{records.filter((r) => r.status === "ABSENT").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>En retard:</span>
                  <span>{records.filter((r) => r.status === "LATE").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Excusés:</span>
                  <span>{records.filter((r) => r.status === "EXCUSED").length}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="font-medium">Liste des absents</h3>
                {records.filter((r) => r.status === "ABSENT").length === 0 ? (
                  <p className="text-sm text-gray-500">Aucun élève absent</p>
                ) : (
                  records
                    .filter((r) => r.status === "ABSENT")
                    .map((record) => {
                      const student = students.find((s) => s.id === record.studentId)
                      return student ? (
                        <div key={record.studentId} className="flex justify-between items-center">
                          <span>{student.email}</span>
                          <Badge className="bg-red-500">
                            <X className="h-4 w-4 mr-1" /> Absent
                          </Badge>
                        </div>
                      ) : null
                    })
                )}

                <h3 className="font-medium mt-4">Liste des retards</h3>
                {records.filter((r) => r.status === "LATE").length === 0 ? (
                  <p className="text-sm text-gray-500">Aucun élève en retard</p>
                ) : (
                  records
                    .filter((r) => r.status === "LATE")
                    .map((record) => {
                      const student = students.find((s) => s.id === record.studentId)
                      return student ? (
                        <div key={record.studentId} className="flex justify-between items-center">
                          <span>{student.email}</span>
                          <div className="flex items-center">
                            <span className="text-sm mr-2">{record.minutesLate} min</span>
                            <Badge className="bg-yellow-500">
                              <Clock className="h-4 w-4 mr-1" /> En retard
                            </Badge>
                          </div>
                        </div>
                      ) : null
                    })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
