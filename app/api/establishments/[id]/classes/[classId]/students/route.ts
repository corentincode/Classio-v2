import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get all students in a class
export async function GET(request: Request, { params }: { params: { id: string; classId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const { id, classId } = params

    // Vérifier si la classe existe
    const classData = await prisma.class.findUnique({
      where: { id: classId },
    })

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    // Vérifier si la classe appartient à l'établissement spécifié
    if (classData.establishmentId !== id) {
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
      user.establishmentId === id ||
      user.teachingAt.some((t) => t.establishmentId === id)

    if (!hasAccess) {
      return NextResponse.json({ error: "Not authorized to access this class" }, { status: 403 })
    }

    // Récupérer les étudiants de la classe
    const students = await prisma.studentClass.findMany({
      where: { classId: classId },
      include: {
        student: {
          select: {
            id: true,
            email: true,
            lastLogin: true,
            createdAt: true,
          },
        },
      },
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "An error occurred while fetching students" }, { status: 500 })
  }
}

// Add a student to a class
export async function POST(request: Request, { params }: { params: { id: string; classId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const { id, classId } = params

    // Vérifier si l'utilisateur est admin ou administration
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      select: { role: true },
    })

    if (!user || (user.role !== "SUPERADMIN" && user.role !== "ADMINISTRATION")) {
      return NextResponse.json({ error: "Not authorized to add students to classes" }, { status: 403 })
    }

    // Vérifier si la classe existe
    const classData = await prisma.class.findUnique({
      where: { id: classId },
    })

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    // Vérifier si la classe appartient à l'établissement spécifié
    if (classData.establishmentId !== id) {
      return NextResponse.json({ error: "Class does not belong to the specified establishment" }, { status: 400 })
    }

    const { studentId, status } = await request.json()

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    // Vérifier si l'étudiant existe
    const student = await prisma.user.findUnique({
      where: { id: studentId },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Vérifier si l'étudiant a le rôle ELEVE
    if (student.role !== "ELEVE") {
      return NextResponse.json({ error: "User is not a student" }, { status: 400 })
    }

    // Vérifier si l'étudiant est déjà inscrit dans cette classe
    const existingEnrollment = await prisma.studentClass.findUnique({
      where: {
        studentId_classId: {
          studentId,
          classId,
        },
      },
    })

    if (existingEnrollment) {
      return NextResponse.json({ error: "Student is already enrolled in this class" }, { status: 400 })
    }

    // Vérifier si la classe a atteint sa capacité maximale
    if (classData.maxStudents) {
      const currentStudentsCount = await prisma.studentClass.count({
        where: { classId },
      })

      if (currentStudentsCount >= classData.maxStudents) {
        return NextResponse.json({ error: "Class has reached its maximum capacity" }, { status: 400 })
      }
    }

    // Inscrire l'étudiant dans la classe
    const enrollment = await prisma.studentClass.create({
      data: {
        studentId,
        classId,
        status: status || "active",
      },
    })

    // Mettre à jour l'établissement de l'étudiant si nécessaire
    if (student.establishmentId !== id) {
      await prisma.user.update({
        where: { id: studentId },
        data: { establishmentId: id },
      })
    }

    return NextResponse.json(enrollment, { status: 201 })
  } catch (error) {
    console.error("Error adding student to class:", error)
    return NextResponse.json({ error: "An error occurred while adding student to class" }, { status: 500 })
  }
}
