import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Récupérer toutes les évaluations d'un cours
export async function GET(request: Request, { params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Récupérer le cours
    const course = await prisma.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        class: {
          select: {
            establishmentId: true,
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Vérifier si l'utilisateur a accès à ce cours
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
        studentClasses: {
          select: {
            classId: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Vérifier les droits d'accès
    const isAdmin = user.role === "SUPERADMIN" || user.role === "ADMINISTRATION"
    const isProfessor = user.role === "PROFESSEUR" && course.professorId === user.id
    const isStudentInClass = user.role === "ELEVE" && user.studentClasses.some((sc) => sc.classId === course.classId)
    const isParent = user.role === "PARENT" // Les parents peuvent voir les évaluations de leurs enfants

    if (!isAdmin && !isProfessor && !isStudentInClass && !isParent) {
      return NextResponse.json({ error: "Not authorized to access this course" }, { status: 403 })
    }

    // Récupérer les évaluations
    const evaluations = await prisma.evaluation.findMany({
      where: {
        courseId: params.courseId,
        // Si c'est un élève ou un parent, ne montrer que les évaluations publiées
        ...(isStudentInClass || isParent ? { isPublished: true } : {}),
      },
      include: {
        period: true,
        _count: {
          select: {
            grades: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    })

    return NextResponse.json(evaluations)
  } catch (error) {
    console.error("Error fetching evaluations:", error)
    return NextResponse.json({ error: "An error occurred while fetching evaluations" }, { status: 500 })
  }
}

// Créer une nouvelle évaluation
export async function POST(request: Request, { params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Récupérer le cours
    const course = await prisma.course.findUnique({
      where: {
        id: params.courseId,
      },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Vérifier si l'utilisateur est le professeur du cours ou un administrateur
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      select: {
        id: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isAdmin = user.role === "SUPERADMIN" || user.role === "ADMINISTRATION"
    const isProfessor = user.role === "PROFESSEUR" && course.professorId === user.id

    if (!isAdmin && !isProfessor) {
      return NextResponse.json({ error: "Not authorized to create evaluations for this course" }, { status: 403 })
    }

    const { title, description, type, date, maxGrade, coefficient, periodId, isPublished } = await request.json()

    // Créer l'évaluation
    const newEvaluation = await prisma.evaluation.create({
      data: {
        title,
        description,
        type,
        date: new Date(date),
        maxGrade: maxGrade || 20.0,
        coefficient: coefficient || 1.0,
        isPublished: isPublished || false,
        course: {
          connect: { id: params.courseId },
        },
        createdBy: {
          connect: { id: user.id },
        },
        ...(periodId
          ? {
              period: {
                connect: { id: periodId },
              },
            }
          : {}),
      },
    })

    return NextResponse.json(newEvaluation)
  } catch (error) {
    console.error("Error creating evaluation:", error)
    return NextResponse.json({ error: "An error occurred while creating the evaluation" }, { status: 500 })
  }
}
