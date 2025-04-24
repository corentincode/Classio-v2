import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const activities = [
  {
    id: 1,
    user: {
      name: "Jean Dupont",
      avatar: "/placeholder.svg",
      initials: "JD",
    },
    action: "a supprimé un utilisateur",
    target: "Pierre Martin",
    time: "Il y a 2 heures",
    type: "suppression",
  },
  {
    id: 2,
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
    id: 3,
    user: {
      name: "Système",
      avatar: "/placeholder.svg",
      initials: "SY",
    },
    action: "a détecté une tentative d'accès non autorisée",
    target: "IP: 192.168.1.45",
    time: "Il y a 5 heures",
    type: "sécurité",
  },
]

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Activité récente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
              <AvatarFallback>{activity.user.initials}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1 break-words">
                <span className="font-medium">{activity.user.name}</span>
                <span className="text-sm">{activity.action}</span>
                <span className="font-medium">{activity.target}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{activity.time}</span>
                <Badge
                  variant="outline"
                  className={
                    activity.type === "sécurité"
                      ? "bg-destructive/10 text-destructive"
                      : activity.type === "suppression"
                        ? "bg-orange-500/10 text-orange-500"
                        : "bg-blue-500/10 text-blue-500"
                  }
                >
                  {activity.type === "suppression" && "Suppression"}
                  {activity.type === "export" && "Export"}
                  {activity.type === "sécurité" && "Sécurité"}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
