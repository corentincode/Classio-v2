import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { ParentChildManagementClient } from "@/components/admin/parent-child-management-client"

export default async function ParentChildManagementPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Vérifier si l'utilisateur est un administrateur
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    select: { role: true, establishmentId: true },
  })

  if (!user) {
    redirect("/auth/signin")
  }

  if (user.role !== "ADMINISTRATION") {
    redirect("/")
  }

  if (!user.establishmentId) {
    redirect("/admin/no-establishment")
  }

  // Récupérer tous les parents
  const parents = await prisma.user.findMany({
    where: {
      role: "PARENT",
      establishmentId: user.establishmentId,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })

  // Récupérer tous les élèves
  const students = await prisma.user.findMany({
    where: {
      role: "ELEVE",
      establishmentId: user.establishmentId,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })

  // Récupérer toutes les relations parent-enfant
  const parentChildRelations = await prisma.parentChild.findMany({
    where: {
      parent: {
        establishmentId: user.establishmentId,
      },
      child: {
        establishmentId: user.establishmentId,
      },
    },
    include: {
      parent: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      child: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  // Enrichir les parents avec leurs enfants
  const parentsWithChildren = parents.map((parent) => {
    const childRelations = parentChildRelations
      .filter((relation) => relation.parentId === parent.id)
      .map((relation) => ({
        id: relation.id,
        child: relation.child,
      }))

    return {
      ...parent,
      children: childRelations,
    }
  })

  // Enrichir les élèves avec leurs parents
  const studentsWithParents = students.map((student) => {
    const studentParents = parentChildRelations
      .filter((relation) => relation.childId === student.id)
      .map((relation) => relation.parent)

    return {
      ...student,
      parents: studentParents,
    }
  })

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des relations parent-enfant</h1>
      <ParentChildManagementClient parents={parentsWithChildren} students={studentsWithParents} />
    </div>
  )
}
