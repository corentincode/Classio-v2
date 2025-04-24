"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function GradesBySubject() {
  const [selectedSubject, setSelectedSubject] = useState("math")

  // Données fictives pour les matières
  const subjects = [
    { id: "math", name: "Mathématiques" },
    { id: "french", name: "Français" },
    { id: "history", name: "Histoire-Géographie" },
    { id: "science", name: "Sciences" },
    { id: "english", name: "Anglais" },
    { id: "pe", name: "Éducation physique" },
  ]

  // Données fictives pour les notes par matière
  const gradesBySubject = {
    math: {
      average: 16,
      classAverage: 14,
      grades: [
        {
          id: 1,
          title: "Contrôle sur les fonctions",
          grade: 16,
          coefficient: 2,
          date: "10/05/2023",
          type: "Contrôle",
          comment: "Très bon travail, continuez ainsi !",
        },
        {
          id: 2,
          title: "Devoir maison sur les équations",
          grade: 18,
          coefficient: 1,
          date: "28/04/2023",
          type: "Devoir maison",
          comment: "Excellent travail, très rigoureux.",
        },
        {
          id: 3,
          title: "Interrogation sur les dérivées",
          grade: 14,
          coefficient: 1,
          date: "15/04/2023",
          type: "Interrogation",
          comment: "Quelques erreurs de calcul, mais bonne compréhension.",
        },
      ],
    },
    french: {
      average: 14,
      classAverage: 13,
      grades: [
        {
          id: 1,
          title: "Commentaire de texte",
          grade: 14,
          coefficient: 2,
          date: "05/05/2023",
          type: "Devoir sur table",
          comment: "Bonne analyse, mais attention aux fautes d'orthographe.",
        },
        {
          id: 2,
          title: "Exposé sur Molière",
          grade: 16,
          coefficient: 1,
          date: "20/04/2023",
          type: "Oral",
          comment: "Très bonne présentation, bien documentée.",
        },
        {
          id: 3,
          title: "Dictée",
          grade: 12,
          coefficient: 1,
          date: "10/04/2023",
          type: "Dictée",
          comment: "Trop de fautes d'orthographe, à revoir.",
        },
      ],
    },
    history: {
      average: 12,
      classAverage: 12.5,
      grades: [
        {
          id: 1,
          title: "Dissertation",
          grade: 12,
          coefficient: 2,
          date: "28/04/2023",
          type: "Devoir sur table",
          comment: "Des idées intéressantes, mais manque de structure.",
        },
        {
          id: 2,
          title: "Exposé sur la Guerre Froide",
          grade: 14,
          coefficient: 1,
          date: "15/04/2023",
          type: "Oral",
          comment: "Bonne présentation, bien documentée.",
        },
        {
          id: 3,
          title: "Quiz sur la Seconde Guerre mondiale",
          grade: 10,
          coefficient: 1,
          date: "05/04/2023",
          type: "Quiz",
          comment: "Des lacunes importantes, à revoir.",
        },
      ],
    },
    science: {
      average: 18,
      classAverage: 13.5,
      grades: [
        {
          id: 1,
          title: "TP sur les réactions chimiques",
          grade: 18,
          coefficient: 2,
          date: "25/04/2023",
          type: "TP",
          comment: "Excellent travail, très précis et méthodique.",
        },
        {
          id: 2,
          title: "Contrôle sur les forces",
          grade: 19,
          coefficient: 2,
          date: "15/04/2023",
          type: "Contrôle",
          comment: "Excellent travail, félicitations !",
        },
        {
          id: 3,
          title: "Exposé sur les énergies renouvelables",
          grade: 17,
          coefficient: 1,
          date: "05/04/2023",
          type: "Oral",
          comment: "Très bonne présentation, bien documentée.",
        },
      ],
    },
    english: {
      average: 15,
      classAverage: 12,
      grades: [
        {
          id: 1,
          title: "Compréhension écrite",
          grade: 15,
          coefficient: 1,
          date: "20/04/2023",
          type: "Devoir sur table",
          comment: "Good work, but some vocabulary mistakes.",
        },
        {
          id: 2,
          title: "Expression orale",
          grade: 16,
          coefficient: 1,
          date: "10/04/2023",
          type: "Oral",
          comment: "Very good presentation, nice accent.",
        },
        {
          id: 3,
          title: "Compréhension orale",
          grade: 14,
          coefficient: 1,
          date: "01/04/2023",
          type: "Écoute",
          comment: "Good understanding, but some details missed.",
        },
      ],
    },
    pe: {
      average: 17,
      classAverage: 15,
      grades: [
        {
          id: 1,
          title: "Évaluation endurance",
          grade: 17,
          coefficient: 1,
          date: "25/04/2023",
          type: "Pratique",
          comment: "Très bonne performance, bonne gestion de l'effort.",
        },
        {
          id: 2,
          title: "Évaluation gymnastique",
          grade: 16,
          coefficient: 1,
          date: "15/04/2023",
          type: "Pratique",
          comment: "Bonne exécution des figures imposées.",
        },
        {
          id: 3,
          title: "Évaluation sports collectifs",
          grade: 18,
          coefficient: 1,
          date: "05/04/2023",
          type: "Pratique",
          comment: "Excellent esprit d'équipe et bonnes performances.",
        },
      ],
    },
  }

  const currentSubject = gradesBySubject[selectedSubject as keyof typeof gradesBySubject]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Sélectionnez une matière</h3>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sélectionner une matière" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium">
              {subjects.find((s) => s.id === selectedSubject)?.name} - Moyenne: {currentSubject.average}/20
            </h3>
            <div className="text-sm text-muted-foreground">Moyenne de classe: {currentSubject.classAverage}/20</div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Votre moyenne</span>
              <span className="text-sm font-medium">{currentSubject.average}/20</span>
            </div>
            <Progress value={(currentSubject.average / 20) * 100} className="h-2" />
          </div>

          <div className="mt-6">
            <h4 className="mb-2 font-medium">Détail des notes</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Coefficient</TableHead>
                  <TableHead className="text-right">Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSubject.grades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell>{grade.date}</TableCell>
                    <TableCell>
                      <div className="font-medium">{grade.title}</div>
                      <div className="text-xs text-muted-foreground">{grade.comment}</div>
                    </TableCell>
                    <TableCell>{grade.type}</TableCell>
                    <TableCell>{grade.coefficient}</TableCell>
                    <TableCell className="text-right font-bold">{grade.grade}/20</TableCell>
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
