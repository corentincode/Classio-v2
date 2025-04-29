import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return new NextResponse("Non autorisé", { status: 401 })
    }

    // Vérifier que l'utilisateur est un administrateur
    if (session.user.role !== "ADMINISTRATION") {
      return new NextResponse("Accès refusé", { status: 403 })
    }

    const { id } = params
    const body = await request.json()
    const { status, reason, minutesLate } = body

    // Valider le statut
    if (!["PRESENT", "ABSENT", "LATE", "EXCUSED"].includes(status)) {
      return new NextResponse("Statut invalide", { status: 400 })
    }

    // Vérifier que l'enregistrement existe
    const existingRecord = await prisma.attendanceRecord.findUnique({
      where: {
        id,
      },
      include: {
        student: {
          select: {
            studentClasses: {
              select: {
                class: {
                  select: {
                    establishmentId: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!existingRecord) {
      return new NextResponse("Enregistrement non trouvé", { status: 404 })
    }

    // Vérifier que l'enregistrement appartient à l'établissement de l'administrateur
    const establishmentId = existingRecord.student.studentClasses[0]?.class.establishmentId
    if (establishmentId !== session.user.establishmentId) {
      return new NextResponse("Accès refusé", { status: 403 })
    }

    // Mettre à jour l'enregistrement
    const updatedRecord = await prisma.attendanceRecord.update({
      where: {
        id,
      },
      data: {
        status,
        reason: reason || null,
        minutesLate: status === "LATE" ? minutesLate : null,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedRecord)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'enregistrement d'assiduité:", error)
    return new NextResponse("Erreur interne du serveur", { status: 500 })
  }
}
