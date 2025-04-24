"use client"
import Link from "next/link"

export function CoursesList() {
  // Données fictives pour les cours
  const courses = [
    {
      id: 1,
      subject: "Mathématiques",
      teacher: "M. Dupont",
      progress: 65,
      lastActivity: "Devoir rendu il y a 2 jours",
      color: "#3b82f6",
    },
    {
      id: 2,
      subject: "Français",
      teacher: "Mme Laurent",
      progress: 80,
      lastActivity: "Cours consulté hier",
      color: "#ef4444",
    },
    {
      id: 3,
      subject: "Histoire-Géographie",
      teacher: "M. Martin",
      progress: 45,
      lastActivity: "Quiz complété il y a 3 jours",
      color: "#10b981",
    },
    {
      id: 4,
      subject: "Sciences",
      teacher: "Mme Dubois",
      progress: 70,
      lastActivity: "Nouveau document ajouté aujourd'hui",
      color: "#8b5cf6",
    },
    {
      id: 5,
      subject: "Anglais",
      teacher: "M. Johnson",
      progress: 60,
      lastActivity: "Devoir à rendre dans 3 jours",
      color: "#f59e0b",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {courses.map((course) => (
        <Link href={`/eleve/cours/${course.id}`} key={course.id} className="block">
          <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm h-full flex flex-col">
            <div className="flex justify-center mb-3">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: course.color }}
              >
                {course.subject.charAt(0)}
              </div>
            </div>
            <div className="text-center mb-3">
              <p className="text-sm font-medium">{course.subject}</p>
              <p className="text-xs text-gray-500 mt-1">{course.teacher}</p>
            </div>
            <div className="mt-auto">
              <div className="flex justify-between items-center text-xs mb-1">
                <span>Progression</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${course.progress}%`, backgroundColor: course.color }}
                ></div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
