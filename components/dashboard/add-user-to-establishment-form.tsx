"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddUserToEstablishmentFormProps {
  establishmentId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: string
}

export function AddUserToEstablishmentForm({
  establishmentId,
  open,
  onOpenChange,
  defaultTab = "students",
}: AddUserToEstablishmentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("ELEVE")
  const [existingUsers, setExistingUsers] = useState<any[]>([])
  const [selectedUserId, setSelectedUserId] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  // Réinitialiser le formulaire lorsque le dialogue s'ouvre
  useEffect(() => {
    if (open) {
      setEmail("")
      setRole(
        activeTab === "students"
          ? "ELEVE"
          : activeTab === "parents"
            ? "PARENT"
            : activeTab === "professors"
              ? "PROFESSEUR"
              : "ADMINISTRATION",
      )
      setSelectedUserId("")
      setSearchTerm("")
      setSearchResults([])
      setError(null)
    }
  }, [open, activeTab])

  // Mettre à jour le rôle en fonction de l'onglet actif
  useEffect(() => {
    setRole(
      activeTab === "students"
        ? "ELEVE"
        : activeTab === "parents"
          ? "PARENT"
          : activeTab === "professors"
            ? "PROFESSEUR"
            : "ADMINISTRATION",
    )
  }, [activeTab])

  // Rechercher des utilisateurs existants
  useEffect(() => {
    if (searchTerm.length < 3) {
      setSearchResults([])
      return
    }

    const searchUsers = async () => {
      try {
        setSearchLoading(true)
        const response = await fetch(`/api/users/search?q=${searchTerm}&role=${role}`)

        if (!response.ok) {
          throw new Error("Impossible de rechercher des utilisateurs")
        }

        const data = await response.json()
        setSearchResults(data)
      } catch (error) {
        console.error("Error searching users:", error)
        setError("Impossible de rechercher des utilisateurs")
      } finally {
        setSearchLoading(false)
      }
    }

    const timeoutId = setTimeout(() => {
      searchUsers()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, role])

  // Gérer la création d'un nouvel utilisateur
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Créer un nouvel utilisateur
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role,
          establishmentId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Échec de la création de l'utilisateur")
      }

      // Fermer le dialogue
      onOpenChange(false)

      // Afficher un message de succès
      toast({
        title: "Utilisateur créé",
        description: "L'utilisateur a été créé et associé à l'établissement avec succès.",
      })

      // Rafraîchir la page
      router.refresh()
    } catch (err: any) {
      console.error("Error creating user:", err)
      setError(err.message || "Une erreur s'est produite")
    } finally {
      setLoading(false)
    }
  }

  // Gérer l'ajout d'un utilisateur existant
  const handleAddExistingUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Ajouter un utilisateur existant à l'établissement
      const response = await fetch(`/api/establishments/${establishmentId}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          role,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Échec de l'ajout de l'utilisateur à l'établissement")
      }

      // Fermer le dialogue
      onOpenChange(false)

      // Afficher un message de succès
      toast({
        title: "Utilisateur ajouté",
        description: "L'utilisateur a été associé à l'établissement avec succès.",
      })

      // Rafraîchir la page
      router.refresh()
    } catch (err: any) {
      console.error("Error adding user to establishment:", err)
      setError(err.message || "Une erreur s'est produite")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
          <DialogDescription>
            Créez un nouvel utilisateur ou associez un utilisateur existant à cet établissement.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="students">Élèves</TabsTrigger>
            <TabsTrigger value="parents">Parents</TabsTrigger>
            <TabsTrigger value="professors">Professeurs</TabsTrigger>
            <TabsTrigger value="administration">Admin</TabsTrigger>
          </TabsList>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Rechercher un utilisateur existant</h3>
              <Input
                placeholder="Rechercher par email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {searchLoading && <div className="text-sm text-muted-foreground">Recherche en cours...</div>}

              {searchResults.length > 0 && (
                <div className="border rounded-md max-h-40 overflow-y-auto">
                  <div className="p-2">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className={`p-2 cursor-pointer rounded-md ${
                          selectedUserId === user.id ? "bg-muted" : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedUserId(user.id)}
                      >
                        <div className="font-medium">{user.email}</div>
                        <div className="text-xs text-muted-foreground">
                          {user.role === "ELEVE"
                            ? "Élève"
                            : user.role === "PARENT"
                              ? "Parent"
                              : user.role === "PROFESSEUR"
                                ? "Professeur"
                                : "Administration"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchTerm.length >= 3 && searchResults.length === 0 && !searchLoading && (
                <div className="text-sm text-muted-foreground">Aucun utilisateur trouvé</div>
              )}

              {selectedUserId && (
                <Button onClick={handleAddExistingUser} disabled={loading} className="w-full mt-2">
                  {loading ? "Ajout en cours..." : "Ajouter l'utilisateur sélectionné"}
                </Button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Ou</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Créer un nouvel utilisateur</h3>
              <form onSubmit={handleCreateUser}>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Rôle *
                    </Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ELEVE">Élève</SelectItem>
                        <SelectItem value="PARENT">Parent</SelectItem>
                        <SelectItem value="PROFESSEUR">Professeur</SelectItem>
                        <SelectItem value="ADMINISTRATION">Administration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Création en cours..." : "Créer et ajouter l'utilisateur"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
