import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CoursesGrid } from "@/components/eleve/courses-grid"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export const metadata: Metadata = {
  title: "Classio - Mes cours",
  description: "Accédez à tous vos cours et ressources pédagogiques",
}

export default function CoursPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Mes cours</h1>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Rechercher un cours..." className="pl-8" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tous mes cours</CardTitle>
          <CardDescription>Accédez à vos cours et ressources pédagogiques</CardDescription>
        </CardHeader>
        <CardContent>
          <CoursesGrid />
        </CardContent>
      </Card>
    </div>
  )
}
