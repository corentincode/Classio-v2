import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Espace Parent | Classio",
  description: "Suivez la scolarité de vos enfants",
}

export default function ParentDashboard() {
  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Contenu à venir */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold">Vue d'ensemble des enfants</h3>
            <p className="text-sm text-muted-foreground mt-2">Informations sur vos enfants à venir</p>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold">Événements à venir</h3>
            <p className="text-sm text-muted-foreground mt-2">Calendrier des événements à venir</p>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold">Notes récentes</h3>
            <p className="text-sm text-muted-foreground mt-2">Dernières notes de vos enfants</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold">Assiduité</h3>
            <p className="text-sm text-muted-foreground mt-2">Suivi des présences et absences</p>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold">Annonces de l'école</h3>
            <p className="text-sm text-muted-foreground mt-2">Communications importantes de l'établissement</p>
          </div>
        </div>
      </div>
    </div>
  )
}
