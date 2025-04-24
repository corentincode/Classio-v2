"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

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
]

export function ActivityTimeline() {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
        <CardTitle className="text-base font-medium">Activité récente</CardTitle>
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
          Voir tout <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="relative mt-0.5">
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                  <AvatarFallback className="text-xs">{activity.user.initials}</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 flex h-2 w-2 rounded-full bg-green-500 ring-1 ring-background" />
              </div>
              <div className="grid gap-1 min-w-0">
                <p className="text-sm leading-none">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                  <Badge
                    variant="outline"
                    className={
                      activity.type === "delete"
                        ? "bg-red-500/10 text-red-500 border-red-200 text-[10px] px-1 py-0 h-4"
                        : activity.type === "export"
                          ? "bg-blue-500/10 text-blue-500 border-blue-200 text-[10px] px-1 py-0 h-4"
                          : activity.type === "update"
                            ? "bg-amber-500/10 text-amber-500 border-amber-200 text-[10px] px-1 py-0 h-4"
                            : "bg-green-500/10 text-green-500 border-green-200 text-[10px] px-1 py-0 h-4"
                    }
                  >
                    {activity.type === "create" && "Création"}
                    {activity.type === "update" && "Modification"}
                    {activity.type === "delete" && "Suppression"}
                    {activity.type === "export" && "Export"}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
