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
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      select: {
        id: true,
        email: true,
        lastLogin: true,
        twoFactorEnabled: true,
        role: true,
        establishmentId: true,
        establishment: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        teachingAt: {
          include: {
            establishment: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "An error occurred while fetching user data" }, { status: 500 })
  }
}
