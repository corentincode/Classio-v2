import type { Metadata } from "next"
import { ChildrenDetails } from "@/components/parent/children-details"

export const metadata: Metadata = {
  title: "Mes Enfants | Espace Parent",
  description: "Détails sur vos enfants",
}

export default function ChildrenPage() {
  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Mes Enfants</h2>
        </div>

        <div className="grid gap-4">
          <ChildrenDetails />
        </div>
      </div>
    </div>
  )
}
