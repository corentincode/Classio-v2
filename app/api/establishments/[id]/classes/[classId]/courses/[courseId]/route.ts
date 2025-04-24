import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Récupérer, mettre à jour ou supprimer un cours spécifique
export async function GET(request: Request, { params }: { params: { id: string; classId: string; courseId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
      include: {
        professor: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Vérifier si le cours appartient à la classe spécifiée
    if (course.classId !== params.classId) {
      return NextResponse.json({ error: "Course does not belong to the specified class" }, { status: 400 })
    }

    // Récupérer la classe pour vérifier l'établissement
    const classData = await prisma.class.findUnique({
      where: { id: params.classId },
    })

    if (!classData || classData.establishmentId !== params.id) {
      return NextResponse.json({ error: "Class not found or does not belong to the establishment" }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error("Error fetching course:", error)
    return NextResponse.json({ error: "An error occurred while fetching the course" }, { status: 500 })
  }
}

// Mettre à jour un cours
export async function PUT(request: Request, { params }: { params: { id: string; classId: string; courseId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Vérifier si le cours existe
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Vérifier si le cours appartient à la classe spécifiée
    if (course.classId !== params.classId) {
      return NextResponse.json({ error: "Course does not belong to the specified class" }, { status: 400 })
    }

    // Récupérer la classe pour vérifier l'établissement
    const classData = await prisma.class.findUnique({
      where: { id: params.classId },
    })

    if (!classData || classData.establishmentId !== params.id) {
      return NextResponse.json({ error: "Class not found or does not belong to the establishment" }, { status: 404 })
    }

    // Vérifier les permissions
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      select: { id: true, role: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isAdmin = user.role === "SUPERADMIN" || user.role === "ADMINISTRATION"
    const isProfessor = user.role === "PROFESSEUR" && course.professorId === user.id

    if (!isAdmin && !isProfessor) {
      return NextResponse.json({ error: "Not authorized to update this course" }, { status: 403 })
    }

    const { name, description, color, professorId } = await request.json()

    // Valider les données requises
    if (!name) {
      return NextResponse.json({ error: "Course name is required" }, { status: 400 })
    }

    // Si un professeur veut modifier le professorId, vérifier qu'il est admin
    if (professorId && professorId !== course.professorId && !isAdmin) {
      return NextResponse.json({ error: "Not authorized to change the professor" }, { status: 403 })
    }

    // Mettre à jour le cours
    const updatedCourse = await prisma.course.update({
      where: { id: params.courseId },
      data: {
        name,
        description,
        color,
        ...(professorId && { professorId }),
      },
      include: {
        professor: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.error("Error updating course:", error)
    return NextResponse.json({ error: "An error occurred while updating the course" }, { status: 500 })
  }
}

// Supprimer un cours
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; classId: string; courseId: string } },
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Vérifier si le cours existe
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Vérifier si le cours appartient à la classe spécifiée
    if (course.classId !== params.classId) {
      return NextResponse.json({ error: "Course does not belong to the specified class" }, { status: 400 })
    }

    // Récupérer la classe pour vérifier l'établissement
    const classData = await prisma.class.findUnique({
      where: { id: params.classId },
    })

    if (!classData || classData.establishmentId !== params.id) {
      return NextResponse.json({ error: "Class not found or does not belong to the establishment" }, { status: 404 })
    }

    // Vérifier les permissions
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      select: { id: true, role: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isAdmin = user.role === "SUPERADMIN" || user.role === "ADMINISTRATION"
    const isProfessor = user.role === "PROFESSEUR" && course.professorId === user.id

    if (!isAdmin && !isProfessor) {
      return NextResponse.json({ error: "Not authorized to delete this course" }, { status: 403 })
    }

    // Supprimer le cours (cela supprimera aussi toutes les sessions associées grâce à onDelete: Cascade)
    await prisma.course.delete({
      where: { id: params.courseId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting course:", error)
    return NextResponse.json({ error: "An error occurred while deleting the course" }, { status: 500 })
  }
}
