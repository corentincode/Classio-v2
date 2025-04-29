"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Trash2 } from "lucide-react"

interface Parent {
  id: string
  name: string | null
  email: string
  children: {
    id: string
    child: {
      id: string
      name: string | null
      email: string
    }
  }[]
}

interface Student {
  id: string
  name: string | null
  email: string
  parents: {
    id: string
    name: string | null
    email: string
  }[]
}

export function ParentChildManagementClient({
  parents,
  students,
}: {
  parents: Parent[]
  students: Student[]
}) {
  const [selectedParent, setSelectedParent] = useState<string>("")
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateRelation = async () => {
    if (!selectedParent || !selectedStudent) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un parent et un élève",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)

    try {
      const response = await fetch(`/api/parents/${selectedParent}/children`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          childId: selectedStudent,
          relationship: "parent",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue")
      }

      toast({
        title: "Succès",
        description: "Relation parent-enfant créée avec succès",
      })

      // Recharger la page pour afficher les changements
      window.location.reload()
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteRelation = async (parentId: string, childId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette relation ?")) {
      return
    }

    try {
      const response = await fetch(`/api/parents/${parentId}/children/${childId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue")
      }

      toast({
        title: "Succès",
        description: "Relation parent-enfant supprimée avec succès",
      })

      // Recharger la page pour afficher les changements
      window.location.reload()
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Créer une relation parent-enfant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="parent">Parent</Label>
              <Select value={selectedParent} onValueChange={setSelectedParent}>
                <SelectTrigger id="parent">
                  <SelectValue placeholder="Sélectionner un parent" />
                </SelectTrigger>
                <SelectContent>
                  {parents.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.name || parent.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="student">Élève</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger id="student">
                  <SelectValue placeholder="Sélectionner un élève" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name || student.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            className="mt-4"
            onClick={handleCreateRelation}
            disabled={isCreating || !selectedParent || !selectedStudent}
          >
            {isCreating ? "Création en cours..." : "Créer la relation"}
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="parents">
        <TabsList>
          <TabsTrigger value="parents">Parents</TabsTrigger>
          <TabsTrigger value="students">Élèves</TabsTrigger>
        </TabsList>
        <TabsContent value="parents">
          <div className="space-y-4">
            {parents.map((parent) => (
              <Card key={parent.id}>
                <CardHeader>
                  <CardTitle>{parent.name || parent.email}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-2">ID: {parent.id}</p>
                  <p className="text-sm text-gray-500 mb-4">Email: {parent.email}</p>
                  <h3 className="font-semibold mb-2">Enfants ({parent.children.length})</h3>
                  {parent.children.length === 0 ? (
                    <p className="text-sm text-gray-500">Aucun enfant associé</p>
                  ) : (
                    <ul className="space-y-2">
                      {parent.children.map((relation) => (
                        <li key={relation.id} className="flex items-center justify-between">
                          <span>
                            {relation.child.name || relation.child.email} (ID: {relation.child.id})
                          </span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRelation(parent.id, relation.child.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="students">
          <div className="space-y-4">
            {students.map((student) => (
              <Card key={student.id}>
                <CardHeader>
                  <CardTitle>{student.name || student.email}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-2">ID: {student.id}</p>
                  <p className="text-sm text-gray-500 mb-4">Email: {student.email}</p>
                  <h3 className="font-semibold mb-2">Parents ({student.parents.length})</h3>
                  {student.parents.length === 0 ? (
                    <p className="text-sm text-gray-500">Aucun parent associé</p>
                  ) : (
                    <ul className="space-y-2">
                      {student.parents.map((parent) => (
                        <li key={parent.id} className="flex items-center justify-between">
                          <span>
                            {parent.name || parent.email} (ID: {parent.id})
                          </span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRelation(parent.id, student.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
