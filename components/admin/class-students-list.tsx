"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Plus, User, ArrowLeft } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { AddStudentToClassForm } from "@/components/admin/add-student-to-class-form"
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
import Link from "next/link"

type StudentEnrollment = {
  id: string
  studentId: string
  classId: string
  enrollmentDate: string
  status: string
  student: {
    id: string
    email: string
    lastLogin: string | null
    createdAt: string
  }
}

interface ClassStudentsListProps {
  classId: string
  establishmentId: string
}

export function ClassStudentsList({ classId, establishmentId }: ClassStudentsListProps) {
  const [students, setStudents] = useState<StudentEnrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false)
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [studentToRemove, setStudentToRemove] = useState<string | null>(null)
  const [isRemoving, setIsRemoving] = useState(false)

  // Charger les élèves
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/establishments/${establishmentId}/classes/${classId}/students`)

        if (!response.ok) {
          throw new Error("Impossible de charger les élèves")
        }

        const data = await response.json()
        setStudents(data)
      } catch (error) {
        console.error("Error fetching students:", error)
        setError("Impossible de charger les élèves")
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [classId, establishmentId])

  // Filtrer les élèves en fonction du terme de recherche
  const filteredStudents = students.filter((enrollment) =>
    enrollment.student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Gérer la suppression d'un élève de la classe
  const handleRemoveStudent = async () => {
    if (!studentToRemove) return

    try {
      setIsRemoving(true)
      const response = await fetch(
        `/api/establishments/${establishmentId}/classes/${classId}/students/${studentToRemove}`,
        {
          method: "DELETE",
        },
      )

      if (!response.ok) {
        throw new Error("Échec de la suppression de l'élève de la classe")
      }

      // Mettre à jour la liste des élèves
      setStudents(students.filter((enrollment) => enrollment.student.id !== studentToRemove))
      toast({
        title: "Élève retiré",
        description: "L'élève a été retiré de la classe avec succès.",
      })
    } catch (error) {
      console.error("Error removing student:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression de l'élève de la classe.",
        variant: "destructive",
      })
    } finally {
      setStudentToRemove(null)
      setRemoveDialogOpen(false)
      setIsRemoving(false)
    }
  }

  if (loading) {
    return <div>Chargement des élèves...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Link href={`/admin/classes/${classId}`}>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-xl font-semibold">Gestion des élèves</h2>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Rechercher un élève..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-full max-w-full sm:w-[250px] lg:w-[300px]"
          />
        </div>
        <Button onClick={() => setAddStudentDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un élève
        </Button>
      </div>

      {filteredStudents.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            {searchTerm ? "Aucun élève ne correspond à votre recherche" : "Aucun élève inscrit dans cette classe"}
          </div>
          {!searchTerm && (
            <Button onClick={() => setAddStudentDialogOpen(true)} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter votre premier élève
            </Button>
          )}
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{enrollment.student.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{enrollment.status}</TableCell>
                  <TableCell>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {enrollment.student.lastLogin
                      ? new Date(enrollment.student.lastLogin).toLocaleDateString()
                      : "Jamais"}
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
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setStudentToRemove(enrollment.student.id)
                            setRemoveDialogOpen(true)
                          }}
                        >
                          Retirer de la classe
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

      {/* Formulaire d'ajout d'élève */}
      <AddStudentToClassForm
        classId={classId}
        establishmentId={establishmentId}
        open={addStudentDialogOpen}
        onOpenChange={setAddStudentDialogOpen}
        onStudentAdded={(newEnrollment) => setStudents([...students, newEnrollment])}
      />

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir retirer cet élève de la classe ?</AlertDialogTitle>
            <AlertDialogDescription>
              L'élève sera retiré de cette classe mais restera dans l'établissement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveStudent}
              className="bg-red-600 hover:bg-red-700"
              disabled={isRemoving}
            >
              {isRemoving ? "Suppression..." : "Retirer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
