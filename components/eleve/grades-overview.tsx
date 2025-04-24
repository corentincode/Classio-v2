import { Card, CardContent } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function GradesOverview() {
  // Données fictives pour les moyennes par matière
  const gradesData = [
    {
      subject: "Mathématiques",
      average: 16,
      classAverage: 14,
    },
    {
      subject: "Français",
      average: 14,
      classAverage: 13,
    },
    {
      subject: "Histoire-Géographie",
      average: 12,
      classAverage: 12.5,
    },
    {
      subject: "Sciences",
      average: 18,
      classAverage: 13.5,
    },
    {
      subject: "Anglais",
      average: 15,
      classAverage: 12,
    },
    {
      subject: "Éducation physique",
      average: 17,
      classAverage: 15,
    },
  ]

  // Données fictives pour les notes récentes
  const recentGrades = [
    {
      id: 1,
      subject: "Mathématiques",
      title: "Contrôle sur les fonctions",
      grade: "16/20",
      date: "10/05/2023",
      teacher: "M. Dupont",
    },
    {
      id: 2,
      subject: "Français",
      title: "Commentaire de texte",
      grade: "14/20",
      date: "05/05/2023",
      teacher: "Mme Laurent",
    },
    {
      id: 3,
      subject: "Sciences",
      title: "TP sur les réactions chimiques",
      grade: "18/20",
      date: "25/04/2023",
      teacher: "Mme Dubois",
    },
  ]

  // Calcul de la moyenne générale
  const overallAverage = gradesData.reduce((acc, curr) => acc + curr.average, 0) / gradesData.length
  const overallClassAverage = gradesData.reduce((acc, curr) => acc + curr.classAverage, 0) / gradesData.length

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-medium">Moyenne générale</h3>
              <div className="mt-2 text-4xl font-bold">{overallAverage.toFixed(1)}/20</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Moyenne de classe: {overallClassAverage.toFixed(1)}/20
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium">Notes récentes</h3>
            <div className="mt-2 space-y-2">
              {recentGrades.map((grade) => (
                <div key={grade.id} className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50">
                  <div>
                    <div className="font-medium">{grade.subject}</div>
                    <div className="text-xs text-muted-foreground">{grade.title}</div>
                  </div>
                  <div className="text-lg font-bold">{grade.grade}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="mb-4 text-lg font-medium">Comparaison des moyennes par matière</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={gradesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="subject" className="text-xs" />
                <YAxis domain={[0, 20]} className="text-xs" />
                <Tooltip />
                <Legend />
                <Bar name="Votre moyenne" dataKey="average" fill="hsl(var(--primary))" />
                <Bar name="Moyenne de classe" dataKey="classAverage" fill="hsl(var(--primary) / 0.3)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
