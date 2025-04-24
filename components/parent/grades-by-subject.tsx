import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Données fictives pour les notes par matière
const childrenSubjectGrades = [
  {
    id: 1,
    name: "Emma Dupont",
    class: "3ème A",
    subjects: [
      {
        name: "Mathématiques",
        average: "16/20",
        grades: [
          { title: "Contrôle - Équations", grade: "17/20", date: "10 mai 2025", comment: "Excellent travail" },
          {
            title: "Devoir - Géométrie",
            grade: "15/20",
            date: "25 avril 2025",
            comment: "Bon travail, quelques erreurs de calcul",
          },
          {
            title: "Interrogation - Fonctions",
            grade: "16/20",
            date: "15 avril 2025",
            comment: "Très bonne compréhension",
          },
        ],
      },
      {
        name: "Français",
        average: "15/20",
        grades: [
          { title: "Dissertation", grade: "16/20", date: "5 mai 2025", comment: "Excellente analyse" },
          { title: "Dictée", grade: "14/20", date: "20 avril 2025", comment: "Quelques erreurs d'accord" },
          {
            title: "Commentaire de texte",
            grade: "15/20",
            date: "10 avril 2025",
            comment: "Bonne analyse, manque de références",
          },
        ],
      },
      {
        name: "Histoire-Géographie",
        average: "14/20",
        grades: [
          {
            title: "Contrôle - Seconde Guerre mondiale",
            grade: "15/20",
            date: "2 mai 2025",
            comment: "Bonne analyse des documents",
          },
          {
            title: "Exposé - Mondialisation",
            grade: "14/20",
            date: "18 avril 2025",
            comment: "Présentation claire, manque d'exemples",
          },
          {
            title: "Cartographie",
            grade: "13/20",
            date: "5 avril 2025",
            comment: "Carte bien réalisée, légende incomplète",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Lucas Dupont",
    class: "CM2",
    subjects: [
      {
        name: "Français",
        average: "14/20",
        grades: [
          { title: "Dictée", grade: "13/20", date: "7 mai 2025", comment: "Quelques erreurs d'orthographe" },
          { title: "Rédaction", grade: "15/20", date: "22 avril 2025", comment: "Histoire imaginative et bien écrite" },
          { title: "Grammaire", grade: "14/20", date: "12 avril 2025", comment: "Bonne compréhension des règles" },
        ],
      },
      {
        name: "Mathématiques",
        average: "16/20",
        grades: [
          { title: "Contrôle - Fractions", grade: "17/20", date: "5 mai 2025", comment: "Excellent travail" },
          { title: "Problèmes", grade: "15/20", date: "20 avril 2025", comment: "Bonne méthode de résolution" },
          { title: "Géométrie", grade: "16/20", date: "8 avril 2025", comment: "Figures bien construites" },
        ],
      },
      {
        name: "Découverte du monde",
        average: "15/20",
        grades: [
          {
            title: "Exposé - Les planètes",
            grade: "16/20",
            date: "3 mai 2025",
            comment: "Présentation claire et complète",
          },
          {
            title: "Contrôle - Le cycle de l'eau",
            grade: "14/20",
            date: "15 avril 2025",
            comment: "Bonne compréhension du sujet",
          },
          {
            title: "Projet - Développement durable",
            grade: "15/20",
            date: "1 avril 2025",
            comment: "Projet bien réalisé",
          },
        ],
      },
    ],
  },
]

export function GradesBySubject() {
  return (
    <Tabs defaultValue={childrenSubjectGrades[0].id.toString()} className="w-full">
      <TabsList className="w-full md:w-auto mb-4 grid grid-cols-2 md:flex md:space-x-2">
        {childrenSubjectGrades.map((child) => (
          <TabsTrigger key={child.id} value={child.id.toString()} className="text-sm md:text-base">
            {child.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {childrenSubjectGrades.map((child) => (
        <TabsContent key={child.id} value={child.id.toString()} className="space-y-4">
          <Tabs defaultValue={child.subjects[0].name} className="w-full">
            <TabsList className="w-full mb-4 grid grid-cols-3 md:grid-cols-6 gap-2">
              {child.subjects.map((subject) => (
                <TabsTrigger key={subject.name} value={subject.name} className="text-xs md:text-sm">
                  {subject.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {child.subjects.map((subject) => (
              <TabsContent key={subject.name} value={subject.name} className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>{subject.name}</CardTitle>
                    <CardDescription>Moyenne: {subject.average}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {subject.grades.map((grade, index) => (
                        <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{grade.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{grade.date}</p>
                            </div>
                            <Badge className="text-sm">{grade.grade}</Badge>
                          </div>
                          <p className="text-sm mt-2">{grade.comment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
      ))}
    </Tabs>
  )
}
