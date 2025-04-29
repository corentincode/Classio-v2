"use client"

import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Check, Clock, X, AlertTriangle, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AttendanceListProps {
  attendanceRecords: any[]
}

export function AttendanceList({ attendanceRecords }: AttendanceListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesSearch = record.student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter ? record.status === statusFilter : true
    return matchesSearch && matchesStatus
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

  if (attendanceRecords.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <p className="text-lg font-medium">Aucun enregistrement d'assiduité trouvé</p>
            <p className="text-sm text-gray-500 mt-2">Aucune absence ou retard n'a été enregistré pour ce cours.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des absences et retards</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher un élève..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les statuts</SelectItem>
                  <SelectItem value="PRESENT">Présent</SelectItem>
                  <SelectItem value="ABSENT">Absent</SelectItem>
                  <SelectItem value="LATE">En retard</SelectItem>
                  <SelectItem value="EXCUSED">Excusé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Élève</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Détails</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{format(new Date(record.date), "dd/MM/yyyy", { locale: fr })}</TableCell>
                    <TableCell>{record.student.email}</TableCell>
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
        </div>
      </CardContent>
    </Card>
  )
}
