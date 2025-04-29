"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, BookOpen, Search } from "lucide-react"

interface Course {
  id: string
  name: string
  color: string
}

interface ClassItem {
  id: string
  name: string
  level: string
  section: string | null
  schoolYear: string
  studentCount: number
  courses: Course[]
}

interface ProfesseurClassesListProps {
  classes: ClassItem[]
  establishmentId: string
}

export function ProfesseurClassesList({ classes, establishmentId }: ProfesseurClassesListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filtrer les classes en fonction de la recherche
  const filteredClasses = classes.filter((classItem) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      classItem.name.toLowerCase().includes(searchLower) ||
      classItem.level.toLowerCase().includes(searchLower) ||
      (classItem.section && classItem.section.toLowerCase().includes(searchLower)) ||
      classItem.courses.some((course) => course.name.toLowerCase().includes(searchLower))
    )
  })

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Rechercher une classe..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredClasses.length === 0 ? (
        <div className="text-center py-10">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune classe trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? "Aucune classe ne correspond à votre recherche."
              : "Vous n'enseignez dans aucune classe pour le moment."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((classItem) => (
            <Card key={classItem.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>{classItem.name}</CardTitle>
                <CardDescription>
                  {classItem.level}
                  {classItem.section && ` - ${classItem.section}`} • {classItem.schoolYear}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-2 mb-4">
                  {classItem.courses.map((course) => (
                    <Badge key={course.id} style={{ backgroundColor: course.color || "#3b82f6", color: "white" }}>
                      {course.name}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    {classItem.studentCount} élève{classItem.studentCount !== 1 ? "s" : ""}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="mr-1 h-4 w-4" />
                    {classItem.courses.length} cours
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/professeur/classes/${classItem.id}?establishmentId=${establishmentId}`}>
                    Voir les détails
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
