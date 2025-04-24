"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
  { date: "Lun", Élèves: 4000, Parents: 2400, Enseignants: 1800, Administrateurs: 800 },
  { date: "Mar", Élèves: 3500, Parents: 2100, Enseignants: 1700, Administrateurs: 750 },
  { date: "Mer", Élèves: 4200, Parents: 2800, Enseignants: 2000, Administrateurs: 900 },
  { date: "Jeu", Élèves: 4800, Parents: 3200, Enseignants: 2200, Administrateurs: 950 },
  { date: "Ven", Élèves: 5000, Parents: 3500, Enseignants: 2400, Administrateurs: 1000 },
  { date: "Sam", Élèves: 2500, Parents: 1800, Enseignants: 1200, Administrateurs: 600 },
  { date: "Dim", Élèves: 2000, Parents: 1500, Enseignants: 1000, Administrateurs: 500 },
]

export function PlatformUsage() {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-2 pt-6 px-6">
        <CardTitle className="text-base font-medium">Utilisation de la plateforme</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <Tabs defaultValue="week" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList className="h-8">
              <TabsTrigger value="day" className="text-xs px-3">
                Jour
              </TabsTrigger>
              <TabsTrigger value="week" className="text-xs px-3">
                Semaine
              </TabsTrigger>
              <TabsTrigger value="month" className="text-xs px-3">
                Mois
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-xs">Élèves</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-xs">Parents</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="text-xs">Enseignants</span>
              </div>
            </div>
          </div>

          <TabsContent value="day" className="mt-0 pt-3">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.slice(0, 3)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEleves" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorParents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEnseignants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip />
                <Area type="monotone" dataKey="Élèves" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEleves)" />
                <Area type="monotone" dataKey="Parents" stroke="#22c55e" fillOpacity={1} fill="url(#colorParents)" />
                <Area
                  type="monotone"
                  dataKey="Enseignants"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorEnseignants)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="week" className="mt-0 pt-3">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEleves" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorParents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEnseignants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip />
                <Area type="monotone" dataKey="Élèves" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEleves)" />
                <Area type="monotone" dataKey="Parents" stroke="#22c55e" fillOpacity={1} fill="url(#colorParents)" />
                <Area
                  type="monotone"
                  dataKey="Enseignants"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorEnseignants)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="month" className="mt-0 pt-3">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={[...data, ...data.slice(0, 3)]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEleves" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorParents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEnseignants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip />
                <Area type="monotone" dataKey="Élèves" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEleves)" />
                <Area type="monotone" dataKey="Parents" stroke="#22c55e" fillOpacity={1} fill="url(#colorParents)" />
                <Area
                  type="monotone"
                  dataKey="Enseignants"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorEnseignants)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
