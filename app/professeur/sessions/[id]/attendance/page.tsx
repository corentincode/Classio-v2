"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft, Save, Check, X, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface Student {
  id: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

interface Attendance {
  id: string
  studentId: string
  sessionId: string
  status: string
  comment: string
  date: string
  student: Student
}

interface Session {
  id: string
  courseId: string
  date: string
  startTime: string
  endTime: string
  course: {
    id: string
    name: string
    class: {
      id: string
      name: string
      students: Student[]
    }
  }
}

export default function SessionAttendancePage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string

  const [session, setSession] = useState<Session | null>(null)
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [studentAttendances, setStudentAttendances] = useState<Record<string, { status: string; comment: string }>>({})

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        // Fetch session details
        const sessionRes = await fetch(`/api/sessions/${sessionId}`)
        if (!sessionRes.ok) throw new Error("Failed to fetch session")
        const sessionData = await sessionRes.json()
        setSession(sessionData)

        // Fetch existing attendances
        const attendanceRes = await fetch(`/api/sessions/${sessionId}/attendance`)
        if (!attendanceRes.ok) throw new Error("Failed to fetch attendances")
        const attendanceData = await attendanceRes.json()
        setAttendances(attendanceData)

        // Initialize student attendances
        const initialAttendances: Record<string, { status: string; comment: string }> = {}

        // First, set default values for all students
        if (sessionData.course?.class?.students) {
          sessionData.course.class.students.forEach((student: Student) => {
            initialAttendances[student.id] = { status: "present", comment: "" }
          })
        }

        // Then override with existing attendance data
        attendanceData.forEach((attendance: Attendance) => {
          initialAttendances[attendance.studentId] = {
            status: attendance.status,
            comment: attendance.comment || "",
          }
        })

        setStudentAttendances(initialAttendances)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de la session",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchSessionData()
  }, [sessionId])

  const handleStatusChange = (studentId: string, status: string) => {
    setStudentAttendances((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }))
  }

  const handleCommentChange = (studentId: string, comment: string) => {
    setStudentAttendances((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], comment },
    }))
  }

  const saveAttendance = async () => {
    setSaving(true)
    try {
      const promises = Object.entries(studentAttendances).map(([studentId, data]) => {
        return fetch(`/api/sessions/${sessionId}/attendance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId,
            status: data.status,
            comment: data.comment,
          }),
        })
      })

      await Promise.all(promises)

      toast({
        title: "Succès",
        description: "Les présences ont été enregistrées avec succès",
      })

      // Refresh attendance data
      const attendanceRes = await fetch(`/api/sessions/${sessionId}/attendance`)
      if (attendanceRes.ok) {
        const attendanceData = await attendanceRes.json()
        setAttendances(attendanceData)
      }
    } catch (error) {
      console.error("Error saving attendances:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les présences",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return (
          <Badge className="bg-green-500">
            <Check className="h-4 w-4 mr-1" /> Présent
          </Badge>
        )
      case "absent":
        return (
          <Badge className="bg-red-500">
            <X className="h-4 w-4 mr-1" /> Absent
          </Badge>
        )
      case "late":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="h-4 w-4 mr-1" /> En retard
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement...</span>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="p-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour
        </Button>
        <Card className="mt-4">
          <CardContent className="pt-6">
            <p>Session non trouvée</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formattedDate = new Date(session.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour
        </Button>
        <Button onClick={saveAttendance} disabled={saving}>
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
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Gestion des présences</CardTitle>
          <div className="text-sm text-muted-foreground">
            {session.course?.name} - {formattedDate} - {session.startTime} à {session.endTime}
          </div>
          <div className="text-sm font-medium">Classe: {session.course?.class?.name}</div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Liste des élèves</TabsTrigger>
          <TabsTrigger value="summary">Résumé</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardContent className="pt-6">
              {session.course?.class?.students?.length === 0 ? (
                <p>Aucun élève dans cette classe</p>
              ) : (
                <div className="space-y-4">
                  {session.course?.class?.students?.map((student) => (
                    <div key={student.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">
                          {student.user.firstName} {student.user.lastName}
                        </div>
                        <Select
                          value={studentAttendances[student.id]?.status || "present"}
                          onValueChange={(value) => handleStatusChange(student.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">Présent</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="late">En retard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Textarea
                        placeholder="Commentaire (optionnel)"
                        value={studentAttendances[student.id]?.comment || ""}
                        onChange={(e) => handleCommentChange(student.id, e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  ))}
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
                  <span>{session.course?.class?.students?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Présents:</span>
                  <span>{Object.values(studentAttendances).filter((a) => a.status === "present").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Absents:</span>
                  <span>{Object.values(studentAttendances).filter((a) => a.status === "absent").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>En retard:</span>
                  <span>{Object.values(studentAttendances).filter((a) => a.status === "late").length}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="font-medium">Liste des absents</h3>
                {Object.entries(studentAttendances)
                  .filter(([_, data]) => data.status === "absent")
                  .map(([studentId]) => {
                    const student = session.course?.class?.students?.find((s) => s.id === studentId)
                    return student ? (
                      <div key={studentId} className="flex justify-between items-center">
                        <span>
                          {student.user.firstName} {student.user.lastName}
                        </span>
                        {getStatusBadge("absent")}
                      </div>
                    ) : null
                  })}

                <h3 className="font-medium mt-4">Liste des retards</h3>
                {Object.entries(studentAttendances)
                  .filter(([_, data]) => data.status === "late")
                  .map(([studentId]) => {
                    const student = session.course?.class?.students?.find((s) => s.id === studentId)
                    return student ? (
                      <div key={studentId} className="flex justify-between items-center">
                        <span>
                          {student.user.firstName} {student.user.lastName}
                        </span>
                        {getStatusBadge("late")}
                      </div>
                    ) : null
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
