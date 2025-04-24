import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Update a student's enrollment in a class
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; classId: string; studentId: string } },
) {
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
      return NextResponse.json({ error: "Not authorized to update student enrollments" }, { status: 403 })
    }

    // Vérifier si l'inscription existe
    const enrollment = await prisma.studentClass.findUnique({
      where: {
        studentId_classId: {
          studentId: params.studentId,
          classId: params.classId,
        },
      },
      include: {
        class: true,
      },
    })

    if (!enrollment) {
      return NextResponse.json({ error: "Student enrollment not found" }, { status: 404 })
    }

    // Vérifier si la classe appartient à l'établissement spécifié
    if (enrollment.class.establishmentId !== params.id) {
      return NextResponse.json({ error: "Class does not belong to the specified establishment" }, { status: 400 })
    }

    const { status } = await request.json()

    // Mettre à jour l'inscription
    const updatedEnrollment = await prisma.studentClass.update({
      where: {
        studentId_classId: {
          studentId: params.studentId,
          classId: params.classId,
        },
      },
      data: {
        status: status || undefined,
      },
    })

    return NextResponse.json(updatedEnrollment)
  } catch (error) {
    console.error("Error updating student enrollment:", error)
    return NextResponse.json({ error: "An error occurred while updating student enrollment" }, { status: 500 })
  }
}

// Remove a student from a class
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; classId: string; studentId: string } },
) {
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
      return NextResponse.json({ error: "Not authorized to remove students from classes" }, { status: 403 })
    }

    // Vérifier si l'inscription existe
    const enrollment = await prisma.studentClass.findUnique({
      where: {
        studentId_classId: {
          studentId: params.studentId,
          classId: params.classId,
        },
      },
      include: {
        class: true,
      },
    })

    if (!enrollment) {
      return NextResponse.json({ error: "Student enrollment not found" }, { status: 404 })
    }

    // Vérifier si la classe appartient à l'établissement spécifié
    if (enrollment.class.establishmentId !== params.id) {
      return NextResponse.json({ error: "Class does not belong to the specified establishment" }, { status: 400 })
    }

    // Supprimer l'inscription
    await prisma.studentClass.delete({
      where: {
        studentId_classId: {
          studentId: params.studentId,
          classId: params.classId,
        },
      },
    })

    return NextResponse.json({ message: "Student removed from class successfully" })
  } catch (error) {
    console.error("Error removing student from class:", error)
    return NextResponse.json({ error: "An error occurred while removing student from class" }, { status: 500 })
  }
}
