"use client"

import type React from "react"

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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

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

interface AddCourseFormProps {
  establishmentId: string
  classId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onCourseAdded: (newCourse: Course) => void
}

export function AddCourseForm({ establishmentId, classId, open, onOpenChange, onCourseAdded }: AddCourseFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3b82f6", // Bleu par défaut
    professorId: "",
  })
  const [loading, setLoading] = useState(false)
  const [loadingProfessors, setLoadingProfessors] = useState(false)
  const [professors, setProfessors] = useState<Professor[]>([])
  const [error, setError] = useState<string | null>(null)

  // Charger la liste des professeurs
  useEffect(() => {
    if (open) {
      const fetchProfessors = async () => {
        try {
          setLoadingProfessors(true)
          const response = await fetch(`/api/establishments/${establishmentId}/professors`)

          if (!response.ok) {
            throw new Error("Impossible de charger les professeurs")
          }

          const data = await response.json()
          setProfessors(data)
        } catch (error) {
          console.error("Error fetching professors:", error)
          toast({
            title: "Erreur",
            description: "Impossible de charger la liste des professeurs.",
            variant: "destructive",
          })
        } finally {
          setLoadingProfessors(false)
        }
      }

      fetchProfessors()
    }
  }, [establishmentId, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectProfessor = (value: string) => {
    setFormData((prev) => ({ ...prev, professorId: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch(`/api/establishments/${establishmentId}/classes/${classId}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Échec de la création du cours")
      }

      const newCourse = await response.json()

      // Ajouter le professeur et le compteur pour la compatibilité avec la liste
      const professor = professors.find((p) => p.id === formData.professorId)
      newCourse.professor = professor
      newCourse._count = { sessions: 0 }

      // Notifier le parent
      onCourseAdded(newCourse)

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        description: "",
        color: "#3b82f6",
        professorId: "",
      })

      // Fermer le dialogue
      onOpenChange(false)

      // Afficher un message de succès
      toast({
        title: "Cours créé",
        description: "Le cours a été créé avec succès.",
      })
    } catch (err: any) {
      console.error("Error creating course:", err)
      setError(err.message || "Une erreur s'est produite")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau cours</DialogTitle>
          <DialogDescription>Remplissez les informations pour créer un nouveau cours.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Description du cours"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Couleur
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="color"
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="h-10 w-14"
                />
                <div className="ml-2 text-sm text-muted-foreground">Pour l'affichage dans l'emploi du temps</div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="professor" className="text-right">
                Professeur *
              </Label>
              <Select value={formData.professorId} onValueChange={handleSelectProfessor} required>
                <SelectTrigger id="professor" className="col-span-3">
                  <SelectValue placeholder="Sélectionner un professeur" />
                </SelectTrigger>
                <SelectContent>
                  {loadingProfessors ? (
                    <SelectItem value="loading" disabled>
                      Chargement...
                    </SelectItem>
                  ) : professors.length === 0 ? (
                    <SelectItem value="none" disabled>
                      Aucun professeur disponible
                    </SelectItem>
                  ) : (
                    professors.map((professor) => (
                      <SelectItem key={professor.id} value={professor.id}>
                        {professor.email}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loading || loadingProfessors || professors.length === 0}>
              {loading ? "Création en cours..." : "Créer le cours"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
