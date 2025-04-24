"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Plus, ArrowLeft } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { AddSessionForm } from "@/components/admin/add-session-form"
import { EditSessionForm } from "@/components/admin/edit-session-form"
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

type Class = {
  id: string
  name: string
}

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
}

type Session = {
  id: string
  title: string | null
  description: string | null
  dayOfWeek: number
  startTime: string
  endTime: string
  recurrent: boolean
  room: string | null
}

interface CourseSessionsListProps {
  classData: Class
  courseData: Course
  establishmentId: string
}

export function CourseSessionsList({ classData, courseData, establishmentId }: CourseSessionsListProps) {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [addSessionDialogOpen, setAddSessionDialogOpen] = useState(false)
  const [editSessionDialogOpen, setEditSessionDialogOpen] = useState(false)
  const [currentSession, setCurrentSession] = useState<Session | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Charger les sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/establishments/${establishmentId}/classes/${classData.id}/courses/${courseData.id}/sessions`,
        )

        if (!response.ok) {
          throw new Error("Impossible de charger les sessions")
        }

        const data = await response.json()
        setSessions(data)
      } catch (error) {
        console.error("Error fetching sessions:", error)
        setError("Impossible de charger les sessions")
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [establishmentId, classData.id, courseData.id])

  // Fonction pour formatter le jour de la semaine
  const formatDayOfWeek = (day: number) => {
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
    return days[day]
  }

  // Fonction pour formatter l'heure
  const formatTime = (time: string) => {
    const date = new Date(time)
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  }

  // Filtrer les sessions en fonction du terme de recherche
  const filteredSessions = sessions.filter(
    (session) =>
      (session.title && session.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (session.description && session.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (session.room && session.room.toLowerCase().includes(searchTerm.toLowerCase())) ||
      formatDayOfWeek(session.dayOfWeek).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Gérer la suppression d'une session
  const handleDeleteSession = async () => {
    if (!sessionToDelete) return

    try {
      setIsDeleting(true)
      const response = await fetch(
        `/api/establishments/${establishmentId}/classes/${classData.id}/courses/${courseData.id}/sessions/${sessionToDelete}`,
        {
          method: "DELETE",
        },
      )

      if (!response.ok) {
        throw new Error("Échec de la suppression de la session")
      }

      // Mettre à jour la liste des sessions
      setSessions(sessions.filter((s) => s.id !== sessionToDelete))
      toast({
        title: "Session supprimée",
        description: "La session a été supprimée avec succès.",
      })
    } catch (error) {
      console.error("Error deleting session:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression de la session.",
        variant: "destructive",
      })
    } finally {
      setSessionToDelete(null)
      setDeleteDialogOpen(false)
      setIsDeleting(false)
    }
  }

  // Gérer la modification d'une session
  const handleEditSession = (session: Session) => {
    setCurrentSession(session)
    setEditSessionDialogOpen(true)
  }

  if (loading) {
    return <div>Chargement des sessions...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push(`/admin/classes/${classData.id}/courses`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux cours
        </Button>
        <h1 className="text-2xl font-bold">
          Sessions du cours {courseData.name} - {classData.name}
        </h1>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Rechercher une session..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-full max-w-full sm:w-[250px] lg:w-[300px]"
          />
        </div>
        <Button onClick={() => setAddSessionDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une session
        </Button>
      </div>

      {filteredSessions.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            {searchTerm ? "Aucune session ne correspond à votre recherche" : "Aucune session trouvée"}
          </div>
          {!searchTerm && (
            <Button onClick={() => setAddSessionDialogOpen(true)} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Créer votre première session
            </Button>
          )}
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jour</TableHead>
                <TableHead>Horaire</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Salle</TableHead>
                <TableHead>Récurrent</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <Badge variant="outline">{formatDayOfWeek(session.dayOfWeek)}</Badge>
                  </TableCell>
                  <TableCell>
                    {formatTime(session.startTime)} - {formatTime(session.endTime)}
                  </TableCell>
                  <TableCell>
                    <div>
                      {session.title || courseData.name}
                      {session.description && <p className="text-xs text-muted-foreground">{session.description}</p>}
                    </div>
                  </TableCell>
                  <TableCell>{session.room || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={session.recurrent ? "default" : "secondary"}>
                      {session.recurrent ? "Oui" : "Non"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditSession(session)}>Modifier</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSessionToDelete(session.id)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Formulaire d'ajout de session */}
      <AddSessionForm
        establishmentId={establishmentId}
        classId={classData.id}
        courseId={courseData.id}
        open={addSessionDialogOpen}
        onOpenChange={setAddSessionDialogOpen}
        onSessionAdded={(newSession) => setSessions([...sessions, newSession])}
      />

      {/* Formulaire de modification de session */}
      {currentSession && (
        <EditSessionForm
          establishmentId={establishmentId}
          classId={classData.id}
          courseId={courseData.id}
          sessionData={currentSession}
          open={editSessionDialogOpen}
          onOpenChange={setEditSessionDialogOpen}
          onSessionUpdated={(updatedSession) =>
            setSessions(sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s)))
          }
        />
      )}

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette session ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSession}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
