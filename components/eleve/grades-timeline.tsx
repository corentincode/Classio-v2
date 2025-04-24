"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export function GradesTimeline() {
  const [selectedPeriod, setSelectedPeriod] = useState("all")

  // Données fictives pour les notes dans le temps
  const grades = [
    {
      id: 1,
      subject: "Mathématiques",
      title: "Contrôle sur les fonctions",
      grade: 16,
      date: "2023-05-10",
      teacher: "M. Dupont",
      period: "trimester3",
    },
    {
      id: 2,
      subject: "Français",
      title: "Commentaire de texte",
      grade: 14,
      date: "2023-05-05",
      teacher: "Mme Laurent",
      period: "trimester3",
    },
    {
      id: 3,
      subject: "Histoire-Géographie",
      title: "Dissertation",
      grade: 12,
      date: "2023-04-28",
      teacher: "M. Martin",
      period: "trimester3",
    },
    {
      id: 4,
      subject: "Sciences",
      title: "TP sur les réactions chimiques",
      grade: 18,
      date: "2023-04-25",
      teacher: "Mme Dubois",
      period: "trimester3",
    },
    {
      id: 5,
      subject: "Anglais",
      title: "Compréhension écrite",
      grade: 15,
      date: "2023-04-20",
      teacher: "M. Johnson",
      period: "trimester3",
    },
    {
      id: 6,
      subject: "Mathématiques",
      title: "Devoir maison sur les équations",
      grade: 18,
      date: "2023-04-15",
      teacher: "M. Dupont",
      period: "trimester3",
    },
    {
      id: 7,
      subject: "Français",
      title: "Exposé sur Molière",
      grade: 16,
      date: "2023-03-20",
      teacher: "Mme Laurent",
      period: "trimester2",
    },
    {
      id: 8,
      subject: "Histoire-Géographie",
      title: "Exposé sur la Guerre Froide",
      grade: 14,
      date: "2023-03-15",
      teacher: "M. Martin",
      period: "trimester2",
    },
    {
      id: 9,
      subject: "Sciences",
      title: "Contrôle sur les forces",
      grade: 19,
      date: "2023-03-10",
      teacher: "Mme Dubois",
      period: "trimester2",
    },
    {
      id: 10,
      subject: "Mathématiques",
      title: "Contrôle sur les suites",
      grade: 15,
      date: "2023-02-15",
      teacher: "M. Dupont",
      period: "trimester2",
    },
    {
      id: 11,
      subject: "Français",
      title: "Dictée",
      grade: 12,
      date: "2023-01-20",
      teacher: "Mme Laurent",
      period: "trimester1",
    },
    {
      id: 12,
      subject: "Histoire-Géographie",
      title: "Quiz sur la Seconde Guerre mondiale",
      grade: 10,
      date: "2023-01-15",
      teacher: "M. Martin",
      period: "trimester1",
    },
    {
      id: 13,
      subject: "Sciences",
      title: "Exposé sur les énergies renouvelables",
      grade: 17,
      date: "2023-01-10",
      teacher: "Mme Dubois",
      period: "trimester1",
    },
    {
      id: 14,
      subject: "Mathématiques",
      title: "Contrôle sur les limites",
      grade: 14,
      date: "2022-12-15",
      teacher: "M. Dupont",
      period: "trimester1",
    },
  ]

  // Filtrer les notes en fonction de la période sélectionnée
  const filteredGrades = selectedPeriod === "all" ? grades : grades.filter((grade) => grade.period === selectedPeriod)

  // Trier les notes par date (les plus récentes en premier)
  const sortedGrades = [...filteredGrades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Grouper les notes par mois
  const groupedGrades = sortedGrades.reduce(
    (acc, grade) => {
      const date = new Date(grade.date)
      const month = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })

      if (!acc[month]) {
        acc[month] = []
      }

      acc[month].push(grade)
      return acc
    },
    {} as Record<string, typeof grades>,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Chronologie des notes</h3>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sélectionner une période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les périodes</SelectItem>
            <SelectItem value="trimester1">1er trimestre</SelectItem>
            <SelectItem value="trimester2">2ème trimestre</SelectItem>
            <SelectItem value="trimester3">3ème trimestre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedGrades).map(([month, monthGrades]) => (
          <div key={month}>
            <h4 className="mb-4 text-lg font-medium capitalize">{month}</h4>
            <div className="space-y-4">
              {monthGrades.map((grade) => (
                <Card key={grade.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          className="capitalize"
                          variant="outline"
                          style={{
                            backgroundColor: getSubjectColor(grade.subject),
                            color: "white",
                          }}
                        >
                          {grade.subject}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {new Date(grade.date).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                      <div className="text-2xl font-bold">{grade.grade}/20</div>
                    </div>
                    <h3 className="mt-2 font-medium">{grade.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{grade.teacher}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Fonction pour attribuer une couleur à chaque matière
function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    Mathématiques: "hsl(221.2 83.2% 53.3%)",
    Français: "hsl(0 84.2% 60.2%)",
    "Histoire-Géographie": "hsl(142.1 76.2% 36.3%)",
    Sciences: "hsl(262.1 83.3% 57.8%)",
    Anglais: "hsl(47.9 95.8% 53.1%)",
    "Éducation physique": "hsl(20.5 90.2% 48.2%)",
  }

  return colors[subject] || "hsl(221.2 83.2% 53.3%)"
}
