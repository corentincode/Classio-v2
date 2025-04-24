"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "< 8", value: 5, color: "hsl(var(--destructive))" },
  { name: "8-10", value: 15, color: "hsl(var(--warning) / 0.7)" },
  { name: "10-12", value: 30, color: "hsl(var(--amber-500))" },
  { name: "12-14", value: 25, color: "hsl(var(--yellow-500))" },
  { name: "14-16", value: 15, color: "hsl(var(--lime-500))" },
  { name: "16-20", value: 10, color: "hsl(var(--green-500))" },
]

export function GradeDistribution() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} élèves`, "Effectif"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
