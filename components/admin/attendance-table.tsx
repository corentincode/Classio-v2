"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, FileText, CheckCircle, XCircle, Clock } from "lucide-react"

type Status = "present" | "absent" | "late" | "excused" | "unexcused"

interface Attendance {
  id: string
  student: string
  class: string
  date: string
  status: Status
  duration?: string
  justification: boolean
}

const statusConfig = {
  present: { label: "Présent", color: "bg-green-100 text-green-800 hover:bg-green-100/80", icon: CheckCircle },
  absent: { label: "Absent", color: "bg-red-100 text-red-800 hover:bg-red-100/80", icon: XCircle },
  late: { label: "En retard", color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80", icon: Clock },
  excused: { label: "Justifiée", color: "bg-blue-100 text-blue-800 hover:bg-blue-100/80", icon: FileText },
  unexcused: { label: "Non justifiée", color: "bg-gray-100 text-gray-800 hover:bg-gray-100/80", icon: XCircle },
}

const attendanceData: Attendance[] = [
  { id: "1", student: "Emma Martin", class: "3ème A", date: "12/04/2023", status: "present", justification: false },
  { id: "2", student: "Lucas Bernard", class: "3ème A", date: "12/04/2023", status: "absent", justification: true },
  {
    id: "3",
    student: "Chloé Dubois",
    class: "3ème A",
    date: "12/04/2023",
    status: "late",
    duration: "15 min",
    justification: true,
  },
  { id: "4", student: "Nathan Thomas", class: "3ème A", date: "12/04/2023", status: "absent", justification: false },
  { id: "5", student: "Léa Richard", class: "3ème A", date: "12/04/2023", status: "present", justification: false },
  {
    id: "6",
    student: "Hugo Petit",
    class: "3ème B",
    date: "12/04/2023",
    status: "late",
    duration: "10 min",
    justification: false,
  },
  { id: "7", student: "Manon Robert", class: "3ème B", date: "12/04/2023", status: "present", justification: false },
  { id: "8", student: "Théo Simon", class: "3ème B", date: "12/04/2023", status: "absent", justification: true },
  { id: "9", student: "Camille Michel", class: "3ème B", date: "12/04/2023", status: "present", justification: false },
  { id: "10", student: "Maxime Durand", class: "3ème B", date: "12/04/2023", status: "absent", justification: false },
]

export function AttendanceTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  const toggleAll = () => {
    setSelectedRows((prev) => (prev.length === attendanceData.length ? [] : attendanceData.map((row) => row.id)))
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedRows.length === attendanceData.length && attendanceData.length > 0}
                onCheckedChange={toggleAll}
                aria-label="Sélectionner toutes les lignes"
              />
            </TableHead>
            <TableHead>Élève</TableHead>
            <TableHead>Classe</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Justification</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceData.map((row) => {
            const StatusIcon = statusConfig[row.status].icon
            return (
              <TableRow key={row.id} className={selectedRows.includes(row.id) ? "bg-muted/50" : undefined}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(row.id)}
                    onCheckedChange={() => toggleRow(row.id)}
                    aria-label={`Sélectionner ${row.student}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{row.student}</TableCell>
                <TableCell>{row.class}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={statusConfig[row.status].color}>
                      <StatusIcon className="mr-1 h-3.5 w-3.5" />
                      {statusConfig[row.status].label}
                      {row.duration && ` (${row.duration})`}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  {row.status !== "present" && (
                    <Badge variant={row.justification ? "outline" : "destructive"}>
                      {row.justification ? "Justifiée" : "Non justifiée"}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Modifier le statut</DropdownMenuItem>
                      <DropdownMenuItem>Ajouter un justificatif</DropdownMenuItem>
                      <DropdownMenuItem>Contacter les parents</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
