import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

// Données fictives pour le calendrier d'assiduité
const childrenCalendar = [
  {
    id: 1,
    name: "Emma Dupont",
    class: "3ème A",
    months: [
      {
        name: "Mai 2025",
        days: [
          { date: "1", status: "present" },
          { date: "2", status: "present" },
          { date: "3", status: "absent", justified: true, reason: "Maladie" },
          { date: "4", status: "weekend" },
          { date: "5", status: "present" },
          { date: "6", status: "present" },
          { date: "7", status: "late", justified: false, reason: "Retard de 15 minutes" },
          { date: "8", status: "holiday", reason: "Jour férié" },
          { date: "9", status: "present" },
          { date: "10", status: "absent", justified: true, reason: "Rendez-vous médical" },
          { date: "11", status: "weekend" },
          { date: "12", status: "present" },
          { date: "13", status: "present" },
          { date: "14", status: "present" },
          { date: "15", status: "present" },
        ],
      },
      {
        name: "Avril 2025",
        days: [
          { date: "1", status: "present" },
          { date: "2", status: "present" },
          { date: "3", status: "present" },
          { date: "4", status: "present" },
          { date: "5", status: "weekend" },
          { date: "6", status: "weekend" },
          { date: "7", status: "present" },
          { date: "8", status: "present" },
          { date: "9", status: "present" },
          { date: "10", status: "late", justified: false, reason: "Non justifié" },
          { date: "11", status: "present" },
          { date: "12", status: "weekend" },
          { date: "13", status: "weekend" },
          { date: "14", status: "present" },
          { date: "15", status: "present" },
          { date: "16", status: "present" },
          { date: "17", status: "present" },
          { date: "18", status: "absent", justified: true, reason: "Rendez-vous orthodontiste" },
          { date: "19", status: "weekend" },
          { date: "20", status: "weekend" },
          { date: "21", status: "present" },
          { date: "22", status: "present" },
          { date: "23", status: "present" },
          { date: "24", status: "present" },
          { date: "25", status: "late", justified: true, reason: "Problème de transport" },
          { date: "26", status: "weekend" },
          { date: "27", status: "weekend" },
          { date: "28", status: "present" },
          { date: "29", status: "present" },
          { date: "30", status: "present" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Lucas Dupont",
    class: "CM2",
    months: [
      {
        name: "Mai 2025",
        days: [
          { date: "1", status: "present" },
          { date: "2", status: "present" },
          { date: "3", status: "absent", justified: true, reason: "Maladie" },
          { date: "4", status: "weekend" },
          { date: "5", status: "present" },
          { date: "6", status: "present" },
          { date: "7", status: "present" },
          { date: "8", status: "holiday", reason: "Jour férié" },
          { date: "9", status: "present" },
          { date: "10", status: "present" },
          { date: "11", status: "weekend" },
          { date: "12", status: "present" },
          { date: "13", status: "present" },
          { date: "14", status: "present" },
          { date: "15", status: "present" },
        ],
      },
      {
        name: "Avril 2025",
        days: [
          { date: "1", status: "present" },
          { date: "2", status: "present" },
          { date: "3", status: "present" },
          { date: "4", status: "present" },
          { date: "5", status: "weekend" },
          { date: "6", status: "weekend" },
          { date: "7", status: "present" },
          { date: "8", status: "present" },
          { date: "9", status: "present" },
          { date: "10", status: "present" },
          { date: "11", status: "present" },
          { date: "12", status: "weekend" },
          { date: "13", status: "weekend" },
          { date: "14", status: "present" },
          { date: "15", status: "absent", justified: true, reason: "Maladie" },
          { date: "16", status: "present" },
          { date: "17", status: "present" },
          { date: "18", status: "present" },
          { date: "19", status: "weekend" },
          { date: "20", status: "weekend" },
          { date: "21", status: "present" },
          { date: "22", status: "late", justified: true, reason: "Rendez-vous médical matinal" },
          { date: "23", status: "present" },
          { date: "24", status: "present" },
          { date: "25", status: "present" },
          { date: "26", status: "weekend" },
          { date: "27", status: "weekend" },
          { date: "28", status: "present" },
          { date: "29", status: "present" },
          { date: "30", status: "present" },
        ],
      },
    ],
  },
]

export function AttendanceCalendar() {
  return (
    <Tabs defaultValue={childrenCalendar[0].id.toString()} className="w-full">
      <TabsList className="w-full md:w-auto mb-4 grid grid-cols-2 md:flex md:space-x-2">
        {childrenCalendar.map((child) => (
          <TabsTrigger key={child.id} value={child.id.toString()} className="text-sm md:text-base">
            {child.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {childrenCalendar.map((child) => (
        <TabsContent key={child.id} value={child.id.toString()} className="space-y-6">
          {child.months.map((month, monthIndex) => (
            <Card key={monthIndex}>
              <CardHeader className="pb-2">
                <CardTitle>{month.name}</CardTitle>
                <CardDescription>Calendrier d'assiduité</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      <span className="text-xs">Présent</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-red-500"></div>
                      <span className="text-xs">Absent</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                      <span className="text-xs">Retard</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                      <span className="text-xs">Weekend/Férié</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {month.days.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`
                        p-2 rounded-md text-center relative
                        ${day.status === "present" ? "bg-green-100" : ""}
                        ${day.status === "absent" ? "bg-red-100" : ""}
                        ${day.status === "late" ? "bg-amber-100" : ""}
                        ${day.status === "weekend" || day.status === "holiday" ? "bg-gray-100" : ""}
                      `}
                      title={day.reason || day.status}
                    >
                      <div className="text-sm font-medium">{day.date}</div>
                      <div className="mt-1">
                        {day.status === "present" && <CheckCircle className="h-4 w-4 mx-auto text-green-500" />}
                        {day.status === "absent" && <XCircle className="h-4 w-4 mx-auto text-red-500" />}
                        {day.status === "late" && <AlertCircle className="h-4 w-4 mx-auto text-amber-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      ))}
    </Tabs>
  )
}
