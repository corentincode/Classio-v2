"use client"

export function ComplianceProgress() {
  const complianceItems = [
    {
      id: 1,
      name: "Consentements",
      progress: 85,
      target: 100,
    },
    {
      id: 2,
      name: "Données personnelles",
      progress: 65,
      target: 100,
    },
    {
      id: 3,
      name: "Droit à l'oubli",
      progress: 92,
      target: 100,
    },
    {
      id: 4,
      name: "Sécurité des données",
      progress: 78,
      target: 100,
    },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
      <div className="space-y-4">
        {complianceItems.map((item) => (
          <div key={item.id}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">{item.name}</span>
              <span className="text-xs text-gray-500">{item.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${item.progress}%` }}></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Score global</span>
          <span className="text-sm font-medium">80%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: "80%" }}></div>
        </div>
      </div>
    </div>
  )
}
