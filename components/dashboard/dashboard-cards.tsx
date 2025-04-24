"use client"

import { Users, School, FileText } from "lucide-react"

export function DashboardCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="rounded-lg p-6 bg-white border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-500 mb-1">Élèves</p>
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl font-bold text-[#9333EA]">8,742</h3>
          <Users className="h-5 w-5 text-[#9333EA]" />
        </div>
        <p className="text-xs mt-2 text-gray-500">Lycée Victor Hugo</p>
        <p className="text-xs text-gray-400">** 4821</p>
      </div>

      <div className="rounded-lg p-6 bg-white border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-500 mb-1">Enseignants</p>
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl font-bold text-[#D97706]">642</h3>
          <School className="h-5 w-5 text-[#D97706]" />
        </div>
        <p className="text-xs mt-2 text-gray-500">Collège Albert Camus</p>
        <p className="text-xs text-gray-400">** 1406</p>
      </div>

      <div className="rounded-lg p-6 bg-white border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-500 mb-1">Documents</p>
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl font-bold text-[#0284C7]">3,074</h3>
          <FileText className="h-5 w-5 text-[#0284C7]" />
        </div>
        <p className="text-xs mt-2 text-gray-500">École Primaire Rousseau</p>
        <p className="text-xs text-gray-400">** 3864</p>
      </div>
    </div>
  )
}
