"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

export function RecentActivities() {
  const activities = [
    {
      id: 1,
      user: {
        name: "Lycée Victor Hugo",
        avatar: "/placeholder.svg",
        initials: "VH",
      },
      action: "Nouvel élève inscrit",
      date: "17 Avr",
      amount: "+1",
      positive: true,
    },
    {
      id: 2,
      user: {
        name: "Collège Albert Camus",
        avatar: "/placeholder.svg",
        initials: "AC",
      },
      action: "Document ajouté",
      date: "12 Avr",
      amount: "+3",
      positive: true,
    },
    {
      id: 3,
      user: {
        name: "Mme Dubois",
        avatar: "/placeholder.svg",
        initials: "MD",
      },
      action: "Absence signalée",
      date: "21 Avr",
      amount: "-1",
      positive: false,
    },
    {
      id: 4,
      user: {
        name: "M. Martin",
        avatar: "/placeholder.svg",
        initials: "MM",
      },
      action: "Note ajoutée",
      date: "18 Avr",
      amount: "+25",
      positive: true,
    },
    {
      id: 5,
      user: {
        name: "École Rousseau",
        avatar: "/placeholder.svg",
        initials: "ER",
      },
      action: "Événement créé",
      date: "21 Avr",
      amount: "+1",
      positive: true,
    },
  ]

  return (
    <div className="space-y-4 bg-white rounded-lg border border-gray-100 shadow-sm p-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-gray-200">
              <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
              <AvatarFallback>{activity.user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{activity.action}</p>
              <p className="text-xs text-gray-500">{activity.date}</p>
            </div>
          </div>
          <span
            className={`text-sm font-medium flex items-center ${activity.positive ? "text-green-600" : "text-red-600"}`}
          >
            {activity.positive ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {activity.amount}
          </span>
        </div>
      ))}
    </div>
  )
}
