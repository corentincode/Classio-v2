"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
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

type Professor = {
  id: string
  email: string
  lastLogin?: string | null
  createdAt: string
}

interface ProfessorsTableProps {
  establishmentId: string
  searchTerm: string
}

export function ProfessorsTable({ establishmentId, searchTerm }: ProfessorsTableProps) {
  const router = useRouter()
  const [professors, setProfessors] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [professorToRemove, setProfessorToRemove] = useState<string | null>(null)
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  // Charger les professeurs
  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/establishments/${establishmentId}/professors`)

        if (!response.ok) {
          throw new Error("Impossible de charger les professeurs")
        }

        const data = await response.json()
        setProfessors(data)
      } catch (error) {
        console.error("Error fetching professors:", error)
        setError("Impossible de charger les professeurs")
      } finally {
        setLoading(false)
      }
    }

    fetchProfessors()
  }, [establishmentId])

  // Filtrer les professeurs en fonction du terme de recherche
  const filteredProfessors = professors.filter((professor) =>
    professor.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Gérer la suppression d'un professeur de l'établissement
  const handleRemoveProfessor = async () => {
    if (!professorToRemove) return

    try {
      setIsRemoving(true)
      const response = await fetch(`/api/establishments/${establishmentId}/professors/${professorToRemove}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Échec de la suppression du professeur de l'établissement")
      }

      // Mettre à jour la liste des professeurs
      setProfessors(professors.filter((professor) => professor.id !== professorToRemove))
      toast({
        title: "Professeur retiré",
        description: "Le professeur a été retiré de l'établissement avec succès.",
      })
    } catch (error) {
      console.error("Error removing professor:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression du professeur.",
        variant: "destructive",
      })
    } finally {
      setProfessorToRemove(null)
      setRemoveDialogOpen(false)
      setIsRemoving(false)
    }
  }

  if (loading) {
    return <div>Chargement des professeurs...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (filteredProfessors.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {searchTerm ? "Aucun professeur ne correspond à votre recherche" : "Aucun professeur trouvé"}
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Dernière connexion</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfessors.map((professor) => (
              <TableRow key={professor.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{professor.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {professor.lastLogin ? new Date(professor.lastLogin).toLocaleDateString() : "Jamais"}
                </TableCell>
                <TableCell>{new Date(professor.createdAt).toLocaleDateString()}</TableCell>
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
                        onClick={() => {
                          setProfessorToRemove(professor.id)
                          setRemoveDialogOpen(true)
                        }}
                      >
                        Retirer de l'établissement
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir retirer ce professeur ?</AlertDialogTitle>
            <AlertDialogDescription>Le professeur ne sera plus associé à cet établissement.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveProfessor}
              className="bg-red-600 hover:bg-red-700"
              disabled={isRemoving}
            >
              {isRemoving ? "Suppression..." : "Retirer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
