import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Données fictives pour la chronologie des notes
const childrenTimelineGrades = [
  {
    id: 1,
    name: "Emma Dupont",
    class: "3ème A",
    periods: [
      {
        name: "Mai 2025",
        grades: [
          { subject: "Mathématiques", title: "Contrôle - Équations", grade: "17/20", date: "10 mai 2025" },
          { subject: "Français", title: "Dissertation", grade: "16/20", date: "5 mai 2025" },
          {
            subject: "Histoire-Géographie",
            title: "Contrôle - Seconde Guerre mondiale",
            grade: "15/20",
            date: "2 mai 2025",
          },
        ],
      },
      {
        name: "Avril 2025",
        grades: [
          { subject: "Mathématiques", title: "Devoir - Géométrie", grade: "15/20", date: "25 avril 2025" },
          { subject: "Français", title: "Dictée", grade: "14/20", date: "20 avril 2025" },
          { subject: "Histoire-Géographie", title: "Exposé - Mondialisation", grade: "14/20", date: "18 avril 2025" },
          { subject: "Mathématiques", title: "Interrogation - Fonctions", grade: "16/20", date: "15 avril 2025" },
          { subject: "Français", title: "Commentaire de texte", grade: "15/20", date: "10 avril 2025" },
          { subject: "Histoire-Géographie", title: "Cartographie", grade: "13/20", date: "5 avril 2025" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Lucas Dupont",
    class: "CM2",
    periods: [
      {
        name: "Mai 2025",
        grades: [
          { subject: "Mathématiques", title: "Contrôle - Fractions", grade: "17/20", date: "5 mai 2025" },
          { subject: "Français", title: "Dictée", grade: "13/20", date: "7 mai 2025" },
          { subject: "Découverte du monde", title: "Exposé - Les planètes", grade: "16/20", date: "3 mai 2025" },
        ],
      },
      {
        name: "Avril 2025",
        grades: [
          { subject: "Français", title: "Rédaction", grade: "15/20", date: "22 avril 2025" },
          { subject: "Mathématiques", title: "Problèmes", grade: "15/20", date: "20 avril 2025" },
          {
            subject: "Découverte du monde",
            title: "Contrôle - Le cycle de l'eau",
            grade: "14/20",
            date: "15 avril 2025",
          },
          { subject: "Français", title: "Grammaire", grade: "14/20", date: "12 avril 2025" },
          { subject: "Mathématiques", title: "Géométrie", grade: "16/20", date: "8 avril 2025" },
          {
            subject: "Découverte du monde",
            title: "Projet - Développement durable",
            grade: "15/20",
            date: "1 avril 2025",
          },
        ],
      },
    ],
  },
]

export function GradesTimeline() {
  return (
    <Tabs defaultValue={childrenTimelineGrades[0].id.toString()} className="w-full">
      <TabsList className="w-full md:w-auto mb-4 grid grid-cols-2 md:flex md:space-x-2">
        {childrenTimelineGrades.map((child) => (
          <TabsTrigger key={child.id} value={child.id.toString()} className="text-sm md:text-base">
            {child.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {childrenTimelineGrades.map((child) => (
        <TabsContent key={child.id} value={child.id.toString()} className="space-y-6">
          {child.periods.map((period, periodIndex) => (
            <div key={periodIndex}>
              <h3 className="text-lg font-semibold mb-3">{period.name}</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {period.grades.map((grade, gradeIndex) => (
                      <div key={gradeIndex} className="flex justify-between items-start py-2 border-b last:border-0">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {grade.subject}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{grade.date}</span>
                          </div>
                          <h4 className="font-medium mt-1">{grade.title}</h4>
                        </div>
                        <Badge className="text-sm">{grade.grade}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </TabsContent>
      ))}
    </Tabs>
  )
}
