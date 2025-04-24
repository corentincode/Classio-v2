import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Données fictives pour les notes
const childrenGrades = [
  {
    id: 1,
    name: "Emma Dupont",
    class: "3ème A",
    average: "14.5/20",
    classAverage: "13.2/20",
    subjects: [
      { name: "Mathématiques", average: "16/20", classAverage: "13.5/20", trend: "up" },
      { name: "Français", average: "15/20", classAverage: "14/20", trend: "stable" },
      { name: "Histoire-Géographie", average: "14/20", classAverage: "13/20", trend: "up" },
      { name: "Sciences", average: "15.5/20", classAverage: "12.5/20", trend: "up" },
      { name: "Anglais", average: "13/20", classAverage: "13.5/20", trend: "down" },
      { name: "Éducation Physique", average: "16/20", classAverage: "14/20", trend: "up" },
    ],
  },
  {
    id: 2,
    name: "Lucas Dupont",
    class: "CM2",
    average: "15/20",
    classAverage: "14/20",
    subjects: [
      { name: "Français", average: "14/20", classAverage: "13/20", trend: "up" },
      { name: "Mathématiques", average: "16/20", classAverage: "14/20", trend: "up" },
      { name: "Découverte du monde", average: "15/20", classAverage: "14.5/20", trend: "stable" },
      { name: "Anglais", average: "13/20", classAverage: "12/20", trend: "up" },
      { name: "Sport", average: "17/20", classAverage: "15/20", trend: "up" },
      { name: "Arts", average: "16/20", classAverage: "15/20", trend: "stable" },
    ],
  },
]

export function GradesOverview() {
  return (
    <Tabs defaultValue={childrenGrades[0].id.toString()} className="w-full">
      <TabsList className="w-full md:w-auto mb-4 grid grid-cols-2 md:flex md:space-x-2">
        {childrenGrades.map((child) => (
          <TabsTrigger key={child.id} value={child.id.toString()} className="text-sm md:text-base">
            {child.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {childrenGrades.map((child) => (
        <TabsContent key={child.id} value={child.id.toString()} className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>
                {child.name} - {child.class}
              </CardTitle>
              <CardDescription>
                Moyenne générale: {child.average} (Classe: {child.classAverage})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {child.subjects.map((subject, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div className="font-medium">{subject.name}</div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">Classe: {subject.classAverage}</div>
                      <Badge
                        className={
                          subject.trend === "up"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : subject.trend === "down"
                              ? "bg-red-100 text-red-800 hover:bg-red-100"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                        }
                      >
                        {subject.average}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}
