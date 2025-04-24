"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

type ClassData = {
  id: string
  name: string
  level: string
  section: string | null
  schoolYear: string
  description: string | null
  maxStudents: number | null
}

interface EditClassFormProps {
  classData: ClassData
  establishmentId: string
}

export function EditClassForm({ classData, establishmentId }: EditClassFormProps) {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: classData.name,
    level: classData.level,
    section: classData.section || "",
    schoolYear: classData.schoolYear,
    description: classData.description || "",
    maxStudents: classData.maxStudents?.toString() || "",
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
      const response = await fetch(`/api/establishments/${establishmentId}/classes/${classData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          maxStudents: formData.maxStudents ? Number.parseInt(formData.maxStudents) : null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Échec de la modification de la classe")
      }

      toast({
        title: "Classe modifiée",
        description: "La classe a été modifiée avec succès.",
      })

      // Rediriger vers la page de détails
      router.push(`/admin/classes/${classData.id}`)
      router.refresh()
    } catch (err: any) {
      console.error("Error updating class:", err)
      setError(err.message || "Une erreur s'est produite")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Modifier la classe</CardTitle>
          <CardDescription>Mettez à jour les informations de la classe.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Niveau *</Label>
                <Input
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                  placeholder="ex: 6ème, Terminale"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  placeholder="ex: A, S2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schoolYear">Année scolaire *</Label>
                <Input
                  id="schoolYear"
                  name="schoolYear"
                  value={formData.schoolYear}
                  onChange={handleChange}
                  required
                  placeholder="ex: 2023-2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxStudents">Capacité max.</Label>
                <Input
                  id="maxStudents"
                  name="maxStudents"
                  type="number"
                  value={formData.maxStudents}
                  onChange={handleChange}
                  placeholder="Nombre maximum d'élèves"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="min-h-[100px]"
                placeholder="Description de la classe"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
