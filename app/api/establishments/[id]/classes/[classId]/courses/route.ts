import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get all courses for a class
export async function GET(request: Request, { params }: { params: { id: string; classId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Vérifier si la classe existe
    const classData = await prisma.class.findUnique({
      where: { id: params.classId },
    })

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    // Vérifier si la classe appartient à l'établissement spécifié
    if (classData.establishmentId !== params.id) {
      return NextResponse.json({ error: "Class does not belong to the specified establishment" }, { status: 400 })
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
      user.role === "ADMINISTRATION" ||
      user.establishmentId === params.id ||
      user.teachingAt.some((t) => t.establishmentId === params.id)

    if (!hasAccess) {
      return NextResponse.json({ error: "Not authorized to access this class" }, { status: 403 })
    }

    // Récupérer les cours de la classe
    const courses = await prisma.course.findMany({
      where: { classId: params.classId },
      include: {
        professor: {
          select: {
            id: true,
            email: true,
          },
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json({ error: "An error occurred while fetching courses" }, { status: 500 })
  }
}

// Create a new course for a class
export async function POST(request: Request, { params }: { params: { id: string; classId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Vérifier si l'utilisateur est admin, administration ou professeur
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      select: { id: true, role: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isAdmin = user.role === "SUPERADMIN" || user.role === "ADMINISTRATION"
    const isProfessor = user.role === "PROFESSEUR"

    if (!isAdmin && !isProfessor) {
      return NextResponse.json({ error: "Not authorized to create courses" }, { status: 403 })
    }

    // Vérifier si la classe existe
    const classData = await prisma.class.findUnique({
      where: { id: params.classId },
    })

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    // Vérifier si la classe appartient à l'établissement spécifié
    if (classData.establishmentId !== params.id) {
      return NextResponse.json({ error: "Class does not belong to the specified establishment" }, { status: 400 })
    }

    const { name, description, color, professorId } = await request.json()

    // Valider les données requises
    if (!name) {
      return NextResponse.json({ error: "Course name is required" }, { status: 400 })
    }

    // Déterminer le professeur
    let actualProfessorId = professorId

    // Si l'utilisateur est un professeur et qu'aucun professorId n'est spécifié, utiliser l'ID de l'utilisateur
    if (isProfessor && !professorId) {
      actualProfessorId = user.id
    } else if (isProfessor && professorId !== user.id) {
      // Un professeur ne peut pas créer un cours pour un autre professeur
      return NextResponse.json({ error: "Not authorized to create courses for other professors" }, { status: 403 })
    } else if (isAdmin && !professorId) {
      // Un admin doit spécifier un professeur
      return NextResponse.json({ error: "Professor ID is required" }, { status: 400 })
    }

    // Vérifier si le professeur existe
    const professor = await prisma.user.findUnique({
      where: { id: actualProfessorId },
    })

    if (!professor) {
      return NextResponse.json({ error: "Professor not found" }, { status: 404 })
    }

    // Vérifier si le professeur a le rôle PROFESSEUR
    if (professor.role !== "PROFESSEUR") {
      return NextResponse.json({ error: "User is not a professor" }, { status: 400 })
    }

    // Vérifier si un cours avec le même nom existe déjà pour cette classe et ce professeur
    const existingCourse = await prisma.course.findFirst({
      where: {
        name,
        classId: params.classId,
        professorId: actualProfessorId,
      },
    })

    if (existingCourse) {
      return NextResponse.json(
        { error: "A course with this name already exists for this class and professor" },
        { status: 400 },
      )
    }

    // Créer le cours
    const course = await prisma.course.create({
      data: {
        name,
        description,
        color,
        classId: params.classId,
        professorId: actualProfessorId,
      },
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json({ error: "An error occurred while creating the course" }, { status: 500 })
  }
}
