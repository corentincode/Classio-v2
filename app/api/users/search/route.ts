// app/api/users/search/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const role = searchParams.get("role")
    const establishmentId = searchParams.get("establishmentId")

    if (query.length < 2) {
      return NextResponse.json([])
    }

    console.log("Recherche d'utilisateurs:", { query, role, establishmentId })

    const whereClause: any = {
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
      id: {
        not: session.user.id, // Exclure l'utilisateur actuel
      },
    }

    // Filtrer par rôle si spécifié
    if (role) {
      whereClause.role = role
    }

    // Filtrer par établissement si spécifié
    if (establishmentId) {
      // Pour les professeurs, nous devons vérifier dans la table EstablishmentProfessor
      if (role === "PROFESSEUR") {
        whereClause.OR = [
          ...whereClause.OR,
          {
            professorEstablishments: {
              some: {
                establishmentId,
              },
            },
          },
        ]
      } else {
        // Pour les autres rôles, nous vérifions directement l'establishmentId
        whereClause.establishmentId = establishmentId
      }
    }

    // app/api/users/search/route.ts
    // Dans la fonction GET, ajoutez cette logique pour les professeurs

    // Si l'utilisateur est un professeur et qu'un establishmentId est fourni
    if (session.user.role === "PROFESSEUR" && establishmentId) {
        // Vérifier si le professeur a accès à cet établissement
        const professorEstablishment = await prisma.establishmentProfessor.findFirst({
        where: {
            professorId: session.user.id,
            establishmentId,
        },
        });
    
        if (!professorEstablishment) {
        return NextResponse.json({ error: "Accès non autorisé à cet établissement" }, { status: 403 });
        }
    }
    
    // Pour la recherche des utilisateurs dans un établissement spécifique
    if (establishmentId) {
        // Pour les professeurs, nous devons vérifier dans la table EstablishmentProfessor
        if (role === "PROFESSEUR") {
        whereClause.professorEstablishments = {
            some: {
            establishmentId,
            },
        };
        } else {
        // Pour les autres rôles, nous vérifions directement l'establishmentId
        whereClause.establishmentId = establishmentId;
        }
    }

    console.log("Clause WHERE:", JSON.stringify(whereClause, null, 2))

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      take: 10,
    })

    console.log(`Utilisateurs trouvés: ${users.length}`)
    return NextResponse.json(users)
  } catch (error) {
    console.error("Erreur lors de la recherche d'utilisateurs:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}