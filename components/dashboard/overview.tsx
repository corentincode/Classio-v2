"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "1 Avr",
    Connexions: 400,
    "Nouveaux utilisateurs": 24,
  },
  {
    name: "8 Avr",
    Connexions: 300,
    "Nouveaux utilisateurs": 13,
  },
  {
    name: "15 Avr",
    Connexions: 520,
    "Nouveaux utilisateurs": 39,
  },
  {
    name: "22 Avr",
    Connexions: 480,
    "Nouveaux utilisateurs": 43,
  },
  {
    name: "29 Avr",
    Connexions: 390,
    "Nouveaux utilisateurs": 20,
  },
  {
    name: "6 Mai",
    Connexions: 600,
    "Nouveaux utilisateurs": 36,
  },
  {
    name: "13 Mai",
    Connexions: 540,
    "Nouveaux utilisateurs": 28,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" className="text-xs" stroke="#888888" tickLine={false} axisLine={false} />
        <YAxis
          className="text-xs"
          stroke="#888888"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="Connexions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} className="fill-primary" />
        <Bar
          dataKey="Nouveaux utilisateurs"
          fill="hsl(var(--primary) / 0.3)"
          radius={[4, 4, 0, 0]}
          className="fill-primary/30"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
