import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, GraduationCap, User, Mail, Phone, MapPin, BookOpen } from "lucide-react"

// Données fictives pour les enfants
const children = [
  {
    id: 1,
    name: "Emma Dupont",
    age: 14,
    birthdate: "12/05/2011",
    class: "3ème A",
    school: "Collège Victor Hugo",
    avatar: "/placeholder.svg?height=80&width=80",
    status: "En cours",
    teacher: "Mme Martin",
    schedule: [
      { day: "Lundi", hours: "8h30 - 16h30" },
      { day: "Mardi", hours: "8h30 - 16h30" },
      { day: "Mercredi", hours: "8h30 - 12h30" },
      { day: "Jeudi", hours: "8h30 - 16h30" },
      { day: "Vendredi", hours: "8h30 - 16h30" },
    ],
    subjects: [
      "Français",
      "Mathématiques",
      "Histoire-Géographie",
      "Sciences",
      "Anglais",
      "Éducation Physique",
      "Arts Plastiques",
      "Musique",
    ],
    contact: {
      email: "emma.dupont@eleve.classio.fr",
      phone: "Non disponible",
    },
  },
  {
    id: 2,
    name: "Lucas Dupont",
    age: 10,
    birthdate: "23/09/2015",
    class: "CM2",
    school: "École primaire Jean Jaurès",
    avatar: "/placeholder.svg?height=80&width=80",
    status: "En cours",
    teacher: "M. Bernard",
    schedule: [
      { day: "Lundi", hours: "8h30 - 16h30" },
      { day: "Mardi", hours: "8h30 - 16h30" },
      { day: "Mercredi", hours: "8h30 - 11h30" },
      { day: "Jeudi", hours: "8h30 - 16h30" },
      { day: "Vendredi", hours: "8h30 - 16h30" },
    ],
    subjects: ["Français", "Mathématiques", "Découverte du monde", "Anglais", "Sport", "Arts"],
    contact: {
      email: "lucas.dupont@eleve.classio.fr",
      phone: "Non disponible",
    },
  },
]

export function ChildrenDetails() {
  return (
    <Tabs defaultValue={children[0].id.toString()} className="w-full">
      <TabsList className="w-full md:w-auto mb-4 grid grid-cols-2 md:flex md:space-x-2">
        {children.map((child) => (
          <TabsTrigger key={child.id} value={child.id.toString()} className="text-sm md:text-base">
            {child.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {children.map((child) => (
        <TabsContent key={child.id} value={child.id.toString()} className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:items-start gap-2">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={child.avatar || "/placeholder.svg"} alt={child.name} />
                    <AvatarFallback>{child.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">{child.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {child.status}
                  </Badge>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Informations personnelles</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Âge: {child.age} ans</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Date de naissance: {child.birthdate}</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>Email: {child.contact.email}</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>Téléphone: {child.contact.phone}</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Informations scolaires</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span>Classe: {child.class}</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>École: {child.school}</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Professeur principal: {child.teacher}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Emploi du temps</CardTitle>
                <CardDescription>Horaires hebdomadaires</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {child.schedule.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div className="font-medium">{item.day}</div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{item.hours}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Matières</CardTitle>
                <CardDescription>Enseignements suivis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {child.subjects.map((subject, index) => (
                    <div key={index} className="flex items-center gap-2 py-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{subject}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
