import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Données fictives pour les notes
const grades = [
  {
    id: 1,
    subject: "Mathématiques",
    grade: "16/20",
    date: "10 mai 2025",
    child: "Emma Dupont",
    comment: "Excellent travail",
  },
  {
    id: 2,
    subject: "Français",
    grade: "14/20",
    date: "8 mai 2025",
    child: "Lucas Dupont",
    comment: "Bon devoir",
  },
  {
    id: 3,
    subject: "Histoire",
    grade: "15/20",
    date: "5 mai 2025",
    child: "Emma Dupont",
    comment: "Très bonne analyse",
  },
]

export function RecentGrades() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Notes récentes</CardTitle>
        <CardDescription>Dernières évaluations de vos enfants</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {grades.map((grade) => (
            <div key={grade.id} className="border-b pb-3 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{grade.subject}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{grade.child}</p>
                </div>
                <Badge className="text-sm">{grade.grade}</Badge>
              </div>
              <p className="text-xs mt-2">{grade.comment}</p>
              <p className="text-xs text-muted-foreground mt-1">{grade.date}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
