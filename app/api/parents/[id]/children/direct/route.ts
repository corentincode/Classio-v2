import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

// Créer une nouvelle instance de PrismaClient pour éviter les problèmes de cache
const prisma = new PrismaClient()

// Récupérer les enfants d'un parent (méthode alternative avec SQL brut)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Vérifier les autorisations (seul le parent lui-même ou un administrateur peut accéder)
    if (session.user.role !== "ADMINISTRATION" && session.user.id !== params.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    // Log pour le débogage
    console.log(`Récupération directe des enfants pour le parent ID: ${params.id}`)

    // Utiliser une requête SQL brute pour récupérer les enfants
    const children = await prisma.$queryRaw`
      SELECT 
        pc.id, 
        pc."parentId", 
        pc."childId", 
        pc.relationship, 
        pc."isPrimary",
        c.id as "child_id", 
        c.email as "child_email", 
        c.name as "child_name",
        c.role as "child_role"
      FROM "ParentChild" pc
      JOIN "User" c ON pc."childId" = c.id
      WHERE pc."parentId" = ${params.id}
    `

    // Log pour le débogage
    console.log(`Nombre d'enfants trouvés (méthode directe): ${Array.isArray(children) ? children.length : 0}`)
    if (Array.isArray(children) && children.length > 0) {
      console.log("IDs des enfants (méthode directe):", children.map((c: any) => c.childId).join(", "))
    }

    return NextResponse.json(children)
  } catch (error) {
    console.error("Erreur lors de la récupération directe des enfants:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
