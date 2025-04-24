import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUpRight, Calendar, Plus } from "lucide-react"
import { TimeTable } from "@/components/eleve/time-table"
import { CoursesList } from "@/components/eleve/courses-list"
import { UpcomingAssignments } from "@/components/eleve/upcoming-assignments"
import { RecentGrades } from "@/components/eleve/recent-grades"
import { Announcements } from "@/components/eleve/announcements"

export const metadata: Metadata = {
  title: "Classio - Espace Élève",
  description: "Votre espace personnel sur la plateforme Classio",
}

export default function ElevePage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-full">
      {/* Colonne principale */}
      <div className="flex-1 flex flex-col gap-6">
        {/* En-tête avec moyenne générale */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Moyenne générale</p>
          <div className="flex items-baseline">
            <h1 className="text-4xl font-bold tracking-tight">14.5/20</h1>
            <span className="ml-2 text-sm font-medium text-green-600 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +0.8
            </span>
          </div>
        </div>

        {/* Emploi du temps */}
        <TimeTable />

        {/* Mes cours */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Mes cours</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CoursesList />
        </div>

        {/* Devoirs à venir */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Devoirs à venir</h2>
            <Button variant="outline" size="sm" className="h-8 gap-1 text-gray-500 border-gray-300">
              <Calendar className="h-3.5 w-3.5" />
              <span>Cette semaine</span>
            </Button>
          </div>
          <UpcomingAssignments />
        </div>
      </div>

      {/* Colonne latérale droite */}
      <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
        {/* Annonces */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Annonces</h2>
          <Announcements />
        </div>

        {/* Notes récentes */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Notes récentes</h2>
          <RecentGrades />
        </div>

        {/* Bouton nouveau message */}
        <Button className="w-full gap-2 mt-auto bg-black text-white hover:bg-gray-800">
          <Plus className="h-4 w-4" />
          Nouveau message
        </Button>
      </div>
    </div>
  )
}
