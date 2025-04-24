"use client"

import type React from "react"

import { useState } from "react"
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
import { toast } from "@/components/ui/use-toast"

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

interface AddClassFormProps {
  establishmentId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onClassAdded: (newClass: Class) => void
}

export function AddClassForm({ establishmentId, open, onOpenChange, onClassAdded }: AddClassFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    section: "",
    schoolYear: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
    description: "",
    maxStudents: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch(`/api/establishments/${establishmentId}/classes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          maxStudents: formData.maxStudents ? Number.parseInt(formData.maxStudents) : null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Échec de la création de la classe")
      }

      const newClass = await response.json()

      // Ajouter le compteur pour la compatibilité avec le composant de liste
      newClass._count = { students: 0, courses: 0 }

      // Notifier le parent
      onClassAdded(newClass)

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        level: "",
        section: "",
        schoolYear: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
        description: "",
        maxStudents: "",
      })

      // Fermer le dialogue
      onOpenChange(false)

      // Afficher un message de succès
      toast({
        title: "Classe créée",
        description: "La classe a été créée avec succès.",
      })
    } catch (err: any) {
      console.error("Error creating class:", err)
      setError(err.message || "Une erreur s'est produite")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle classe</DialogTitle>
          <DialogDescription>Remplissez les informations pour créer une nouvelle classe.</DialogDescription>
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
              <Label htmlFor="level" className="text-right">
                Niveau *
              </Label>
              <Input
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="col-span-3"
                required
                placeholder="ex: 6ème, Terminale"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="section" className="text-right">
                Section
              </Label>
              <Input
                id="section"
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="col-span-3"
                placeholder="ex: A, S2"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schoolYear" className="text-right">
                Année scolaire *
              </Label>
              <Input
                id="schoolYear"
                name="schoolYear"
                value={formData.schoolYear}
                onChange={handleChange}
                className="col-span-3"
                required
                placeholder="ex: 2023-2024"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxStudents" className="text-right">
                Capacité max.
              </Label>
              <Input
                id="maxStudents"
                name="maxStudents"
                type="number"
                value={formData.maxStudents}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Nombre maximum d'élèves"
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
                placeholder="Description de la classe"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Création en cours..." : "Créer la classe"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
