import { Card, CardContent } from "@/components/ui/card"
import { Users, School, FileText, ShieldAlert } from "lucide-react"

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Utilisateurs</p>
              <h3 className="text-base sm:text-xl font-bold">12,486</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
              <School className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Établissements</p>
              <h3 className="text-base sm:text-xl font-bold">342</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Documents</p>
              <h3 className="text-base sm:text-xl font-bold">28,459</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-destructive/10 flex-shrink-0">
              <ShieldAlert className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Alertes</p>
              <h3 className="text-base sm:text-xl font-bold">7</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
