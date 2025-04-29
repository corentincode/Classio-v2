"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Clock, BookOpen, Search } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

type Establishment = {
  id: string
  name: string
}

type Class = {
  id: string
  name: string
  level: string
  section: string | null
}

type Course = {
  id: string
  name: string
  description: string | null
  color: string | null
  class: Class
  establishment: Establishment
  sessionsCount: number
  studentsCount: number
}

interface ProfesseurCoursesListProps {
  userId: string
}

export function ProfesseurCoursesList({ userId }: ProfesseurCoursesListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const establishmentId = searchParams.get("establishmentId")

  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEstablishment, setSelectedEstablishment] = useState<string>(establishmentId || "all")

  // Récupérer les cours enseignés par le professeur
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const url = establishmentId
          ? `/api/professors/${userId}/courses?establishmentId=${establishmentId}`
          : `/api/professors/${userId}/courses`

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error("Impossible de charger les cours")
        }

        const data = await response.json()
        setCourses(data)
      } catch (error) {
        console.error("Error fetching courses:", error)
        setError("Impossible de charger les cours")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [userId, establishmentId])

  // Obtenir la liste des établissements
  const establishments = courses.reduce((acc: Establishment[], course) => {
    if (!acc.some((e) => e.id === course.establishment.id)) {
      acc.push(course.establishment)
    }
    return acc
  }, [])

  // Filtrer les cours en fonction du terme de recherche et de l'établissement sélectionné
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.class.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesEstablishment = selectedEstablishment === "all" || course.establishment.id === selectedEstablishment

    return matchesSearch && matchesEstablishment
  })

  if (loading) {
    return <div>Chargement des cours...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un cours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        {establishments.length > 1 && (
          <Tabs
            defaultValue={selectedEstablishment}
            value={selectedEstablishment}
            onValueChange={setSelectedEstablishment}
          >
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              {establishments.map((establishment) => (
                <TabsTrigger key={establishment.id} value={establishment.id}>
                  {establishment.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>

      {filteredCourses.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            {searchTerm ? "Aucun cours ne correspond à votre recherche" : "Vous n'avez aucun cours"}
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              href={`/professeur/courses/${course.id}?establishmentId=${establishmentId || course.establishment.id}`}
              className="block"
            >
              <Card className="h-full hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{course.establishment.name}</Badge>
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: course.color || "#cbd5e1" }} />
                  </div>
                  <CardTitle className="mt-2">{course.name}</CardTitle>
                  <CardDescription>Classe: {course.class.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2 text-sm">
                    <div className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{course.description || "Aucune description"}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{course.studentsCount} élèves</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{course.sessionsCount} sessions</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
