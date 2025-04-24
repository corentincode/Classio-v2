"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Plus, Users, BookOpen } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { AddClassForm } from "@/components/admin/add-class-form"
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

interface ClassesListProps {
  establishmentId: string
}

export function ClassesList({ establishmentId }: ClassesListProps) {
  const router = useRouter()
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [addClassDialogOpen, setAddClassDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [classToDelete, setClassToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Charger les classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/establishments/${establishmentId}/classes`)

        if (!response.ok) {
          throw new Error("Impossible de charger les classes")
        }

        const data = await response.json()
        setClasses(data)
      } catch (error) {
        console.error("Error fetching classes:", error)
        setError("Impossible de charger les classes")
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [establishmentId])

  // Filtrer les classes en fonction du terme de recherche
  const filteredClasses = classes.filter(
    (classItem) =>
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (classItem.section && classItem.section.toLowerCase().includes(searchTerm.toLowerCase())) ||
      classItem.schoolYear.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Gérer la suppression d'une classe
  const handleDeleteClass = async () => {
    if (!classToDelete) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/establishments/${establishmentId}/classes/${classToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Échec de la suppression de la classe")
      }

      // Mettre à jour la liste des classes
      setClasses(classes.filter((c) => c.id !== classToDelete))
      toast({
        title: "Classe supprimée",
        description: "La classe a été supprimée avec succès.",
      })
    } catch (error) {
      console.error("Error deleting class:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression de la classe.",
        variant: "destructive",
      })
    } finally {
      setClassToDelete(null)
      setDeleteDialogOpen(false)
      setIsDeleting(false)
    }
  }

  // Gérer la navigation vers la page de détails d'une classe
  const handleViewClass = (classId: string) => {
    router.push(`/admin/classes/${classId}`)
  }

  // Gérer la navigation vers la page de modification d'une classe
  const handleEditClass = (classId: string) => {
    router.push(`/admin/classes/${classId}/edit`)
  }

  // Gérer la navigation vers la page des étudiants d'une classe
  const handleManageStudents = (classId: string) => {
    router.push(`/admin/classes/${classId}/students`)
  }

  // Gérer la navigation vers la page des cours d'une classe
  const handleManageCourses = (classId: string) => {
    router.push(`/admin/classes/${classId}/courses`)
  }

  if (loading) {
    return <div>Chargement des classes...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Rechercher une classe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-full max-w-full sm:w-[250px] lg:w-[300px]"
          />
        </div>
        <Button onClick={() => setAddClassDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une classe
        </Button>
      </div>

      {filteredClasses.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            {searchTerm ? "Aucune classe ne correspond à votre recherche" : "Aucune classe trouvée"}
          </div>
          {!searchTerm && (
            <Button onClick={() => setAddClassDialogOpen(true)} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Créer votre première classe
            </Button>
          )}
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Année scolaire</TableHead>
                <TableHead>Élèves</TableHead>
                <TableHead>Cours</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell className="font-medium">{classItem.name}</TableCell>
                  <TableCell>
                    {classItem.level}
                    {classItem.section && <span> - {classItem.section}</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{classItem.schoolYear}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{classItem._count.students}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{classItem._count.courses}</span>
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
                        <DropdownMenuItem onClick={() => handleViewClass(classItem.id)}>
                          Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClass(classItem.id)}>Modifier</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManageStudents(classItem.id)}>
                          Gérer les élèves
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManageCourses(classItem.id)}>
                          Gérer les cours
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setClassToDelete(classItem.id)
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

      {/* Formulaire d'ajout de classe */}
      <AddClassForm
        establishmentId={establishmentId}
        open={addClassDialogOpen}
        onOpenChange={setAddClassDialogOpen}
        onClassAdded={(newClass) => setClasses([...classes, newClass])}
      />

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette classe ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Tous les élèves et cours associés à cette classe seront dissociés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClass}
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
