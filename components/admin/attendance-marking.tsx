"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Clock } from "lucide-react"

interface Student {
  id: string
  name: string
  status: "present" | "absent" | "late" | null
  lateMinutes?: number
}

const students: Student[] = [
  { id: "1", name: "Emma Martin", status: null },
  { id: "2", name: "Lucas Bernard", status: null },
  { id: "3", name: "Chloé Dubois", status: null },
  { id: "4", name: "Nathan Thomas", status: null },
  { id: "5", name: "Léa Richard", status: null },
  { id: "6", name: "Hugo Petit", status: null },
  { id: "7", name: "Manon Robert", status: null },
  { id: "8", name: "Théo Simon", status: null },
  { id: "9", name: "Camille Michel", status: null },
  { id: "10", name: "Maxime Durand", status: null },
]

export function AttendanceMarking() {
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [date, setDate] = useState<Date>(new Date())
  const [period, setPeriod] = useState<string>("")
  const [studentList, setStudentList] = useState<Student[]>(students)

  const updateStudentStatus = (id: string, status: "present" | "absent" | "late", lateMinutes?: number) => {
    setStudentList((prev) => prev.map((student) => (student.id === id ? { ...student, status, lateMinutes } : student)))
  }

  const markAllPresent = () => {
    setStudentList((prev) => prev.map((student) => ({ ...student, status: "present", lateMinutes: undefined })))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sélectionner une classe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6a">6ème A</SelectItem>
            <SelectItem value="6b">6ème B</SelectItem>
            <SelectItem value="5a">5ème A</SelectItem>
            <SelectItem value="5b">5ème B</SelectItem>
            <SelectItem value="4a">4ème A</SelectItem>
            <SelectItem value="4b">4ème B</SelectItem>
            <SelectItem value="3a">3ème A</SelectItem>
            <SelectItem value="3b">3ème B</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[200px] justify-start text-left font-normal",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "dd MMMM yyyy", { locale: fr }) : "Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              initialFocus
              locale={fr}
            />
          </PopoverContent>
        </Popover>

        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sélectionner un créneau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="8h-9h">8h - 9h</SelectItem>
            <SelectItem value="9h-10h">9h - 10h</SelectItem>
            <SelectItem value="10h-11h">10h - 11h</SelectItem>
            <SelectItem value="11h-12h">11h - 12h</SelectItem>
            <SelectItem value="13h-14h">13h - 14h</SelectItem>
            <SelectItem value="14h-15h">14h - 15h</SelectItem>
            <SelectItem value="15h-16h">15h - 16h</SelectItem>
            <SelectItem value="16h-17h">16h - 17h</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedClass && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Appel de la classe {selectedClass.toUpperCase()}</CardTitle>
              <Button onClick={markAllPresent} variant="outline" size="sm">
                Tous présents
              </Button>
            </div>
            <CardDescription>
              {date ? format(date, "EEEE dd MMMM yyyy", { locale: fr }) : ""}
              {period ? ` - ${period}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Élève</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Retard</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentList.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <RadioGroup
                        value={student.status || ""}
                        onValueChange={(value: "present" | "absent" | "late") =>
                          updateStudentStatus(student.id, value, student.lateMinutes)
                        }
                        className="flex flex-row space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="present" id={`present-${student.id}`} />
                          <Label htmlFor={`present-${student.id}`}>Présent</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="absent" id={`absent-${student.id}`} />
                          <Label htmlFor={`absent-${student.id}`}>Absent</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="late" id={`late-${student.id}`} />
                          <Label htmlFor={`late-${student.id}`}>Retard</Label>
                        </div>
                      </RadioGroup>
                    </TableCell>
                    <TableCell>
                      {student.status === "late" && (
                        <div className="flex items-center space-x-2 max-w-[150px]">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="Minutes"
                            value={student.lateMinutes || ""}
                            onChange={(e) =>
                              updateStudentStatus(
                                student.id,
                                "late",
                                e.target.value ? Number.parseInt(e.target.value) : undefined,
                              )
                            }
                            className="h-8"
                          />
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-6 flex justify-end">
              <Button>Enregistrer l'appel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
