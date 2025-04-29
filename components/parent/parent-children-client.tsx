"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { UserPlus, School, Trash2 } from "lucide-react"
import { AddChildForm } from "@/components/parent/add-child-form"

interface ParentChildrenClientProps {
  parentId: string
  establishmentId: string
  initialChildren: any[]
}

export function ParentChildrenClient({ parentId, establishmentId, initialChildren }: ParentChildrenClientProps) {
  const [children, setChildren] = useState(initialChildren)
  const [isAddChildDialogOpen, setIsAddChildDialogOpen] = useState(false)

  const handleChildAdded = (newChild: any) => {
    setChildren([...children, newChild])
    setIsAddChildDialogOpen(false)
    toast({
      title: "Enfant ajouté",
      description: "L'enfant a été associé à votre compte avec succès.",
    })
  }

  const handleRemoveChild = async (childId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette association ?")) {
      return
    }

    try {
      const response = await fetch(`/api/parents/${parentId}/children/${childId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'association")
      }

      setChildren(children.filter((child) => child.childId !== childId))
      toast({
        title: "Association supprimée",
        description: "L'enfant a été dissocié de votre compte avec succès.",
      })
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'association.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mes enfants</h1>
        <Dialog open={isAddChildDialogOpen} onOpenChange={setIsAddChildDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Associer un enfant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Associer un enfant</DialogTitle>
              <DialogDescription>
                Recherchez et associez un élève à votre compte. L'élève doit être déjà inscrit dans l'établissement.
              </DialogDescription>
            </DialogHeader>
            <AddChildForm
              parentId={parentId}
              establishmentId={establishmentId}
              onChildAdded={handleChildAdded}
              onCancel={() => setIsAddChildDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {children.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Aucun enfant associé</CardTitle>
            <CardDescription>
              Vous n'avez pas encore d'enfants associés à votre compte. Cliquez sur "Associer un enfant" pour commencer.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
            <Card key={child.childId}>
              <CardHeader className="pb-2">
                <CardTitle>{child.child.email}</CardTitle>
                <CardDescription>{child.child.role === "ELEVE" ? "Élève" : "Utilisateur"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {child.child.studentClasses && child.child.studentClasses.length > 0 ? (
                    <div className="flex items-center text-sm">
                      <School className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Classe: {child.child.studentClasses[0].class.name}</span>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Aucune classe assignée</div>
                  )}
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveChild(child.childId)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Dissocier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
