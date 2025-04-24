import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

// Données fictives pour l'assiduité
const childrenAttendance = [
  {
    id: 1,
    name: "Emma Dupont",
    class: "3ème A",
    periods: [
      {
        name: "Mai 2025",
        absences: 2,
        lates: 1,
        justified: 2,
        events: [
          {
            date: "10 mai 2025",
            type: "absence",
            justified: true,
            reason: "Rendez-vous médical",
            duration: "Journée complète",
          },
          {
            date: "7 mai 2025",
            type: "late",
            justified: false,
            reason: "Retard de 15 minutes",
            duration: "15 minutes",
          },
          { date: "3 mai 2025", type: "absence", justified: true, reason: "Maladie", duration: "Journée complète" },
        ],
      },
      {
        name: "Avril 2025",
        absences: 1,
        lates: 2,
        justified: 2,
        events: [
          {
            date: "25 avril 2025",
            type: "late",
            justified: true,
            reason: "Problème de transport",
            duration: "20 minutes",
          },
          {
            date: "18 avril 2025",
            type: "absence",
            justified: true,
            reason: "Rendez-vous orthodontiste",
            duration: "Après-midi",
          },
          { date: "10 avril 2025", type: "late", justified: false, reason: "Non justifié", duration: "10 minutes" },
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
        absences: 1,
        lates: 0,
        justified: 1,
        events: [
          { date: "3 mai 2025", type: "absence", justified: true, reason: "Maladie", duration: "Journée complète" },
        ],
      },
      {
        name: "Avril 2025",
        absences: 1,
        lates: 1,
        justified: 2,
        events: [
          {
            date: "22 avril 2025",
            type: "late",
            justified: true,
            reason: "Rendez-vous médical matinal",
            duration: "30 minutes",
          },
          { date: "15 avril 2025", type: "absence", justified: true, reason: "Maladie", duration: "Journée complète" },
        ],
      },
    ],
  },
]

export function AttendanceDetails() {
  return (
    <Tabs defaultValue={childrenAttendance[0].id.toString()} className="w-full">
      <TabsList className="w-full md:w-auto mb-4 grid grid-cols-2 md:flex md:space-x-2">
        {childrenAttendance.map((child) => (
          <TabsTrigger key={child.id} value={child.id.toString()} className="text-sm md:text-base">
            {child.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {childrenAttendance.map((child) => (
        <TabsContent key={child.id} value={child.id.toString()} className="space-y-6">
          {child.periods.map((period, periodIndex) => (
            <div key={periodIndex}>
              <h3 className="text-lg font-semibold mb-3">{period.name}</h3>
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle>Récapitulatif</CardTitle>
                  <CardDescription>Période: {period.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center">
                      <XCircle className="h-8 w-8 text-destructive mb-2" />
                      <span className="text-xl font-medium">{period.absences}</span>
                      <span className="text-sm text-muted-foreground">Absences</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
                      <span className="text-xl font-medium">{period.lates}</span>
                      <span className="text-sm text-muted-foreground">Retards</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                      <span className="text-xl font-medium">{period.justified}</span>
                      <span className="text-sm text-muted-foreground">Justifiés</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Détails</CardTitle>
                  <CardDescription>Liste des absences et retards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {period.events.map((event, eventIndex) => (
                      <div key={eventIndex} className="flex items-start gap-3 py-2 border-b last:border-0">
                        {event.type === "absence" ? (
                          <XCircle
                            className={`h-5 w-5 mt-0.5 ${event.justified ? "text-amber-500" : "text-destructive"}`}
                          />
                        ) : (
                          <AlertCircle
                            className={`h-5 w-5 mt-0.5 ${event.justified ? "text-amber-500" : "text-amber-500"}`}
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">
                                {event.type === "absence" ? "Absence" : "Retard"}
                                {event.justified && " (justifié)"}
                              </h4>
                              <p className="text-xs text-muted-foreground">{event.date}</p>
                            </div>
                            <span className="text-sm">{event.duration}</span>
                          </div>
                          <p className="text-sm mt-1">{event.reason}</p>
                        </div>
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
