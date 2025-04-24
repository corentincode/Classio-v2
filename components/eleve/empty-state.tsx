import { School, Building, UserX, AlertCircle, type LucideIcon, Users, BookOpen, Calendar } from "lucide-react"

type IconType = "school" | "building" | "user" | "alert" | "users" | "books" | "calendar"

interface EmptyStateProps {
  title: string
  description: string
  icon: IconType
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  // Map des icônes disponibles
  const iconMap: Record<IconType, LucideIcon> = {
    school: School,
    building: Building,
    user: UserX,
    alert: AlertCircle,
    users: Users,
    books: BookOpen,
    calendar: Calendar,
  }

  // Récupérer l'icône à partir du type
  const Icon = iconMap[icon]

  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
