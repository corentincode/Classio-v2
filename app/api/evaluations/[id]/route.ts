import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Récupérer une évaluation spécifique
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Récupérer l'évaluation
    const evaluation = await prisma.evaluation.findUnique({
      where: {
        id: params.id,
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            professorId: true,
            classId: true,
            class: {
              select: {
                id: true,
                name: true,
                establishmentId: true,
              },
            },
          },
        },
        period: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!evaluation) {
      return NextResponse.json({ error: "Evaluation not found" }, { status: 404 })
    }

    // Vérifier si l'utilisateur a accès à cette évaluation
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
    const isProfessor = user.role === "PROFESSEUR" && evaluation.course.professorId === user.id
    const isStudentInClass =
      user.role === "ELEVE" && user.studentClasses.some((sc) => sc.classId === evaluation.course.classId)
    const isParent = user.role === "PARENT" // Les parents peuvent voir les évaluations de leurs enfants

    if (!isAdmin && !isProfessor && !isStudentInClass && !isParent) {
      return NextResponse.json({ error: "Not authorized to access this evaluation" }, { status: 403 })
    }

    // Si c'est un élève ou un parent, vérifier si l'évaluation est publiée
    if ((isStudentInClass || isParent) && !evaluation.isPublished) {
      return NextResponse.json({ error: "This evaluation is not published yet" }, { status: 403 })
    }

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error("Error fetching evaluation:", error)
    return NextResponse.json({ error: "An error occurred while fetching the evaluation" }, { status: 500 })
  }
}

// Mettre à jour une évaluation
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Récupérer l'évaluation
    const evaluation = await prisma.evaluation.findUnique({
      where: {
        id: params.id,
      },
      include: {
        course: {
          select: {
            professorId: true,
          },
        },
      },
    })

    if (!evaluation) {
      return NextResponse.json({ error: "Evaluation not found" }, { status: 404 })
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
    const isProfessor = user.role === "PROFESSEUR" && evaluation.course.professorId === user.id

    if (!isAdmin && !isProfessor) {
      return NextResponse.json({ error: "Not authorized to update this evaluation" }, { status: 403 })
    }

    const { title, description, type, date, maxGrade, coefficient, periodId, isPublished } = await request.json()

    // Mettre à jour l'évaluation
    const updatedEvaluation = await prisma.evaluation.update({
      where: {
        id: params.id,
      },
      data: {
        title: title || undefined,
        description: description !== undefined ? description : undefined,
        type: type || undefined,
        date: date ? new Date(date) : undefined,
        maxGrade: maxGrade !== undefined ? maxGrade : undefined,
        coefficient: coefficient !== undefined ? coefficient : undefined,
        isPublished: isPublished !== undefined ? isPublished : undefined,
        ...(periodId !== undefined
          ? periodId
            ? {
                period: {
                  connect: { id: periodId },
                },
              }
            : {
                period: {
                  disconnect: true,
                },
              }
          : {}),
      },
    })

    return NextResponse.json(updatedEvaluation)
  } catch (error) {
    console.error("Error updating evaluation:", error)
    return NextResponse.json({ error: "An error occurred while updating the evaluation" }, { status: 500 })
  }
}

// Supprimer une évaluation
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Récupérer l'évaluation
    const evaluation = await prisma.evaluation.findUnique({
      where: {
        id: params.id,
      },
      include: {
        course: {
          select: {
            professorId: true,
          },
        },
      },
    })

    if (!evaluation) {
      return NextResponse.json({ error: "Evaluation not found" }, { status: 404 })
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
    const isProfessor = user.role === "PROFESSEUR" && evaluation.course.professorId === user.id

    if (!isAdmin && !isProfessor) {
      return NextResponse.json({ error: "Not authorized to delete this evaluation" }, { status: 403 })
    }

    // Supprimer l'évaluation (cela supprimera également toutes les notes associées grâce à la cascade)
    await prisma.evaluation.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: "Evaluation deleted successfully" })
  } catch (error) {
    console.error("Error deleting evaluation:", error)
    return NextResponse.json({ error: "An error occurred while deleting the evaluation" }, { status: 500 })
  }
}
