import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Users, BookOpen, ClipboardList } from "lucide-react"

export default async function CourseDetailsPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { establishmentId?: string }
}) {
  // Vérifier l'authentification
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  // Récupérer l'ID de l'établissement depuis les paramètres de recherche
  const establishmentId = searchParams.establishmentId

  // Si pas d'ID d'établissement, rediriger vers la sélection
  if (!establishmentId) {
    redirect("/professeur/select-establishment")
  }

  const courseId = params.id

  // Récupérer les détails du cours
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      class: {
        select: {
          id: true,
          name: true,
          level: true,
          section: true,
          establishmentId: true,
          students: {
            select: {
              id: true,
            },
          },
        },
      },
      professor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      sessions: {
        select: {
          id: true,
        },
      },
      evaluations: {
        select: {
          id: true,
        },
      },
    },
  })

  if (!course) {
    redirect(`/professeur/courses?establishmentId=${establishmentId}`)
  }

  // Vérifier si l'utilisateur est le professeur du cours ou un administrateur
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    select: {
      id: true,
      role: true,
    },
  })

  if (!user) {
    redirect("/auth/signin")
  }

  const isAdmin = user.role === "SUPERADMIN" || user.role === "ADMINISTRATION"
  const isProfessor = user.role === "PROFESSEUR" && course.professorId === user.id

  if (!isAdmin && !isProfessor) {
    redirect(`/professeur/courses?establishmentId=${establishmentId}`)
  }

  // Utiliser les données déjà récupérées pour compter
  const studentsCount = course.class.students.length
  const sessionsCount = course.sessions.length
  const evaluationsCount = course.evaluations.length

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{course.name}</h1>
          <p className="text-muted-foreground">
            Classe: {course.class.name} | Établissement: {course.class.establishmentId}
          </p>
        </div>
        <Link href={`/professeur/courses?establishmentId=${establishmentId}`}>
          <Button variant="outline">Retour aux cours</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Élèves</CardTitle>
            <CardDescription>Nombre d'élèves inscrits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{studentsCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sessions</CardTitle>
            <CardDescription>Nombre de sessions programmées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{sessionsCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Évaluations</CardTitle>
            <CardDescription>Nombre d'évaluations créées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{evaluationsCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails du cours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p>{course.description || "Aucune description disponible"}</p>
            </div>
            <div>
              <h3 className="font-medium">Professeur</h3>
              <p>{course.professor.name}</p>
            </div>
            <div>
              <h3 className="font-medium">Classe</h3>
              <p>
                {course.class.name} ({course.class.level}
                {course.class.section ? ` ${course.class.section}` : ""})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Tabs defaultValue="evaluations">
          <TabsList className="mb-4">
            <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="attendance">Présences</TabsTrigger>
          </TabsList>
          <TabsContent value="evaluations" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Évaluations</h2>
              <Link href={`/professeur/courses/${course.id}/evaluations?establishmentId=${establishmentId}`}>
                <Button>Gérer les évaluations</Button>
              </Link>
            </div>
            {evaluationsCount === 0 ? (
              <Card className="p-8 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucune évaluation n'a été créée pour ce cours.</p>
                <Link
                  href={`/professeur/courses/${course.id}/evaluations?establishmentId=${establishmentId}`}
                  className="mt-4 inline-block"
                >
                  <Button variant="outline" className="mt-4">
                    Créer une évaluation
                  </Button>
                </Link>
              </Card>
            ) : (
              <p className="text-muted-foreground">
                Cliquez sur "Gérer les évaluations" pour voir et modifier les {evaluationsCount} évaluations de ce
                cours.
              </p>
            )}
          </TabsContent>
          <TabsContent value="sessions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Sessions</h2>
              <Link
                href={`/admin/classes/${course.class.id}/courses/${course.id}/sessions?establishmentId=${establishmentId}`}
              >
                <Button>Gérer les sessions</Button>
              </Link>
            </div>
            {sessionsCount === 0 ? (
              <Card className="p-8 text-center">
                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucune session n'a été programmée pour ce cours.</p>
                <Link
                  href={`/admin/classes/${course.class.id}/courses/${course.id}/sessions?establishmentId=${establishmentId}`}
                  className="mt-4 inline-block"
                >
                  <Button variant="outline" className="mt-4">
                    Programmer une session
                  </Button>
                </Link>
              </Card>
            ) : (
              <p className="text-muted-foreground">
                Cliquez sur "Gérer les sessions" pour voir et modifier les {sessionsCount} sessions de ce cours.
              </p>
            )}
          </TabsContent>
          <TabsContent value="attendance" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Présences</h2>
              <Link href={`/professeur/attendance/course/${course.id}?establishmentId=${establishmentId}`}>
                <Button>Gérer les présences</Button>
              </Link>
            </div>
            <p className="text-muted-foreground">
              Cliquez sur "Gérer les présences" pour voir et modifier les présences des élèves pour ce cours.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
