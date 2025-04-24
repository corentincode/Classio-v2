import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUpRight, Calendar, Plus } from "lucide-react"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"
import { SchoolsList } from "@/components/dashboard/schools-list"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { MonthlyStats } from "@/components/dashboard/monthly-stats"
import { ComplianceProgress } from "@/components/dashboard/compliance-progress"
import { QuickTasks } from "@/components/dashboard/quick-tasks"

export const metadata: Metadata = {
  title: "Classio - Tableau de bord",
  description: "Vue d'ensemble de la plateforme Classio",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-full">
      {/* Colonne principale */}
      <div className="flex-1 flex flex-col gap-6">
        {/* En-tête avec solde total */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Utilisateurs actifs</p>
          <div className="flex items-baseline">
            <h1 className="text-4xl font-bold tracking-tight">12,458</h1>
            <span className="ml-2 text-sm font-medium text-green-600 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +8.2%
            </span>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <DashboardCards />

        {/* Mes établissements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Mes établissements</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <SchoolsList />
        </div>

        {/* Statistiques mensuelles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Statistiques mensuelles</h2>
              <Button variant="outline" size="sm" className="h-8 gap-1 text-gray-500 border-gray-300">
                <Calendar className="h-3.5 w-3.5" />
                <span>Avril</span>
              </Button>
            </div>
            <MonthlyStats />
          </div>

          {/* Conformité RGPD */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Conformité RGPD</h2>
              <Button variant="ghost" size="sm" className="h-8 text-gray-500">
                Explorer
              </Button>
            </div>
            <ComplianceProgress />
          </div>
        </div>
      </div>

      {/* Colonne latérale droite */}
      <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
        {/* Activités récentes */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Activités récentes</h2>
          <RecentActivities />
        </div>

        {/* Tâches rapides */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Tâches rapides</h2>
          <QuickTasks />
        </div>

        {/* Bouton nouvelle tâche */}
        <Button className="w-full gap-2 mt-auto bg-black text-white hover:bg-gray-800">
          <Plus className="h-4 w-4" />
          Nouvelle tâche
        </Button>
      </div>
    </div>
  )
}
