import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Espace Professeur | Classio",
  description: "Gérez vos cours et vos élèves",
}

export default function ProfesseurDashboard() {
  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Mes classes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Liste des classes que vous enseignez</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Emploi du temps</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Votre emploi du temps pour la semaine</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Devoirs à corriger</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Devoirs en attente de correction</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Prochains cours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Vos prochains cours à venir</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Annonces</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Dernières annonces de l'établissement</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
