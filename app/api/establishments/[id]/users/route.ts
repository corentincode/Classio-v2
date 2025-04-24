import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Récupérer les utilisateurs d'un établissement
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const role = searchParams.get("role")

  try {
    // Vérifier si l'établissement existe
    const establishment = await prisma.establishment.findUnique({
      where: { id: params.id },
    })

    if (!establishment) {
      return NextResponse.json({ error: "Establishment not found" }, { status: 404 })
    }

    // Récupérer les utilisateurs de l'établissement
    const users = await prisma.user.findMany({
      where: {
        establishmentId: params.id,
        ...(role ? { role: role as any } : {}),
      },
      select: {
        id: true,
        email: true,
        role: true,
        lastLogin: true,
        createdAt: true,
      },
      orderBy: { email: "asc" },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "An error occurred while fetching users" }, { status: 500 })
  }
}

// Ajouter un utilisateur à un établissement
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Vérifier si l'utilisateur est admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      select: { role: true },
    })

    if (currentUser?.role !== "SUPERADMIN" && currentUser?.role !== "ADMINISTRATION") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Vérifier si l'établissement existe
    const establishment = await prisma.establishment.findUnique({
      where: { id: params.id },
    })

    if (!establishment) {
      return NextResponse.json({ error: "Establishment not found" }, { status: 404 })
    }

    const { userId, role } = await request.json()

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Si l'utilisateur est un professeur, ajouter une relation dans EstablishmentProfessor
    if (role === "PROFESSEUR") {
      // Vérifier si la relation existe déjà
      const existingRelation = await prisma.establishmentProfessor.findUnique({
        where: {
          professorId_establishmentId: {
            professorId: userId,
            establishmentId: params.id,
          },
        },
      })

      if (existingRelation) {
        return NextResponse.json({ error: "Professor is already associated with this establishment" }, { status: 400 })
      }

      // Mettre à jour le rôle de l'utilisateur si nécessaire
      if (user.role !== "PROFESSEUR") {
        await prisma.user.update({
          where: { id: userId },
          data: { role: "PROFESSEUR" },
        })
      }

      // Créer la relation
      await prisma.establishmentProfessor.create({
        data: {
          professorId: userId,
          establishmentId: params.id,
        },
      })
    } else {
      // Pour les autres rôles, mettre à jour l'utilisateur
      await prisma.user.update({
        where: { id: userId },
        data: {
          role: role as any,
          establishmentId: params.id,
        },
      })
    }

    return NextResponse.json({ message: "User added to establishment successfully" })
  } catch (error) {
    console.error("Error adding user to establishment:", error)
    return NextResponse.json({ error: "An error occurred while adding user to establishment" }, { status: 500 })
  }
}
