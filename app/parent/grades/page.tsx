import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { ParentGradesClient } from "@/components/parent/parent-grades-client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Notes des enfants | Classio",
  description: "Consulter les notes de vos enfants",
}

export default async function ParentGradesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Récupérer l'utilisateur
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    select: {
      id: true,
      role: true,
      establishmentId: true,
    },
  })

  if (!user) {
    redirect("/auth/signin")
  }

  if (user.role !== "PARENT") {
    redirect("/")
  }

  if (!user.establishmentId) {
    redirect("/parent/no-establishment")
  }

  // Récupérer directement les relations parent-enfant depuis la table ParentChild
  const parentChildRelations = await prisma.parentChild.findMany({
    where: {
      parentId: user.id,
    },
    include: {
      child: {
        select: {
          id: true,
          name: true,
          email: true,
          studentClasses: {
            include: {
              class: true,
            },
          },
        },
      },
    },
  })

  console.log("Parent ID:", user.id)
  console.log("Nombre de relations parent-enfant:", parentChildRelations.length)

  if (parentChildRelations.length > 0) {
    parentChildRelations.forEach((relation, index) => {
      console.log(`Enfant ${index + 1}:`, relation.childId, relation.child.email)
    })
  }

  // Si l'utilisateur n'a pas d'enfants, afficher un message
  if (parentChildRelations.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Notes de mes enfants</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
            <p className="text-gray-500">Vous n'avez pas encore d'enfant associé à votre compte.</p>
            <Button asChild>
              <Link href="/parent/children">Associer un enfant</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Récupérer les périodes de l'établissement
  const periods = await prisma.periodConfig.findMany({
    where: {
      establishmentId: user.establishmentId,
      isActive: true,
    },
    orderBy: [{ schoolYear: "desc" }, { startDate: "asc" }],
  })

  // Transformer les relations en liste d'enfants avec leurs cours
  const childrenWithCourses = await Promise.all(
    parentChildRelations.map(async ({ child }) => {
      // Si l'enfant n'a pas de classe, retourner un objet avec une liste de cours vide
      if (!child.studentClasses || child.studentClasses.length === 0) {
        console.log(`L'enfant ${child.id} n'a pas de classe`)
        return {
          ...child,
          className: "Aucune classe",
          courses: [],
        }
      }

      const classId = child.studentClasses[0].class.id
      console.log(`Récupération des cours pour la classe ${classId}`)

      const courses = await prisma.course.findMany({
        where: {
          classId: classId,
        },
        orderBy: {
          name: "asc",
        },
      })

      console.log(`Nombre de cours trouvés: ${courses.length}`)

      return {
        ...child,
        className: child.studentClasses[0].class.name,
        courses,
      }
    }),
  )

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Notes de mes enfants</h1>
      <ParentGradesClient children={childrenWithCourses} periods={periods} />
    </div>
  )
}
