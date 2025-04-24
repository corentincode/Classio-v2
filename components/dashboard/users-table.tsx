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

type User = {
  id: string
  email: string
  role: string
  lastLogin?: string | null
  createdAt: string
}

interface UsersTableProps {
  establishmentId: string
  role: string
  searchTerm: string
}

export function UsersTable({ establishmentId, role, searchTerm }: UsersTableProps) {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userToRemove, setUserToRemove] = useState<string | null>(null)
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  // Charger les utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/establishments/${establishmentId}/users?role=${role}`)

        if (!response.ok) {
          throw new Error("Impossible de charger les utilisateurs")
        }

        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error)
        setError("Impossible de charger les utilisateurs")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [establishmentId, role])

  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = users.filter((user) => user.email.toLowerCase().includes(searchTerm.toLowerCase()))

  // Gérer la suppression d'un utilisateur de l'établissement
  const handleRemoveUser = async () => {
    if (!userToRemove) return

    try {
      setIsRemoving(true)
      const response = await fetch(`/api/establishments/${establishmentId}/users/${userToRemove}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Échec de la suppression de l'utilisateur de l'établissement")
      }

      // Mettre à jour la liste des utilisateurs
      setUsers(users.filter((user) => user.id !== userToRemove))
      toast({
        title: "Utilisateur retiré",
        description: "L'utilisateur a été retiré de l'établissement avec succès.",
      })
    } catch (error) {
      console.error("Error removing user:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression de l'utilisateur.",
        variant: "destructive",
      })
    } finally {
      setUserToRemove(null)
      setRemoveDialogOpen(false)
      setIsRemoving(false)
    }
  }

  if (loading) {
    return <div>Chargement des utilisateurs...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {searchTerm ? "Aucun utilisateur ne correspond à votre recherche" : "Aucun utilisateur trouvé"}
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
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Jamais"}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
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
                          setUserToRemove(user.id)
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
            <AlertDialogTitle>Êtes-vous sûr de vouloir retirer cet utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>L'utilisateur ne sera plus associé à cet établissement.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveUser} className="bg-red-600 hover:bg-red-700" disabled={isRemoving}>
              {isRemoving ? "Suppression..." : "Retirer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
