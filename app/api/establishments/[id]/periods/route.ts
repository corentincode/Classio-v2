import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Récupérer toutes les périodes d'un établissement
export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    // Récupérer les périodes
    const periods = await prisma.periodConfig.findMany({
      where: {
        establishmentId: params.id,
      },
      orderBy: [{ schoolYear: "desc" }, { startDate: "asc" }],
    })

    return NextResponse.json(periods)
  } catch (error) {
    console.error("Error fetching periods:", error)
    return NextResponse.json({ error: "An error occurred while fetching periods" }, { status: 500 })
  }
}

// Créer une nouvelle période
export async function POST(request: Request, { params }: { params: { id: string } }) {
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
      return NextResponse.json({ error: "Not authorized to create periods" }, { status: 403 })
    }

    const { period, name, startDate, endDate, schoolYear, isActive } = await request.json()

    // Vérifier si la période existe déjà
    const existingPeriod = await prisma.periodConfig.findFirst({
      where: {
        period,
        schoolYear,
        establishmentId: params.id,
      },
    })

    if (existingPeriod) {
      return NextResponse.json(
        { error: "A period with this name already exists for this school year" },
        { status: 400 },
      )
    }

    // Créer la période
    const newPeriod = await prisma.periodConfig.create({
      data: {
        period,
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        schoolYear,
        isActive: isActive !== undefined ? isActive : true,
        establishment: {
          connect: { id: params.id },
        },
      },
    })

    return NextResponse.json(newPeriod)
  } catch (error) {
    console.error("Error creating period:", error)
    return NextResponse.json({ error: "An error occurred while creating the period" }, { status: 500 })
  }
}
