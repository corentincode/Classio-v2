import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin } from "lucide-react"

// Données fictives pour les événements
const events = [
  {
    id: 1,
    title: "Réunion parents-professeurs",
    date: "15 mai 2025",
    time: "18:00 - 20:00",
    location: "Salle polyvalente",
    child: "Emma Dupont",
  },
  {
    id: 2,
    title: "Sortie scolaire - Musée",
    date: "22 mai 2025",
    time: "09:00 - 16:00",
    location: "Musée d'Histoire Naturelle",
    child: "Lucas Dupont",
  },
  {
    id: 3,
    title: "Conseil de classe",
    date: "28 mai 2025",
    time: "17:30 - 19:00",
    location: "Salle 103",
    child: "Emma Dupont",
  },
]

export function UpcomingEvents() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Événements à venir</CardTitle>
        <CardDescription>Calendrier des prochains événements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border-b pb-3 last:border-0 last:pb-0">
              <h4 className="font-medium">{event.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">Pour {event.child}</p>
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs">{event.date}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs">{event.time}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs">{event.location}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
