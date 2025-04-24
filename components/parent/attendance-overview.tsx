import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

// Données fictives pour l'assiduité
const attendanceData = [
  {
    id: 1,
    child: "Emma Dupont",
    absences: 2,
    lates: 1,
    justified: 2,
    period: "Mai 2025",
  },
  {
    id: 2,
    child: "Lucas Dupont",
    absences: 1,
    lates: 0,
    justified: 1,
    period: "Mai 2025",
  },
]

// Données récentes
const recentAttendance = [
  {
    id: 1,
    date: "10 mai 2025",
    child: "Emma Dupont",
    status: "absent",
    justified: true,
    reason: "Rendez-vous médical",
  },
  {
    id: 2,
    date: "7 mai 2025",
    child: "Emma Dupont",
    status: "late",
    justified: false,
    reason: "Retard de 15 minutes",
  },
  {
    id: 3,
    date: "3 mai 2025",
    child: "Lucas Dupont",
    status: "absent",
    justified: true,
    reason: "Maladie",
  },
]

export function AttendanceOverview() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Assiduité</CardTitle>
        <CardDescription>Suivi des présences et absences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {attendanceData.map((data) => (
            <div key={data.id} className="border-b pb-3 last:border-0 last:pb-0">
              <h4 className="font-medium">{data.child}</h4>
              <p className="text-xs text-muted-foreground mt-1">Période: {data.period}</p>

              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="flex flex-col items-center">
                  <XCircle className="h-5 w-5 text-destructive mb-1" />
                  <span className="text-sm font-medium">{data.absences}</span>
                  <span className="text-xs text-muted-foreground">Absences</span>
                </div>
                <div className="flex flex-col items-center">
                  <AlertCircle className="h-5 w-5 text-amber-500 mb-1" />
                  <span className="text-sm font-medium">{data.lates}</span>
                  <span className="text-xs text-muted-foreground">Retards</span>
                </div>
                <div className="flex flex-col items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mb-1" />
                  <span className="text-sm font-medium">{data.justified}</span>
                  <span className="text-xs text-muted-foreground">Justifiés</span>
                </div>
              </div>
            </div>
          ))}

          <h4 className="font-medium pt-2">Événements récents</h4>
          <div className="space-y-2">
            {recentAttendance.map((item) => (
              <div key={item.id} className="flex items-start gap-2 text-sm">
                {item.status === "absent" ? (
                  <XCircle className={`h-4 w-4 mt-0.5 ${item.justified ? "text-amber-500" : "text-destructive"}`} />
                ) : (
                  <AlertCircle className={`h-4 w-4 mt-0.5 ${item.justified ? "text-amber-500" : "text-amber-500"}`} />
                )}
                <div>
                  <p className="text-sm">
                    {item.child} - {item.status === "absent" ? "Absence" : "Retard"}
                    {item.justified && " (justifié)"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.date} - {item.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
