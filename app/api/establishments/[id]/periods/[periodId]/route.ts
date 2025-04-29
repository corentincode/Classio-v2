import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Récupérer une période spécifique
export async function GET(request: Request, { params }: { params: { id: string; periodId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
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

    // Récupérer la période
    const period = await prisma.periodConfig.findUnique({
      where: {
        id: params.periodId,
      },
    })

    if (!period) {
      return NextResponse.json({ error: "Period not found" }, { status: 404 })
    }

    // Vérifier si la période appartient à l'établissement spécifié
    if (period.establishmentId !== params.id) {
      return NextResponse.json({ error: "Period does not belong to the specified establishment" }, { status: 400 })
    }

    return NextResponse.json(period)
  } catch (error) {
    console.error("Error fetching period:", error)
    return NextResponse.json({ error: "An error occurred while fetching the period" }, { status: 500 })
  }
}

// Mettre à jour une période
export async function PATCH(request: Request, { params }: { params: { id: string; periodId: string } }) {
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
      return NextResponse.json({ error: "Not authorized to update periods" }, { status: 403 })
    }

    // Vérifier si la période existe
    const period = await prisma.periodConfig.findUnique({
      where: {
        id: params.periodId,
      },
    })

    if (!period) {
      return NextResponse.json({ error: "Period not found" }, { status: 404 })
    }

    // Vérifier si la période appartient à l'établissement spécifié
    if (period.establishmentId !== params.id) {
      return NextResponse.json({ error: "Period does not belong to the specified establishment" }, { status: 400 })
    }

    const { name, startDate, endDate, isActive } = await request.json()

    // Mettre à jour la période
    const updatedPeriod = await prisma.periodConfig.update({
      where: {
        id: params.periodId,
      },
      data: {
        name: name || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    })

    return NextResponse.json(updatedPeriod)
  } catch (error) {
    console.error("Error updating period:", error)
    return NextResponse.json({ error: "An error occurred while updating the period" }, { status: 500 })
  }
}

// Supprimer une période
export async function DELETE(request: Request, { params }: { params: { id: string; periodId: string } }) {
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
      return NextResponse.json({ error: "Not authorized to delete periods" }, { status: 403 })
    }

    // Vérifier si la période existe
    const period = await prisma.periodConfig.findUnique({
      where: {
        id: params.periodId,
      },
    })

    if (!period) {
      return NextResponse.json({ error: "Period not found" }, { status: 404 })
    }

    // Vérifier si la période appartient à l'établissement spécifié
    if (period.establishmentId !== params.id) {
      return NextResponse.json({ error: "Period does not belong to the specified establishment" }, { status: 400 })
    }

    // Vérifier si des évaluations sont associées à cette période
    const evaluationsCount = await prisma.evaluation.count({
      where: {
        periodId: params.periodId,
      },
    })

    if (evaluationsCount > 0) {
      return NextResponse.json({ error: "Cannot delete period with associated evaluations" }, { status: 400 })
    }

    // Supprimer la période
    await prisma.periodConfig.delete({
      where: {
        id: params.periodId,
      },
    })

    return NextResponse.json({ message: "Period deleted successfully" })
  } catch (error) {
    console.error("Error deleting period:", error)
    return NextResponse.json({ error: "An error occurred while deleting the period" }, { status: 500 })
  }
}
