import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get all classes for an establishment
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Vérifier si l'établissement existe
    const establishment = await prisma.establishment.findUnique({
      where: { id: params.id },
    })

    if (!establishment) {
      return NextResponse.json({ error: "Establishment not found" }, { status: 404 })
    }

    // Vérifier si l'utilisateur a accès à cet établissement
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      select: {
        id: true,
        role: true,
        establishmentId: true,
        teachingAt: {
          select: {
            establishmentId: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Vérifier les droits d'accès
    const hasAccess =
      user.role === "SUPERADMIN" ||
      user.establishmentId === params.id ||
      user.teachingAt.some((t) => t.establishmentId === params.id)

    if (!hasAccess) {
      return NextResponse.json({ error: "Not authorized to access this establishment" }, { status: 403 })
    }

    // Récupérer les classes de l'établissement
    const classes = await prisma.class.findMany({
      where: { establishmentId: params.id },
      include: {
        _count: {
          select: {
            students: true,
            courses: true,
          },
        },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(classes)
  } catch (error) {
    console.error("Error fetching classes:", error)
    return NextResponse.json({ error: "An error occurred while fetching classes" }, { status: 500 })
  }
}

// Create a new class for an establishment
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Vérifier si l'utilisateur est admin ou administration
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      select: { role: true },
    })

    if (!user || (user.role !== "SUPERADMIN" && user.role !== "ADMINISTRATION")) {
      return NextResponse.json({ error: "Not authorized to create classes" }, { status: 403 })
    }

    // Vérifier si l'établissement existe
    const establishment = await prisma.establishment.findUnique({
      where: { id: params.id },
    })

    if (!establishment) {
      return NextResponse.json({ error: "Establishment not found" }, { status: 404 })
    }

    const { name, level, section, schoolYear, description, maxStudents } = await request.json()

    // Valider les données requises
    if (!name || !level || !schoolYear) {
      return NextResponse.json({ error: "Name, level, and school year are required" }, { status: 400 })
    }

    // Vérifier si une classe avec le même nom existe déjà pour cet établissement et cette année scolaire
    const existingClass = await prisma.class.findFirst({
      where: {
        name,
        establishmentId: params.id,
        schoolYear,
      },
    })

    if (existingClass) {
      return NextResponse.json({ error: "A class with this name already exists for this school year" }, { status: 400 })
    }

    // Créer la classe
    const newClass = await prisma.class.create({
      data: {
        name,
        level,
        section,
        schoolYear,
        description,
        maxStudents,
        establishmentId: params.id,
      },
    })

    return NextResponse.json(newClass, { status: 201 })
  } catch (error) {
    console.error("Error creating class:", error)
    return NextResponse.json({ error: "An error occurred while creating the class" }, { status: 500 })
  }
}
