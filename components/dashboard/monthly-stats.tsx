"use client"

export function MonthlyStats() {
  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
      <div className="flex items-center justify-center">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="10"
              strokeDasharray="251.2"
              strokeDashoffset="50.24"
              transform="rotate(-90 50 50)"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#10b981"
              strokeWidth="10"
              strokeDasharray="251.2"
              strokeDashoffset="175.84"
              transform="rotate(-90 50 50)"
              strokeLinecap="round"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="10"
              strokeDasharray="251.2"
              strokeDashoffset="213.52"
              transform="rotate(-90 50 50)"
              strokeLinecap="round"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#ef4444"
              strokeWidth="10"
              strokeDasharray="251.2"
              strokeDashoffset="238.64"
              transform="rotate(-90 50 50)"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold">1,492</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-xs">Élèves (45%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-xs">Enseignants (30%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
          <span className="text-xs">Parents (15%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span className="text-xs">Administration (10%)</span>
        </div>
      </div>
    </div>
  )
}
