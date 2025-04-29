"use client"

import { useState, useEffect } from "react"
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { fr } from "date-fns/locale"
import { Check, Clock, X, AlertTriangle, Calendar, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface StudentAttendanceProps {
  studentId: string
  className: string
}

export function StudentAttendance({ studentId, className }: StudentAttendanceProps) {
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
  })

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
      } finally {
        setLoading(false)
      }
    }

    fetchAttendanceRecords()
  }, [studentId, selectedMonth])

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

  // Générer les options de mois (6 derniers mois)
  const monthOptions = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i)
    return {
      value: format(date, "yyyy-MM"),
      label: format(date, "MMMM yyyy", { locale: fr }),
    }
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Résumé - Classe {className}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-green-700">Présences</p>
              <p className="text-2xl font-bold text-green-700">{stats.present}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-sm text-red-700">Absences</p>
              <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <p className="text-sm text-yellow-700">Retards</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.late}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Détails des absences et retards</CardTitle>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Select
              value={format(selectedMonth, "yyyy-MM")}
              onValueChange={(value) => setSelectedMonth(parseISO(`${value}-01`))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner un mois" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : attendanceRecords.length === 0 ? (
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
                  {attendanceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{format(new Date(record.date), "dd/MM/yyyy", { locale: fr })}</TableCell>
                      <TableCell>{record.course.name}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  )
}
