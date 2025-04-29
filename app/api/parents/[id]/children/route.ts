import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// Récupérer les enfants d'un parent
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
    console.log(`Récupération des enfants pour le parent ID: ${params.id}`)

    const children = await prisma.parentChild.findMany({
      where: {
        parentId: params.id,
      },
      include: {
        child: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            studentClasses: {
              include: {
                class: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    // Log pour le débogage
    console.log(`Nombre d'enfants trouvés: ${children.length}`)
    if (children.length > 0) {
      console.log("IDs des enfants:", children.map((c) => c.childId).join(", "))
    }

    return NextResponse.json(children)
  } catch (error) {
    console.error("Erreur lors de la récupération des enfants:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// Ajouter un enfant à un parent
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Vérifier les autorisations (seul le parent lui-même ou un administrateur peut ajouter)
    if (session.user.role !== "ADMINISTRATION" && session.user.id !== params.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    const { childId, relationship } = await request.json()

    if (!childId) {
      return NextResponse.json({ error: "ID de l'enfant requis" }, { status: 400 })
    }

    // Vérifier si l'enfant existe et est un élève
    const child = await prisma.user.findUnique({
      where: {
        id: childId,
        role: "ELEVE",
      },
    })

    if (!child) {
      return NextResponse.json({ error: "Élève non trouvé" }, { status: 404 })
    }

    // Vérifier si la relation existe déjà
    const existingRelation = await prisma.parentChild.findFirst({
      where: {
        parentId: params.id,
        childId,
      },
    })

    if (existingRelation) {
      return NextResponse.json({ error: "Cet élève est déjà associé à ce parent" }, { status: 400 })
    }

    // Log pour le débogage
    console.log(`Création d'une relation parent-enfant: Parent=${params.id}, Enfant=${childId}`)

    // Créer la relation parent-enfant
    const parentChild = await prisma.parentChild.create({
      data: {
        parentId: params.id,
        childId,
        relationship: relationship || "parent",
      },
      include: {
        child: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            studentClasses: {
              include: {
                class: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    // Log pour le débogage
    console.log(`Relation parent-enfant créée avec succès: ID=${parentChild.id}`)

    return NextResponse.json(parentChild)
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un enfant:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
