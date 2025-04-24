import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Activity = {
  id: string
  user: {
    name: string
    avatar?: string
    initials: string
  }
  action: string
  target: string
  date: string
}

const activities: Activity[] = [
  {
    id: "1",
    user: {
      name: "Marie Dupont",
      initials: "MD",
    },
    action: "a ajouté",
    target: "un nouvel élève en classe de 3ème B",
    date: "Il y a 30 minutes",
  },
  {
    id: "2",
    user: {
      name: "Thomas Martin",
      initials: "TM",
    },
    action: "a modifié",
    target: "l'emploi du temps de la classe de Terminale S",
    date: "Il y a 2 heures",
  },
  {
    id: "3",
    user: {
      name: "Sophie Bernard",
      initials: "SB",
    },
    action: "a publié",
    target: "les notes du contrôle de mathématiques",
    date: "Il y a 3 heures",
  },
  {
    id: "4",
    user: {
      name: "Philippe Dubois",
      initials: "PD",
    },
    action: "a signalé",
    target: "une absence pour 3 élèves",
    date: "Il y a 5 heures",
  },
  {
    id: "5",
    user: {
      name: "Isabelle Moreau",
      initials: "IM",
    },
    action: "a envoyé",
    target: "un message aux parents d'élèves",
    date: "Hier à 16:45",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              <span className="font-semibold">{activity.user.name}</span> {activity.action}{" "}
              <span className="text-muted-foreground">{activity.target}</span>
            </p>
            <p className="text-xs text-muted-foreground">{activity.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
