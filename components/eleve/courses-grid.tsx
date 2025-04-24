import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FileText, Video, MessageSquare } from "lucide-react"
import Link from "next/link"

export function CoursesGrid() {
  // Données fictives pour les cours
  const courses = [
    {
      id: 1,
      subject: "Mathématiques",
      teacher: "M. Dupont",
      progress: 65,
      resources: { documents: 12, videos: 5, forums: 2 },
      lastActivity: "Devoir rendu il y a 2 jours",
      color: "bg-blue-500",
    },
    {
      id: 2,
      subject: "Français",
      teacher: "Mme Laurent",
      progress: 80,
      resources: { documents: 8, videos: 3, forums: 1 },
      lastActivity: "Cours consulté hier",
      color: "bg-red-500",
    },
    {
      id: 3,
      subject: "Histoire-Géographie",
      teacher: "M. Martin",
      progress: 45,
      resources: { documents: 15, videos: 7, forums: 3 },
      lastActivity: "Quiz complété il y a 3 jours",
      color: "bg-green-500",
    },
    {
      id: 4,
      subject: "Sciences",
      teacher: "Mme Dubois",
      progress: 70,
      resources: { documents: 10, videos: 8, forums: 2 },
      lastActivity: "Nouveau document ajouté aujourd'hui",
      color: "bg-purple-500",
    },
    {
      id: 5,
      subject: "Anglais",
      teacher: "M. Johnson",
      progress: 60,
      resources: { documents: 7, videos: 4, forums: 1 },
      lastActivity: "Devoir à rendre dans 3 jours",
      color: "bg-yellow-500",
    },
    {
      id: 6,
      subject: "Éducation physique",
      teacher: "M. Bernard",
      progress: 90,
      resources: { documents: 3, videos: 2, forums: 1 },
      lastActivity: "Évaluation prévue la semaine prochaine",
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <div key={course.id} className="rounded-md border overflow-hidden">
          <div className={`h-2 w-full ${course.color}`} />
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{course.subject}</h3>
              <Badge variant="outline">{course.progress}%</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{course.teacher}</p>

            <div className="mt-4 h-2 w-full rounded-full bg-muted">
              <div className={`h-2 rounded-full ${course.color}`} style={{ width: `${course.progress}%` }} />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>{course.resources.documents}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Video className="h-3 w-3" />
                  <span>{course.resources.videos}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{course.resources.forums}</span>
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">{course.lastActivity}</p>

            <div className="mt-4 flex items-center gap-2">
              <Button asChild className="flex-1">
                <Link href={`/eleve/cours/${course.id}`}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Accéder au cours
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
