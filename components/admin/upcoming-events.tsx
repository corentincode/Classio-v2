import { CalendarIcon } from "lucide-react"

type Event = {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: "meeting" | "event" | "deadline" | "other"
}

const events: Event[] = [
  {
    id: "1",
    title: "Conseil de classe",
    description: "Terminale S - Premier trimestre",
    date: "15 décembre 2023",
    time: "17:00 - 19:00",
    type: "meeting",
  },
  {
    id: "2",
    title: "Réunion parents-professeurs",
    description: "Classes de 6ème",
    date: "18 décembre 2023",
    time: "16:30 - 20:00",
    type: "meeting",
  },
  {
    id: "3",
    title: "Remise des bulletins",
    description: "Toutes les classes",
    date: "22 décembre 2023",
    time: "Toute la journée",
    type: "event",
  },
  {
    id: "4",
    title: "Vacances de Noël",
    description: "Fermeture de l'établissement",
    date: "23 décembre 2023",
    time: "Après les cours",
    type: "other",
  },
  {
    id: "5",
    title: "Rentrée scolaire",
    description: "Reprise des cours",
    date: "8 janvier 2024",
    time: "8:00",
    type: "other",
  },
]

export function UpcomingEvents() {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="flex items-start gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{event.title}</p>
            <p className="text-xs text-muted-foreground">{event.description}</p>
            <p className="text-xs font-medium">
              {event.date} • {event.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
