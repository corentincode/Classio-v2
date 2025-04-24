"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: 1,
    user: {
      name: "Thomas Dubois",
      avatar: "/placeholder.svg",
      initials: "TD",
    },
    action: "a créé un nouvel établissement",
    target: "Lycée Victor Hugo",
    time: "Il y a 10 minutes",
    type: "create",
  },
  {
    id: 2,
    user: {
      name: "Marie Laurent",
      avatar: "/placeholder.svg",
      initials: "ML",
    },
    action: "a modifié les permissions",
    target: "Groupe Administrateurs",
    time: "Il y a 45 minutes",
    type: "update",
  },
  {
    id: 3,
    user: {
      name: "Jean Dupont",
      avatar: "/placeholder.svg",
      initials: "JD",
    },
    action: "a supprimé un utilisateur",
    target: "Pierre Martin",
    time: "Il y a 2 heures",
    type: "delete",
  },
  {
    id: 4,
    user: {
      name: "Sophie Moreau",
      avatar: "/placeholder.svg",
      initials: "SM",
    },
    action: "a exporté des données",
    target: "Collège Albert Camus",
    time: "Il y a 3 heures",
    type: "export",
  },
  {
    id: 5,
    user: {
      name: "Système",
      avatar: "/placeholder.svg",
      initials: "SY",
    },
    action: "a détecté une tentative d'accès non autorisée",
    target: "IP: 192.168.1.45",
    time: "Il y a 5 heures",
    type: "security",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">
              <span className="font-semibold">{activity.user.name}</span> {activity.action}{" "}
              <span className="font-semibold">{activity.target}</span>
            </p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">{activity.time}</p>
              <Badge
                variant="outline"
                className={
                  activity.type === "security"
                    ? "bg-destructive/10 text-destructive"
                    : activity.type === "delete"
                      ? "bg-orange-500/10 text-orange-500"
                      : activity.type === "export"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-primary/10 text-primary"
                }
              >
                {activity.type === "create" && "Création"}
                {activity.type === "update" && "Modification"}
                {activity.type === "delete" && "Suppression"}
                {activity.type === "export" && "Export"}
                {activity.type === "security" && "Sécurité"}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
