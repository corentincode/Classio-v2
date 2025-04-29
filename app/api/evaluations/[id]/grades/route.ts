import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Récupérer toutes les notes d'une évaluation
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
        children: {
          select: {
            childId: true,
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
    const isParent = user.role === "PARENT"

    if (!isAdmin && !isProfessor && !isStudentInClass && !isParent) {
      return NextResponse.json({ error: "Not authorized to access grades for this evaluation" }, { status: 403 })
    }

    // Si c'est un élève, ne montrer que sa propre note
    if (isStudentInClass) {
      const grade = await prisma.grade.findUnique({
        where: {
          studentId_evaluationId: {
            studentId: user.id,
            evaluationId: params.id,
          },
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      return NextResponse.json(grade ? [grade] : [])
    }

    // Si c'est un parent, ne montrer que les notes de ses enfants
    if (isParent) {
      const childrenIds = user.children.map((child) => child.childId)
      const grades = await prisma.grade.findMany({
        where: {
          evaluationId: params.id,
          studentId: {
            in: childrenIds,
          },
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      return NextResponse.json(grades)
    }

    // Pour les professeurs et les administrateurs, montrer toutes les notes
    const grades = await prisma.grade.findMany({
      where: {
        evaluationId: params.id,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Si c'est le professeur du cours, inclure également les élèves sans note
    if (isProfessor || isAdmin) {
      // Récupérer tous les élèves de la classe
      const students = await prisma.studentClass.findMany({
        where: {
          classId: evaluation.course.classId,
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      // Créer un map des élèves qui ont déjà une note
      const gradedStudentIds = new Set(grades.map((grade) => grade.studentId))

      // Ajouter les élèves sans note
      const studentsWithoutGrades = students
        .filter((sc) => !gradedStudentIds.has(sc.studentId))
        .map((sc) => ({
          id: null,
          value: null,
          comment: null,
          isAbsent: false,
          isExcused: false,
          createdAt: null,
          updatedAt: null,
          studentId: sc.studentId,
          evaluationId: params.id,
          gradedById: null,
          student: sc.student,
        }))

      return NextResponse.json([...grades, ...studentsWithoutGrades])
    }

    return NextResponse.json(grades)
  } catch (error) {
    console.error("Error fetching grades:", error)
    return NextResponse.json({ error: "An error occurred while fetching grades" }, { status: 500 })
  }
}

// Créer ou mettre à jour des notes pour une évaluation
export async function POST(request: Request, { params }: { params: { id: string } }) {
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
      return NextResponse.json({ error: "Not authorized to add grades for this evaluation" }, { status: 403 })
    }

    const { grades } = await request.json()

    if (!Array.isArray(grades)) {
      return NextResponse.json({ error: "Grades must be an array" }, { status: 400 })
    }

    // Créer ou mettre à jour les notes
    const results = await Promise.all(
      grades.map(async (grade) => {
        const { studentId, value, comment, isAbsent, isExcused } = grade

        // Vérifier si une note existe déjà pour cet élève
        const existingGrade = await prisma.grade.findUnique({
          where: {
            studentId_evaluationId: {
              studentId,
              evaluationId: params.id,
            },
          },
        })

        if (existingGrade) {
          // Mettre à jour la note existante
          return prisma.grade.update({
            where: {
              id: existingGrade.id,
            },
            data: {
              value,
              comment,
              isAbsent: isAbsent || false,
              isExcused: isExcused || false,
              gradedBy: {
                connect: { id: user.id },
              },
            },
          })
        } else {
          // Créer une nouvelle note
          return prisma.grade.create({
            data: {
              value,
              comment,
              isAbsent: isAbsent || false,
              isExcused: isExcused || false,
              student: {
                connect: { id: studentId },
              },
              evaluation: {
                connect: { id: params.id },
              },
              gradedBy: {
                connect: { id: user.id },
              },
            },
          })
        }
      }),
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error adding grades:", error)
    return NextResponse.json({ error: "An error occurred while adding grades" }, { status: 500 })
  }
}
