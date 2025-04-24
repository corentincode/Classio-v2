"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const attendanceByClass = [
  { name: "6ème A", présence: 95, absence: 5 },
  { name: "6ème B", présence: 93, absence: 7 },
  { name: "5ème A", présence: 91, absence: 9 },
  { name: "5ème B", présence: 94, absence: 6 },
  { name: "4ème A", présence: 89, absence: 11 },
  { name: "4ème B", présence: 92, absence: 8 },
  { name: "3ème A", présence: 88, absence: 12 },
  { name: "3ème B", présence: 90, absence: 10 },
]

const attendanceByMonth = [
  { name: "Sept", présence: 96, absence: 4 },
  { name: "Oct", présence: 94, absence: 6 },
  { name: "Nov", présence: 92, absence: 8 },
  { name: "Déc", présence: 90, absence: 10 },
  { name: "Jan", présence: 88, absence: 12 },
  { name: "Fév", présence: 91, absence: 9 },
  { name: "Mars", présence: 93, absence: 7 },
  { name: "Avr", présence: 92, absence: 8 },
]

const absenceReasons = [
  { name: "Maladie", value: 65 },
  { name: "Rendez-vous médical", value: 15 },
  { name: "Raison familiale", value: 10 },
  { name: "Transport", value: 5 },
  { name: "Autre", value: 5 },
]

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--primary) / 0.8)",
  "hsl(var(--primary) / 0.6)",
  "hsl(var(--primary) / 0.4)",
  "hsl(var(--primary) / 0.2)",
]

export function AttendanceStats() {
  const [period, setPeriod] = useState("trimestre1")
  const [activeIndex, setActiveIndex] = useState(0)

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props

    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="hsl(var(--foreground))">
          {payload.name}
        </text>
        <text x={cx} y={cy} textAnchor="middle" fill="hsl(var(--foreground))">
          {`${value} absences`}
        </text>
        <text x={cx} y={cy} dy={20} textAnchor="middle" fill="hsl(var(--muted-foreground))">
          {`(${(percent * 100).toFixed(0)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="classes" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="classes">Par classe</TabsTrigger>
              <TabsTrigger value="time">Évolution</TabsTrigger>
              <TabsTrigger value="reasons">Motifs</TabsTrigger>
            </TabsList>

            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trimestre1">1er trimestre</SelectItem>
                <SelectItem value="trimestre2">2ème trimestre</SelectItem>
                <SelectItem value="trimestre3">3ème trimestre</SelectItem>
                <SelectItem value="annee">Année complète</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="classes" className="mt-0">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceByClass} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="présence" stackId="a" fill="hsl(var(--primary))" />
                  <Bar dataKey="absence" stackId="a" fill="hsl(var(--destructive))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="time" className="mt-0">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceByMonth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="présence"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="absence" stroke="hsl(var(--destructive))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="reasons" className="mt-0">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={absenceReasons}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  >
                    {absenceReasons.map((entry, index) => (
                      <Sector key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
