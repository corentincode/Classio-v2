import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

// Créer une nouvelle instance de PrismaClient pour éviter les problèmes de cache
const prisma = new PrismaClient()

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

    // Vérifier si l'utilisateur est un parent de l'élève (méthode SQL directe)
    let isParentOfStudent = false
    if (user.role === "PARENT") {
      const parentChildRelation = await prisma.$queryRaw`
        SELECT * FROM "ParentChild"
        WHERE "parentId" = ${user.id} AND "childId" = ${studentId}
      `
      isParentOfStudent = Array.isArray(parentChildRelation) && parentChildRelation.length > 0
      console.log(`Vérification si l'utilisateur est un parent de l'élève (méthode directe): ${isParentOfStudent}`)
      console.log(`Relation parent-enfant (méthode directe): ${JSON.stringify(parentChildRelation)}`)
    }

    // Si l'utilisateur n'est pas autorisé à accéder aux notes de cet élève
    if (!isStudent && !isProfessor && !isAdmin && !isParentOfStudent) {
      console.log("Accès refusé: l'utilisateur n'est pas autorisé à accéder aux notes de cet élève")
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    // Construire la requête SQL pour récupérer les notes
    let sql = `
      SELECT 
        g.id, 
        g."studentId", 
        g."evaluationId", 
        g.value, 
        g.comment,
        e.title as "evaluation_title",
        e.description as "evaluation_description",
        e."maxGrade" as "evaluation_maxGrade",
        e."isPublished" as "evaluation_isPublished",
        c.name as "course_name",
        c.coefficient as "course_coefficient",
        p.name as "period_name"
      FROM "Grade" g
      JOIN "Evaluation" e ON g."evaluationId" = e.id
      JOIN "Course" c ON e."courseId" = c.id
      LEFT JOIN "PeriodConfig" p ON e."periodId" = p.id
      WHERE g."studentId" = ${studentId}
    `

    // Ajouter des conditions supplémentaires
    if (periodId) {
      sql += ` AND e."periodId" = ${periodId}`
    }

    if (courseId) {
      sql += ` AND e."courseId" = ${courseId}`
    }

    // Si c'est un élève ou un parent, ne montrer que les notes des évaluations publiées
    if (isStudent || isParentOfStudent) {
      sql += ` AND e."isPublished" = true`
    }

    // Ajouter l'ordre
    sql += ` ORDER BY e.date DESC, g."createdAt" DESC`

    // Exécuter la requête SQL
    const grades = await prisma.$queryRaw`${sql}`

    return NextResponse.json(grades)
  } catch (error) {
    console.error("Erreur lors de la récupération des notes:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
