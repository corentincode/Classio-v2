import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // Vérifier si l'utilisateur est admin
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    select: { role: true },
  })

  if (currentUser?.role !== "SUPERADMIN" && currentUser?.role !== "ADMINISTRATION") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const role = searchParams.get("role")
  const establishmentId = searchParams.get("establishmentId")

  if (!query) {
    return NextResponse.json({ error: "Search query is required" }, { status: 400 })
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: query,
          mode: "insensitive",
        },
        ...(role ? { role: role as any } : {}),
        ...(establishmentId ? { establishmentId: { not: establishmentId } } : {}),
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
      take: 10,
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error searching users:", error)
    return NextResponse.json({ error: "An error occurred while searching users" }, { status: 500 })
  }
}
