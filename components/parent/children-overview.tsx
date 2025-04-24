import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Données fictives pour les enfants
const children = [
  {
    id: 1,
    name: "Emma Dupont",
    class: "3ème A",
    school: "Collège Victor Hugo",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "En cours",
  },
  {
    id: 2,
    name: "Lucas Dupont",
    class: "CM2",
    school: "École primaire Jean Jaurès",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "En cours",
  },
]

export function ChildrenOverview() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Mes enfants</CardTitle>
        <CardDescription>Vue d'ensemble de vos enfants</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {children.map((child) => (
            <div key={child.id} className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={child.avatar || "/placeholder.svg"} alt={child.name} />
                <AvatarFallback>{child.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{child.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {child.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{child.class}</p>
                <p className="text-xs text-muted-foreground">{child.school}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
