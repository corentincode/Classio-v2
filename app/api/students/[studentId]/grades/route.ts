import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { studentId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const studentId = params.studentId

    const url = new URL(request.url)
    const periodId = url.searchParams.get("periodId")
    const courseId = url.searchParams.get("courseId")

    // Récupérer l'utilisateur actuel
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: { id: true, role: true, establishmentId: true },
    })

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Vérifier si l'utilisateur est l'élève lui-même
    const isStudent = user.id === studentId
    console.log(`Vérification si l'utilisateur est l'élève: ${isStudent}`)

    // Vérifier si l'utilisateur est un professeur de l'établissement
    const isProfessor = user.role === "PROFESSEUR"
    console.log(`Vérification si l'utilisateur est un professeur: ${isProfessor}`)

    // Vérifier si l'utilisateur est un administrateur
    const isAdmin = user.role === "ADMINISTRATION"
    console.log(`Vérification si l'utilisateur est un administrateur: ${isAdmin}`)

    // Vérifier si l'utilisateur est un parent de l'élève
    let isParentOfStudent = false
    if (user.role === "PARENT") {
      // Vérifier si l'utilisateur est un parent de l'élève
      const parentChildRelation = await prisma.parentChild.findFirst({
        where: {
          parentId: user.id,
          childId: studentId,
        },
      })
      isParentOfStudent = !!parentChildRelation
      console.log(`Vérification si l'utilisateur est un parent de l'élève: ${isParentOfStudent}`)
      console.log(`Relation parent-enfant: ${JSON.stringify(parentChildRelation)}`)
    }

    // Si l'utilisateur n'est pas autorisé à accéder aux notes de cet élève
    if (!isStudent && !isProfessor && !isAdmin && !isParentOfStudent) {
      console.log("Accès refusé: l'utilisateur n'est pas autorisé à accéder aux notes de cet élève")
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    // Construire la requête pour récupérer les notes
    const whereClause: any = {
      studentId,
    }

    if (periodId) {
      whereClause.evaluation = {
        periodId,
      }
    }

    if (courseId) {
      whereClause.evaluation = {
        ...(whereClause.evaluation || {}),
        courseId,
      }
    }

    // Si c'est un élève ou un parent, ne montrer que les notes des évaluations publiées
    if (isStudent || isParentOfStudent) {
      whereClause.evaluation = {
        ...(whereClause.evaluation || {}),
        isPublished: true,
      }
    }

    // Récupérer les notes
    const grades = await prisma.grade.findMany({
      where: whereClause,
      include: {
        evaluation: {
          include: {
            course: {
              select: {
                id: true,
                name: true,
                coefficient: true,
                professor: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
            period: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        gradedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        {
          evaluation: {
            date: "desc",
          },
        },
        {
          createdAt: "desc",
        },
      ],
    })

    return NextResponse.json(grades)
  } catch (error) {
    console.error("Erreur lors de la récupération des notes:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
