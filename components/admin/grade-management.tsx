"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Save } from "lucide-react"

export function GradeManagement() {
  const [selectedClass, setSelectedClass] = useState("6ème A")
  const [selectedSubject, setSelectedSubject] = useState("Mathématiques")
  const [selectedPeriod, setSelectedPeriod] = useState("Trimestre 1")

  const classes = ["6ème A", "5ème B", "4ème C", "3ème A", "2nde 3", "1ère S2", "Term ES1"]
  const subjects = ["Mathématiques", "Français", "Histoire-Géographie", "Anglais", "SVT", "Physique-Chimie", "EPS"]
  const periods = ["Trimestre 1", "Trimestre 2", "Trimestre 3"]

  // Exemple de données d'élèves
  const students = [
    { id: 1, name: "Emma Martin", grades: [15, 16, 14], average: 15 },
    { id: 2, name: "Lucas Dubois", grades: [12, 13, 11], average: 12 },
    { id: 3, name: "Chloé Bernard", grades: [18, 17, 19], average: 18 },
    { id: 4, name: "Nathan Petit", grades: [10, 11, 9], average: 10 },
    { id: 5, name: "Léa Moreau", grades: [14, 15, 13], average: 14 },
    { id: 6, name: "Hugo Lefebvre", grades: [16, 15, 17], average: 16 },
    { id: 7, name: "Manon Leroy", grades: [13, 12, 14], average: 13 },
    { id: 8, name: "Théo Roux", grades: [11, 10, 12], average: 11 },
    { id: 9, name: "Camille Fournier", grades: [17, 18, 16], average: 17 },
    { id: 10, name: "Louis Girard", grades: [9, 10, 8], average: 9 },
  ]

  // Exemple de données d'évaluations
  const evaluations = [
    { id: 1, title: "Contrôle 1", date: "15/09/2023", coefficient: 1 },
    { id: 2, title: "Contrôle 2", date: "12/10/2023", coefficient: 1 },
    { id: 3, title: "Devoir commun", date: "20/11/2023", coefficient: 2 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner une classe" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls} value={cls}>
                {cls}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner une matière" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner une période" />
          </SelectTrigger>
          <SelectContent>
            {periods.map((period) => (
              <SelectItem key={period} value={period}>
                {period}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Évaluations</h3>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une évaluation
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Coefficient</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell>{evaluation.title}</TableCell>
                    <TableCell>{evaluation.date}</TableCell>
                    <TableCell>{evaluation.coefficient}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Notes des élèves</h3>
            <Button size="sm" variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Élève</TableHead>
                  {evaluations.map((evaluation) => (
                    <TableHead key={evaluation.id}>{evaluation.title}</TableHead>
                  ))}
                  <TableHead>Moyenne</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    {student.grades.map((grade, index) => (
                      <TableCell key={index}>
                        <Input type="number" min="0" max="20" step="0.5" defaultValue={grade} className="w-16 h-8" />
                      </TableCell>
                    ))}
                    <TableCell className="font-medium">{student.average}/20</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
