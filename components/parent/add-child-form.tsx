"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Search, Loader2 } from "lucide-react"

interface AddChildFormProps {
  parentId: string
  establishmentId: string
  onChildAdded: (child: any) => void
  onCancel: () => void
}

export function AddChildForm({ parentId, establishmentId, onChildAdded, onCancel }: AddChildFormProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [relationship, setRelationship] = useState("parent")

  const handleSearch = async () => {
    if (searchTerm.length < 3) {
      toast({
        title: "Recherche trop courte",
        description: "Veuillez entrer au moins 3 caractères pour la recherche.",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)
    setSearchResults([])
    setSelectedStudent(null)

    try {
      const response = await fetch(
        `/api/establishments/${establishmentId}/students/search?q=${encodeURIComponent(searchTerm)}`,
      )

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche")
      }

      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur de recherche",
        description: "Une erreur est survenue lors de la recherche d'élèves.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedStudent) {
      toast({
        title: "Aucun élève sélectionné",
        description: "Veuillez sélectionner un élève à associer.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/parents/${parentId}/children`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          childId: selectedStudent.id,
          relationship,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erreur lors de l'association")
      }

      const newChild = await response.json()
      onChildAdded(newChild)
    } catch (error: any) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'association de l'élève.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="search">Rechercher un élève</Label>
        <div className="flex space-x-2">
          <Input
            id="search"
            placeholder="Rechercher par email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isSearching}
          />
          <Button type="button" onClick={handleSearch} disabled={isSearching}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="border rounded-md max-h-60 overflow-y-auto">
          <div className="p-2">
            {searchResults.map((student) => (
              <div
                key={student.id}
                className={`p-2 cursor-pointer rounded-md ${
                  selectedStudent?.id === student.id ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedStudent(student)}
              >
                <div className="font-medium">{student.email}</div>
                {student.studentClasses && student.studentClasses.length > 0 && (
                  <div className="text-xs text-gray-500">Classe: {student.studentClasses[0].class.name}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {searchResults.length === 0 && !isSearching && searchTerm.length >= 3 && (
        <div className="text-center py-4 text-gray-500">
          Aucun élève trouvé. Veuillez vérifier l'email et réessayer.
        </div>
      )}

      {selectedStudent && (
        <div className="space-y-2 border p-3 rounded-md bg-gray-50">
          <Label htmlFor="relationship">Relation avec l'élève</Label>
          <select
            id="relationship"
            className="w-full p-2 border rounded-md"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
          >
            <option value="parent">Parent</option>
            <option value="father">Père</option>
            <option value="mother">Mère</option>
            <option value="guardian">Tuteur légal</option>
            <option value="other">Autre</option>
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={!selectedStudent || isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Associer l'élève
        </Button>
      </div>
    </form>
  )
}
