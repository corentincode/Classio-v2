"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

const deadlines = [
  {
    id: 1,
    title: "Fin des inscriptions",
    date: "15 mai 2023",
    time: "23:59",
    priority: "high",
  },
  {
    id: 2,
    title: "Validation des bulletins",
    date: "20 mai 2023",
    time: "18:00",
    priority: "medium",
  },
  {
    id: 3,
    title: "Mise à jour du système",
    date: "25 mai 2023",
    time: "02:00",
    priority: "low",
  },
]

export function UpcomingDeadlines() {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-2 pt-6 px-6">
        <CardTitle className="text-base font-medium">Échéances à venir</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-3">
          {deadlines.map((deadline) => (
            <div key={deadline.id} className="flex items-center gap-3 p-3 rounded-lg border border-dashed">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full flex-shrink-0",
                  deadline.priority === "high"
                    ? "bg-red-50 text-red-500 dark:bg-red-950/20"
                    : deadline.priority === "medium"
                      ? "bg-amber-50 text-amber-500 dark:bg-amber-950/20"
                      : "bg-blue-50 text-blue-500 dark:bg-blue-950/20",
                )}
              >
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium truncate">{deadline.title}</p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1 py-0 h-4 whitespace-nowrap",
                      deadline.priority === "high"
                        ? "bg-red-50 text-red-500 border-red-200 dark:bg-red-950/20 dark:border-red-800"
                        : deadline.priority === "medium"
                          ? "bg-amber-50 text-amber-500 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800"
                          : "bg-blue-50 text-blue-500 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800",
                    )}
                  >
                    {deadline.priority === "high" && "Haute"}
                    {deadline.priority === "medium" && "Moyenne"}
                    {deadline.priority === "low" && "Basse"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {deadline.date} à {deadline.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
