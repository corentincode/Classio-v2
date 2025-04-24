"use client"

export function RecentGrades() {
  // Données fictives pour les notes récentes
  const grades = [
    {
      id: 1,
      subject: "Mathématiques",
      title: "Contrôle sur les fonctions",
      grade: "16/20",
      date: "10/05/2023",
      teacher: "M. Dupont",
      positive: true,
    },
    {
      id: 2,
      subject: "Français",
      title: "Commentaire de texte",
      grade: "14/20",
      date: "05/05/2023",
      teacher: "Mme Laurent",
      positive: true,
    },
    {
      id: 3,
      subject: "Histoire-Géographie",
      title: "Dissertation",
      grade: "12/20",
      date: "28/04/2023",
      teacher: "M. Martin",
      positive: false,
    },
  ]

  return (
    <div className="space-y-4 bg-white rounded-lg border border-gray-100 shadow-sm p-4">
      {grades.map((grade) => (
        <div key={grade.id} className="border-b pb-4 last:border-0 last:pb-0">
          <div className="flex items-center justify-between">
            <div className="font-medium">{grade.subject}</div>
            <div className={`text-lg font-bold ${grade.positive ? "text-green-600" : "text-red-600"}`}>
              {grade.grade}
            </div>
          </div>
          <div className="mt-1 text-sm">{grade.title}</div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <div>{grade.teacher}</div>
            <div>{grade.date}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
