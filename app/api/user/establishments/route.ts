import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Get user with role
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      select: {
        id: true,
        role: true,
        establishmentId: true,
        teachingAt: {
          include: {
            establishment: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If user is admin, return all establishments
    if (user.role === "SUPERADMIN" || user.role === "ADMINISTRATION") {
      const establishments = await prisma.establishment.findMany({
        orderBy: { name: "asc" },
      })
      return NextResponse.json(establishments)
    }

    // If user is a professor, return all establishments they teach at
    if (user.role === "PROFESSEUR") {
      const professorEstablishments = await prisma.establishmentProfessor.findMany({
        where: { professorId: user.id },
        include: { establishment: true },
      })

      const establishments = professorEstablishments.map((pe) => pe.establishment)
      return NextResponse.json(establishments)
    }

    // For regular users (ELEVE, PARENT), return only their assigned establishment
    if (user.establishmentId) {
      const establishment = await prisma.establishment.findUnique({
        where: { id: user.establishmentId },
      })
      return NextResponse.json([establishment])
    }

    // If user has no establishment
    return NextResponse.json([])
  } catch (error) {
    console.error("Error fetching user establishments:", error)
    return NextResponse.json({ error: "An error occurred while fetching establishments" }, { status: 500 })
  }
}
