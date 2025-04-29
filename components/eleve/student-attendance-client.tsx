"use client"

import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, subMonths, addMonths } from "date-fns"
import { fr } from "date-fns/locale"
import { Check, Clock, X, AlertTriangle, Loader2, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

interface AttendanceStats {
  total: number
  present: number
  absent: number
  late: number
  excused: number
}

interface StudentAttendanceClientProps {
  studentId: string
  className: string
  initialStats: AttendanceStats
}

export function StudentAttendanceClient({ studentId, className, initialStats }: StudentAttendanceClientProps) {
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  const [stats, setStats] = useState<AttendanceStats>(initialStats)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("all")

  // Charger les enregistrements d'assiduité pour l'élève
  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      setLoading(true)
      try {
        const fromDate = format(startOfMonth(selectedMonth), "yyyy-MM-dd")
        const toDate = format(endOfMonth(selectedMonth), "yyyy-MM-dd")

        const response = await fetch(`/api/students/${studentId}/attendance?fromDate=${fromDate}&toDate=${toDate}`)

        if (response.ok) {
          const data = await response.json()
          setAttendanceRecords(data)

          // Calculer les statistiques
          const total = data.length
          const present = data.filter((record: any) => record.status === "PRESENT").length
          const absent = data.filter((record: any) => record.status === "ABSENT").length
          const late = data.filter((record: any) => record.status === "LATE").length
          const excused = data.filter((record: any) => record.status === "EXCUSED").length

          setStats({ total, present, absent, late, excused })
        }
      } catch (error) {
        console.error("Erreur lors du chargement des enregistrements d'assiduité:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les enregistrements d'assiduité",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAttendanceRecords()
  }, [studentId, selectedMonth])

  // Filtrer les enregistrements par recherche et par type
  const filteredRecords = attendanceRecords.filter((record) => {
    const courseName = record.course.name.toLowerCase()
    const query = searchQuery.toLowerCase()
    const matchesSearch = courseName.includes(query)

    if (activeTab === "all") return matchesSearch
    if (activeTab === "absences") return record.status === "ABSENT" && matchesSearch
    if (activeTab === "lates") return record.status === "LATE" && matchesSearch
    if (activeTab === "excused") return record.status === "EXCUSED" && matchesSearch

    return matchesSearch
  })

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
          <CardTitle>Résumé - Classe {className}</CardTitle>
          <CardDescription>Statistiques pour {format(selectedMonth, "MMMM yyyy", { locale: fr })}</CardDescription>
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Détails des absences et retards</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">{format(selectedMonth, "MMMM yyyy", { locale: fr })}</div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
              disabled={addMonths(selectedMonth, 1) > new Date()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="all">Tout</TabsTrigger>
                  <TabsTrigger value="absences">Absences</TabsTrigger>
                  <TabsTrigger value="lates">Retards</TabsTrigger>
                  <TabsTrigger value="excused">Excusés</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher un cours..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                <p className="text-lg font-medium">Aucun enregistrement trouvé</p>
                <p className="text-sm text-gray-500 mt-2">
                  Aucune absence ou retard n'a été enregistré pour cette période.
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Cours</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Détails</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{format(new Date(record.date), "dd/MM/yyyy", { locale: fr })}</TableCell>
                        <TableCell>
                          <div className="font-medium">{record.course.name}</div>
                          {record.session && record.session.startTime && record.session.endTime && (
                            <div className="text-xs text-gray-500">
                              {record.session.startTime} - {record.session.endTime}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          {record.status === "LATE" && record.minutesLate && (
                            <span className="text-sm text-gray-500">{record.minutesLate} minutes de retard</span>
                          )}
                          {record.reason && <p className="text-sm text-gray-500 mt-1">Motif: {record.reason}</p>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
