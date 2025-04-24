"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Plus, ArrowLeft, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { AddCourseForm } from "@/components/admin/add-course-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Class = {
  id: string
  name: string
  level: string
  section: string | null
  schoolYear: string
  description: string | null
  maxStudents: number | null
  _count: {
    students: number
    courses: number
  }
}

type Professor = {
  id: string
  email: string
}

type Course = {
  id: string
  name: string
  description: string | null
  color: string | null
  professor: Professor
  _count: {
    sessions: number
  }
}

interface ClassCoursesListProps {
  classData: Class
  establishmentId: string
}

export function ClassCoursesList({ classData, establishmentId }: ClassCoursesListProps) {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [addCourseDialogOpen, setAddCourseDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Charger les cours
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/establishments/${establishmentId}/classes/${classData.id}/courses`)

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
  }, [establishmentId, classData.id])

  // Filtrer les cours en fonction du terme de recherche
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      course.professor.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Gérer la suppression d'un cours
  const handleDeleteCourse = async () => {
    if (!courseToDelete) return

    try {
      setIsDeleting(true)
      const response = await fetch(
        `/api/establishments/${establishmentId}/classes/${classData.id}/courses/${courseToDelete}`,
        {
          method: "DELETE",
        },
      )

      if (!response.ok) {
        throw new Error("Échec de la suppression du cours")
      }

      // Mettre à jour la liste des cours
      setCourses(courses.filter((c) => c.id !== courseToDelete))
      toast({
        title: "Cours supprimé",
        description: "Le cours a été supprimé avec succès.",
      })
    } catch (error) {
      console.error("Error deleting course:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression du cours.",
        variant: "destructive",
      })
    } finally {
      setCourseToDelete(null)
      setDeleteDialogOpen(false)
      setIsDeleting(false)
    }
  }

  // Gérer la navigation vers la page des sessions d'un cours
  const handleManageSessions = (courseId: string) => {
    router.push(`/admin/classes/${classData.id}/courses/${courseId}/sessions`)
  }

  // Gérer la navigation vers la page de modification d'un cours
  const handleEditCourse = (courseId: string) => {
    router.push(`/admin/classes/${classData.id}/courses/${courseId}/edit`)
  }

  if (loading) {
    return <div>Chargement des cours...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push(`/admin/classes/${classData.id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la classe
        </Button>
        <h1 className="text-2xl font-bold">Cours de {classData.name}</h1>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Rechercher un cours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-full max-w-full sm:w-[250px] lg:w-[300px]"
          />
        </div>
        <Button onClick={() => setAddCourseDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un cours
        </Button>
      </div>

      {filteredCourses.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            {searchTerm ? "Aucun cours ne correspond à votre recherche" : "Aucun cours trouvé"}
          </div>
          {!searchTerm && (
            <Button onClick={() => setAddCourseDialogOpen(true)} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Créer votre premier cours
            </Button>
          )}
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Professeur</TableHead>
                <TableHead>Sessions</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: course.color || "#cbd5e1" }} />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>
                      {course.name}
                      {course.description && <p className="text-xs text-muted-foreground">{course.description}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.professor.email}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{course._count.sessions}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditCourse(course.id)}>Modifier</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManageSessions(course.id)}>
                          Gérer les sessions
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setCourseToDelete(course.id)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Formulaire d'ajout de cours */}
      <AddCourseForm
        establishmentId={establishmentId}
        classId={classData.id}
        open={addCourseDialogOpen}
        onOpenChange={setAddCourseDialogOpen}
        onCourseAdded={(newCourse) => setCourses([...courses, newCourse])}
      />

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce cours ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les sessions associées à ce cours seront également supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCourse}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
