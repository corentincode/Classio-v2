"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Trash, Users, BookOpen } from "lucide-react"
import Link from "next/link"
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

type ClassData = {
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

interface ClassDetailsProps {
  classData: ClassData
  establishmentId: string
}

export function ClassDetails({ classData, establishmentId }: ClassDetailsProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/establishments/${establishmentId}/classes/${classData.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Échec de la suppression de la classe")
      }

      toast({
        title: "Classe supprimée",
        description: "La classe a été supprimée avec succès.",
      })

      // Rediriger vers la liste des classes
      router.push("/admin/classes")
    } catch (error) {
      console.error("Error deleting class:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression de la classe.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/classes">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{classData.name}</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/classes/${classData.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </Link>
          <Button variant="outline" className="text-red-500" onClick={() => setDeleteDialogOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Niveau</p>
                <p className="font-medium">
                  {classData.level}
                  {classData.section && ` - ${classData.section}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Année scolaire</p>
                <p className="font-medium">{classData.schoolYear}</p>
              </div>
              {classData.maxStudents && (
                <div>
                  <p className="text-sm text-muted-foreground">Capacité maximale</p>
                  <p className="font-medium">{classData.maxStudents} élèves</p>
                </div>
              )}
              {classData.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{classData.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Élèves</CardTitle>
            <CardDescription>Gestion des élèves de la classe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xl font-bold">{classData._count.students}</span>
                  <span className="text-muted-foreground">élèves</span>
                </div>
                {classData.maxStudents && (
                  <div className="text-sm text-muted-foreground">
                    {classData._count.students}/{classData.maxStudents}
                  </div>
                )}
              </div>
              <Link href={`/admin/classes/${classData.id}/students`}>
                <Button className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Gérer les élèves
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cours</CardTitle>
            <CardDescription>Gestion des cours de la classe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span className="text-xl font-bold">{classData._count.courses}</span>
                <span className="text-muted-foreground">cours</span>
              </div>
              <Link href={`/admin/classes/${classData.id}/courses`}>
                <Button className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Gérer les cours
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students">Élèves</TabsTrigger>
          <TabsTrigger value="courses">Cours</TabsTrigger>
          <TabsTrigger value="schedule">Emploi du temps</TabsTrigger>
        </TabsList>
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Liste des élèves</CardTitle>
              <CardDescription>Élèves inscrits dans cette classe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Link href={`/admin/classes/${classData.id}/students`}>
                  <Button>Voir tous les élèves</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Liste des cours</CardTitle>
              <CardDescription>Cours enseignés dans cette classe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Link href={`/admin/classes/${classData.id}/courses`}>
                  <Button>Voir tous les cours</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Emploi du temps</CardTitle>
              <CardDescription>Emploi du temps de la classe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Link href={`/admin/classes/${classData.id}/schedule`}>
                  <Button>Voir l'emploi du temps</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette classe ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Tous les élèves et cours associés à cette classe seront dissociés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={isDeleting}>
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
