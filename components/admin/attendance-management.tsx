"use client"

import { useState, useEffect } from "react"
import { format, addDays, subDays } from "date-fns"
import { fr } from "date-fns/locale"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Download,
  Loader2,
  Check,
  X,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface Class {
  id: string
  name: string
  _count?: {
    students: number
  }
}

interface Course {
  id: string
  name: string
  professor: {
    id: string
    email: string
    firstName?: string
    lastName?: string
  }
}

interface Student {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

interface AttendanceRecord {
  id: string
  date: string
  status: string
  reason?: string
  minutesLate?: number
  student: {
    id: string
    email: string
    firstName?: string
    lastName?: string
  }
  course: {
    id: string
    name: string
  }
  recordedBy: {
    id: string
    email: string
    firstName?: string
    lastName?: string
  }
  createdAt: string
  updatedAt: string
}

interface AdminAttendanceManagementProps {
  adminId: string
  establishmentId: string
  classes: Class[]
}

export function AdminAttendanceManagement({ adminId, establishmentId, classes }: AdminAttendanceManagementProps) {
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [selectedCourse, setSelectedCourse] = useState<string>("all_courses")
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState<string>("list")
  const [loading, setLoading] = useState<boolean>(false)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [newStatus, setNewStatus] = useState<string>("")
  const [newReason, setNewReason] = useState<string>("")
  const [newMinutesLate, setNewMinutesLate] = useState<number>(0)
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
  })

  // Charger les cours lorsqu'une classe est sélectionnée
  useEffect(() => {
    if (selectedClass) {
      setLoading(true)
      fetch(`/api/establishments/${establishmentId}/classes/${selectedClass}/courses`)
        .then((res) => res.json())
        .then((data) => {
          setCourses(data)
          setSelectedCourse("all_courses")
        })
        .catch((error) => {
          console.error("Erreur lors du chargement des cours:", error)
          toast({
            title: "Erreur",
            description: "Impossible de charger les cours",
            variant: "destructive",
          })
        })
        .finally(() => setLoading(false))
    } else {
      setCourses([])
      setSelectedCourse("all_courses")
    }
  }, [selectedClass, establishmentId])

  // Charger les étudiants lorsqu'une classe est sélectionnée
  useEffect(() => {
    if (selectedClass) {
      setLoading(true)
      fetch(`/api/establishments/${establishmentId}/classes/${selectedClass}/students`)
        .then((res) => res.json())
        .then((data) => {
          setStudents(data)
        })
        .catch((error) => {
          console.error("Erreur lors du chargement des étudiants:", error)
          toast({
            title: "Erreur",
            description: "Impossible de charger les étudiants",
            variant: "destructive",
          })
        })
        .finally(() => setLoading(false))
    } else {
      setStudents([])
    }
  }, [selectedClass, establishmentId])

  // Charger les enregistrements d'assiduité
  const loadAttendanceRecords = async () => {
    if (!selectedClass) {
      toast({
        title: "Information",
        description: "Veuillez sélectionner une classe",
      })
      return
    }

    setLoading(true)
    try {
      let url = `/api/classes/${selectedClass}/attendance?date=${format(selectedDate, "yyyy-MM-dd")}`

      if (selectedCourse && selectedCourse !== "all_courses") {
        url += `&courseId=${selectedCourse}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des données")
      }

      const data = await response.json()
      setAttendanceRecords(data)

      // Calculer les statistiques
      const total = data.length
      const present = data.filter((record: AttendanceRecord) => record.status === "PRESENT").length
      const absent = data.filter((record: AttendanceRecord) => record.status === "ABSENT").length
      const late = data.filter((record: AttendanceRecord) => record.status === "LATE").length
      const excused = data.filter((record: AttendanceRecord) => record.status === "EXCUSED").length

      setStats({ total, present, absent, late, excused })
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les enregistrements d'assiduité",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filtrer les enregistrements par recherche
  const filteredRecords = attendanceRecords.filter((record) => {
    const studentName = `${record.student.firstName || ""} ${record.student.lastName || ""}`.toLowerCase()
    const studentEmail = record.student.email.toLowerCase()
    const courseName = record.course.name.toLowerCase()
    const query = searchQuery.toLowerCase()

    return studentName.includes(query) || studentEmail.includes(query) || courseName.includes(query)
  })

  // Gérer la modification d'un enregistrement
  const handleEditRecord = (record: AttendanceRecord) => {
    setEditingRecord(record)
    setNewStatus(record.status)
    setNewReason(record.reason || "")
    setNewMinutesLate(record.minutesLate || 0)
    setIsEditDialogOpen(true)
  }

  // Sauvegarder les modifications
  const saveRecordChanges = async () => {
    if (!editingRecord) return

    setLoading(true)
    try {
      const response = await fetch(`/api/attendance/${editingRecord.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          reason: newReason || null,
          minutesLate: newStatus === "LATE" ? newMinutesLate : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour")
      }

      toast({
        title: "Succès",
        description: "Enregistrement mis à jour avec succès",
      })

      // Recharger les données
      loadAttendanceRecords()
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'enregistrement",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setIsEditDialogOpen(false)
      setEditingRecord(null)
    }
  }

  // Exporter les données en CSV
  const exportToCSV = () => {
    if (filteredRecords.length === 0) {
      toast({
        title: "Information",
        description: "Aucune donnée à exporter",
      })
      return
    }

    // Créer les en-têtes CSV
    const headers = ["Date", "Élève", "Email", "Cours", "Statut", "Détails", "Enregistré par"]

    // Créer les lignes de données
    const rows = filteredRecords.map((record) => [
      format(new Date(record.date), "dd/MM/yyyy"),
      `${record.student.firstName || ""} ${record.student.lastName || ""}`.trim(),
      record.student.email,
      record.course.name,
      record.status,
      record.status === "LATE" ? `${record.minutesLate} min de retard` : record.reason || "",
      `${record.recordedBy.firstName || ""} ${record.recordedBy.lastName || ""}`.trim() || record.recordedBy.email,
    ])

    // Combiner les en-têtes et les lignes
    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    // Créer un blob et un lien de téléchargement
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `absences_${format(selectedDate, "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PRESENT":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="h-3 w-3 mr-1" />
            Présent
          </Badge>
        )
      case "ABSENT":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <X className="h-3 w-3 mr-1" />
            Absent
          </Badge>
        )
      case "LATE":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            En retard
          </Badge>
        )
      case "EXCUSED":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Excusé
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Sélectionnez une classe, un cours et une date pour afficher les absences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Classe</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} {cls._count && `(${cls._count.students} élèves)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cours</label>
              <Select
                value={selectedCourse}
                onValueChange={setSelectedCourse}
                disabled={!selectedClass || courses.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les cours" />
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => setSelectedDate(subDays(selectedDate, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(selectedDate, "dd MMMM yyyy", { locale: fr })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Button variant="outline" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={loadAttendanceRecords} disabled={!selectedClass || loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Filter className="mr-2 h-4 w-4" />}
            Afficher les résultats
          </Button>
        </CardFooter>
      </Card>

      {attendanceRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résumé</CardTitle>
            <CardDescription>
              Statistiques pour le {format(selectedDate, "dd MMMM yyyy", { locale: fr })}
              {selectedCourse &&
                courses.find((c) => c.id === selectedCourse) &&
                ` - ${courses.find((c) => c.id === selectedCourse)?.name}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-green-700">Présences</p>
                <p className="text-2xl font-bold text-green-700">{stats.present}</p>
                <p className="text-xs text-green-600">
                  {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-sm text-red-700">Absences</p>
                <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
                <p className="text-xs text-red-600">
                  {stats.total > 0 ? Math.round((stats.absent / stats.total) * 100) : 0}%
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-sm text-yellow-700">Retards</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.late}</p>
                <p className="text-xs text-yellow-600">
                  {stats.total > 0 ? Math.round((stats.late / stats.total) * 100) : 0}%
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-700">Excusés</p>
                <p className="text-2xl font-bold text-blue-700">{stats.excused}</p>
                <p className="text-xs text-blue-600">
                  {stats.total > 0 ? Math.round((stats.excused / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {attendanceRecords.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Liste des absences et retards</CardTitle>
              <CardDescription>{filteredRecords.length} enregistrements trouvés</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-8 w-[200px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Cours</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Détails</TableHead>
                    <TableHead>Enregistré par</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Aucun résultat trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="font-medium">
                            {record.student.firstName} {record.student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{record.student.email}</div>
                        </TableCell>
                        <TableCell>{record.course.name}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          {record.status === "LATE" && record.minutesLate && (
                            <span className="text-sm text-gray-500">{record.minutesLate} minutes de retard</span>
                          )}
                          {record.reason && <p className="text-sm text-gray-500 mt-1">Motif: {record.reason}</p>}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {record.recordedBy.firstName} {record.recordedBy.lastName || record.recordedBy.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(record.createdAt), "dd/MM/yyyy HH:mm")}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditRecord(record)}>
                            Modifier
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogue de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'enregistrement</DialogTitle>
            <DialogDescription>Modifiez le statut de présence et les détails associés.</DialogDescription>
          </DialogHeader>

          {editingRecord && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Élève</label>
                <div className="p-2 border rounded-md bg-gray-50">
                  {editingRecord.student.firstName} {editingRecord.student.lastName} ({editingRecord.student.email})
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cours</label>
                <div className="p-2 border rounded-md bg-gray-50">{editingRecord.course.name}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRESENT">Présent</SelectItem>
                    <SelectItem value="ABSENT">Absent</SelectItem>
                    <SelectItem value="LATE">En retard</SelectItem>
                    <SelectItem value="EXCUSED">Excusé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newStatus === "LATE" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minutes de retard</label>
                  <Input
                    type="number"
                    min="1"
                    value={newMinutesLate}
                    onChange={(e) => setNewMinutesLate(Number.parseInt(e.target.value) || 0)}
                  />
                </div>
              )}

              {(newStatus === "ABSENT" || newStatus === "EXCUSED") && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Motif</label>
                  <Input
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    placeholder="Motif de l'absence ou justification"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={saveRecordChanges} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
