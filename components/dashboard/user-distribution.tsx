"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"

const data = [
  { name: "Élèves", value: 8500, color: "#3b82f6" },
  { name: "Parents", value: 6200, color: "#22c55e" },
  { name: "Enseignants", value: 1200, color: "#f59e0b" },
  { name: "Administrateurs", value: 350, color: "#ef4444" },
]

export function UserDistribution() {
  return (
    <Card className="border-none shadow-md h-full">
      <CardHeader className="pb-2 pt-6 px-6">
        <CardTitle className="text-base font-medium">Distribution des utilisateurs</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 flex items-center justify-center h-[calc(100%-60px)]">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} utilisateurs`, "Nombre"]}
              contentStyle={{ borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", border: "none" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
