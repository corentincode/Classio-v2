"use client"

export function QuickTasks() {
  const tasks = [
    {
      id: 1,
      name: "Valider les inscriptions",
      progress: 32,
      target: 100,
    },
    {
      id: 2,
      name: "Vérifier les absences",
      progress: 78,
      target: 100,
    },
    {
      id: 3,
      name: "Mettre à jour les emplois du temps",
      progress: 54,
      target: 100,
    },
    {
      id: 4,
      name: "Répondre aux messages",
      progress: 22,
      target: 100,
    },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">{task.name}</span>
              <span className="text-xs text-gray-500">{task.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  task.progress < 30 ? "bg-red-500" : task.progress < 70 ? "bg-amber-500" : "bg-green-500"
                }`}
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
