"use client"

import { ArrowUpRight, ArrowDownRight } from "lucide-react"

export function SchoolsList() {
  const schools = [
    {
      id: 1,
      name: "Lycée Victor Hugo",
      logo: "VH",
      students: 1250,
      change: 0.8,
      positive: true,
    },
    {
      id: 2,
      name: "Collège Albert Camus",
      logo: "AC",
      students: 842,
      change: 1.2,
      positive: true,
    },
    {
      id: 3,
      name: "École Primaire Rousseau",
      logo: "ER",
      students: 520,
      change: 0.5,
      positive: false,
    },
    {
      id: 4,
      name: "Lycée Professionnel Curie",
      logo: "PC",
      students: 680,
      change: 1.5,
      positive: true,
    },
    {
      id: 5,
      name: "Collège Molière",
      logo: "CM",
      students: 725,
      change: 0.3,
      positive: true,
    },
    {
      id: 6,
      name: "École Maternelle Prévert",
      logo: "MP",
      students: 210,
      change: 0.7,
      positive: false,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {schools.map((school) => (
        <div key={school.id} className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
          <div className="flex justify-center mb-3">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-medium">
              {school.logo}
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium truncate">{school.name}</p>
            <p className="text-xs text-gray-500 mt-1">{school.students} élèves</p>
            <div className="flex items-center justify-center mt-2">
              <span
                className={`text-xs font-medium flex items-center ${school.positive ? "text-green-600" : "text-red-600"}`}
              >
                {school.positive ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {school.change}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
