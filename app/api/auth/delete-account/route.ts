import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    await prisma.user.delete({
      where: { email: session.user?.email as string },
    })

    return NextResponse.json({ message: "Account deleted successfully" })
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json({ error: "An error occurred while deleting the account" }, { status: 500 })
  }
}

