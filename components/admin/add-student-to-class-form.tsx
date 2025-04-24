"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

interface AddStudentToClassFormProps {
  classId: string
  establishmentId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onStudentAdded: (enrollment: StudentEnrollment) => void
}

export function AddStudentToClassForm({
  classId,
  establishmentId,
  open,
  onOpenChange,
  onStudentAdded,
}: AddStudentToClassFormProps) {
  const [activeTab, setActiveTab] = useState("existing")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const [newStudentEmail, setNewStudentEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Réinitialiser le formulaire lorsque le dialogue s'ouvre
  useEffect(() => {
    if (open) {
      setActiveTab("existing")
      setSearchTerm("")
      setSearchResults([])
      setSelectedStudentId("")
      setNewStudentEmail("")
      setError(null)
    }
  }, [open])

  // Rechercher des élèves existants
  useEffect(() => {
    if (searchTerm.length < 3) {
      setSearchResults([])
      return
    }

    const searchStudents = async () => {
      try {
        setSearchLoading(true)
        const response = await fetch(`/api/users/search?q=${searchTerm}&role=ELEVE`)

        if (!response.ok) {
          throw new Error("Impossible de rechercher des élèves")
        }

        const data = await response.json()
        setSearchResults(data)
      } catch (error) {
        console.error("Error searching students:", error)
        setError("Impossible de rechercher des élèves")
      } finally {
        setSearchLoading(false)
      }
    }

    const timeoutId = setTimeout(() => {
      searchStudents()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Ajouter un élève existant à la classe
  const handleAddExistingStudent = async () => {
    if (!selectedStudentId) {
      setError("Veuillez sélectionner un élève")
      return
    }

    setError(null)
    setLoading(true)

    try {
      const response = await fetch(`/api/establishments/${establishmentId}/classes/${classId}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          status: "active",
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Échec de l'ajout de l'élève à la classe")
      }

      const enrollment = await response.json()

      // Ajouter les informations de l'élève à l'inscription
      const student = searchResults.find((s) => s.id === selectedStudentId)
      enrollment.student = student

      // Notifier le parent
      onStudentAdded(enrollment)

      // Fermer le dialogue
      onOpenChange(false)

      // Afficher un message de succès
      toast({
        title: "Élève ajouté",
        description: "L'élève a été ajouté à la classe avec succès.",
      })
    } catch (err: any) {
      console.error("Error adding student to class:", err)
      setError(err.message || "Une erreur s'est produite")
    } finally {
      setLoading(false)
    }
  }

  // Créer un nouvel élève et l'ajouter à la classe
  const handleCreateAndAddStudent = async () => {
    if (!newStudentEmail) {
      setError("Veuillez saisir une adresse email")
      return
    }

    setError(null)
    setLoading(true)

    try {
      // Créer un nouvel élève
      const createResponse = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newStudentEmail,
          role: "ELEVE",
          establishmentId,
        }),
      })

      if (!createResponse.ok) {
        const data = await createResponse.json()
        throw new Error(data.error || "Échec de la création de l'élève")
      }

      const newStudent = await createResponse.json()

      // Ajouter l'élève à la classe
      const addResponse = await fetch(`/api/establishments/${establishmentId}/classes/${classId}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: newStudent.id,
          status: "active",
        }),
      })

      if (!addResponse.ok) {
        const data = await addResponse.json()
        throw new Error(data.error || "Échec de l'ajout de l'élève à la classe")
      }

      const enrollment = await addResponse.json()

      // Ajouter les informations de l'élève à l'inscription
      enrollment.student = {
        id: newStudent.id,
        email: newStudent.email,
        lastLogin: null,
        createdAt: new Date().toISOString(),
      }

      // Notifier le parent
      onStudentAdded(enrollment)

      // Fermer le dialogue
      onOpenChange(false)

      // Afficher un message de succès
      toast({
        title: "Élève créé et ajouté",
        description: `L'élève ${newStudent.email} a été créé et ajouté à la classe avec succès. Mot de passe temporaire: ${newStudent.temporaryPassword}`,
      })
    } catch (err: any) {
      console.error("Error creating and adding student:", err)
      setError(err.message || "Une erreur s'est produite")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Ajouter un élève à la classe</DialogTitle>
          <DialogDescription>Ajoutez un élève existant ou créez-en un nouveau.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="existing" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="existing">Élève existant</TabsTrigger>
            <TabsTrigger value="new">Nouvel élève</TabsTrigger>
          </TabsList>

          <TabsContent value="existing">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Rechercher un élève</Label>
                <Input
                  id="search"
                  placeholder="Rechercher par email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {searchLoading && <div className="text-sm text-muted-foreground">Recherche en cours...</div>}

                {searchResults.length > 0 && (
                  <div className="border rounded-md max-h-40 overflow-y-auto">
                    <div className="p-2">
                      {searchResults.map((student) => (
                        <div
                          key={student.id}
                          className={`p-2 cursor-pointer rounded-md ${
                            selectedStudentId === student.id ? "bg-muted" : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedStudentId(student.id)}
                        >
                          <div className="font-medium">{student.email}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchTerm.length >= 3 && searchResults.length === 0 && !searchLoading && (
                  <div className="text-sm text-muted-foreground">Aucun élève trouvé</div>
                )}
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <DialogFooter>
                <Button
                  type="button"
                  onClick={handleAddExistingStudent}
                  disabled={loading || !selectedStudentId}
                  className="w-full"
                >
                  {loading ? "Ajout en cours..." : "Ajouter l'élève à la classe"}
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>

          <TabsContent value="new">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email de l'élève</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemple.com"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <DialogFooter>
                <Button
                  type="button"
                  onClick={handleCreateAndAddStudent}
                  disabled={loading || !newStudentEmail}
                  className="w-full"
                >
                  {loading ? "Création en cours..." : "Créer et ajouter l'élève"}
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
