"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, Printer } from "lucide-react"

export function ReportGeneration() {
  const [selectedClass, setSelectedClass] = useState("6ème A")
  const [selectedPeriod, setSelectedPeriod] = useState("Trimestre 1")

  const classes = ["6ème A", "5ème B", "4ème C", "3ème A", "2nde 3", "1ère S2", "Term ES1"]
  const periods = ["Trimestre 1", "Trimestre 2", "Trimestre 3"]

  // Exemple de données d'élèves
  const students = [
    {
      id: 1,
      name: "Emma Martin",
      average: 15.2,
      rank: "3/25",
      appreciation: "Très bon trimestre, élève sérieuse et impliquée.",
      status: "Terminé",
    },
    {
      id: 2,
      name: "Lucas Dubois",
      average: 12.5,
      rank: "12/25",
      appreciation: "Trimestre satisfaisant mais des efforts à fournir en mathématiques.",
      status: "Terminé",
    },
    {
      id: 3,
      name: "Chloé Bernard",
      average: 17.8,
      rank: "1/25",
      appreciation: "Excellent trimestre, félicitations pour ce très beau parcours.",
      status: "Terminé",
    },
    {
      id: 4,
      name: "Nathan Petit",
      average: 10.2,
      rank: "18/25",
      appreciation: "Trimestre moyen, manque de travail personnel.",
      status: "En attente",
    },
    {
      id: 5,
      name: "Léa Moreau",
      average: 14.5,
      rank: "5/25",
      appreciation: "Bon trimestre dans l'ensemble, continue ainsi.",
      status: "Terminé",
    },
    {
      id: 6,
      name: "Hugo Lefebvre",
      average: 16.3,
      rank: "2/25",
      appreciation: "Très bon trimestre, élève sérieux et motivé.",
      status: "Terminé",
    },
    {
      id: 7,
      name: "Manon Leroy",
      average: 13.1,
      rank: "8/25",
      appreciation: "Trimestre satisfaisant, bonne participation en classe.",
      status: "En attente",
    },
    {
      id: 8,
      name: "Théo Roux",
      average: 11.4,
      rank: "15/25",
      appreciation: "Des résultats moyens, doit approfondir son travail personnel.",
      status: "Non commencé",
    },
    {
      id: 9,
      name: "Camille Fournier",
      average: 16.9,
      rank: "2/25",
      appreciation: "Excellent trimestre, félicitations pour ton investissement.",
      status: "Terminé",
    },
    {
      id: 10,
      name: "Louis Girard",
      average: 9.8,
      rank: "20/25",
      appreciation: "Trimestre insuffisant, manque de travail et d'attention en classe.",
      status: "Non commencé",
    },
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

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Imprimer tous
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter tous
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Élève</TableHead>
                  <TableHead>Moyenne générale</TableHead>
                  <TableHead>Rang</TableHead>
                  <TableHead className="hidden md:table-cell">Appréciation générale</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.average}/20</TableCell>
                    <TableCell>{student.rank}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                      {student.appreciation}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          student.status === "Terminé"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : student.status === "En attente"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {student.status}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">Voir le bulletin</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Printer className="h-4 w-4" />
                          <span className="sr-only">Imprimer</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Télécharger</span>
                        </Button>
                      </div>
                    </TableCell>
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
