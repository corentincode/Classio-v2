import type { Metadata } from "next"
import { AuditLogTable } from "@/components/dashboard/audit-log-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/dashboard/date-range-picker"
import { AuditFilters } from "@/components/dashboard/audit-filters"

export const metadata: Metadata = {
  title: "Classio - Journal d'audit",
  description: "Journal d'audit et traçabilité des actions",
}

export default function AuditPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Journal d'audit</h1>
        <DateRangePicker />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des actions</CardTitle>
          <CardDescription>Traçabilité des actions sur la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AuditFilters />
          </div>
          <AuditLogTable />
        </CardContent>
      </Card>
    </div>
  )
}
