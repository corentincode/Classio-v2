import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Info, AlertTriangle } from "lucide-react"

// Données fictives pour les annonces
const announcements = [
  {
    id: 1,
    title: "Fermeture exceptionnelle",
    date: "12 mai 2025",
    content: "L'établissement sera fermé le vendredi 16 mai pour cause de journée pédagogique.",
    type: "important",
  },
  {
    id: 2,
    title: "Réunion d'information orientation",
    date: "8 mai 2025",
    content: "Une réunion d'information sur l'orientation post-3ème aura lieu le 25 mai à 18h00.",
    type: "info",
  },
  {
    id: 3,
    title: "Rappel - Photos de classe",
    date: "5 mai 2025",
    content: "Les photos de classe auront lieu le lundi 19 mai. Tenue correcte exigée.",
    type: "reminder",
  },
]

export function SchoolAnnouncements() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Annonces de l'école</CardTitle>
        <CardDescription>Communications importantes de l'établissement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="border-b pb-3 last:border-0 last:pb-0">
              <div className="flex items-start gap-2">
                {announcement.type === "important" ? (
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                ) : announcement.type === "info" ? (
                  <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                ) : (
                  <CalendarDays className="h-5 w-5 text-amber-500 mt-0.5" />
                )}
                <div>
                  <h4 className="font-medium">{announcement.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{announcement.date}</p>
                  <p className="text-sm mt-2">{announcement.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
