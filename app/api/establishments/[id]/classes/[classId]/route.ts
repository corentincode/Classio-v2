import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get a specific class
export async function GET(request: Request, { params }: { params: { id: string; classId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Vérifier si la classe existe
    const classData = await prisma.class.findUnique({
      where: { id: params.classId },
      include: {
        _count: {
          select: {
            students: true,
            courses: true,
          },
        },
      },
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
      user.establishmentId === params.id ||
      user.teachingAt.some((t) => t.establishmentId === params.id)

    if (!hasAccess) {
      return NextResponse.json({ error: "Not authorized to access this class" }, { status: 403 })
    }

    return NextResponse.json(classData)
  } catch (error) {
    console.error("Error fetching class:", error)
    return NextResponse.json({ error: "An error occurred while fetching the class" }, { status: 500 })
  }
}

// Update a class
export async function PATCH(request: Request, { params }: { params: { id: string; classId: string } }) {
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
      return NextResponse.json({ error: "Not authorized to update classes" }, { status: 403 })
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

    const { name, level, section, schoolYear, description, maxStudents } = await request.json()

    // Vérifier si le nom est modifié et s'il existe déjà une autre classe avec ce nom
    if (name && name !== classData.name) {
      const existingClass = await prisma.class.findFirst({
        where: {
          name,
          establishmentId: params.id,
          schoolYear: schoolYear || classData.schoolYear,
          id: { not: params.classId }, // Exclure la classe actuelle
        },
      })

      if (existingClass) {
        return NextResponse.json(
          { error: "A class with this name already exists for this school year" },
          { status: 400 },
        )
      }
    }

    // Mettre à jour la classe
    const updatedClass = await prisma.class.update({
      where: { id: params.classId },
      data: {
        name: name || undefined,
        level: level || undefined,
        section: section || undefined,
        schoolYear: schoolYear || undefined,
        description: description !== undefined ? description : undefined,
        maxStudents: maxStudents !== undefined ? maxStudents : undefined,
      },
    })

    return NextResponse.json(updatedClass)
  } catch (error) {
    console.error("Error updating class:", error)
    return NextResponse.json({ error: "An error occurred while updating the class" }, { status: 500 })
  }
}

// Delete a class
export async function DELETE(request: Request, { params }: { params: { id: string; classId: string } }) {
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
      return NextResponse.json({ error: "Not authorized to delete classes" }, { status: 403 })
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

    // Supprimer la classe
    await prisma.class.delete({
      where: { id: params.classId },
    })

    return NextResponse.json({ message: "Class deleted successfully" })
  } catch (error) {
    console.error("Error deleting class:", error)
    return NextResponse.json({ error: "An error occurred while deleting the class" }, { status: 500 })
  }
}
