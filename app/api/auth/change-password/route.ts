import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { currentPassword, newPassword } = await request.json()

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    })

    return NextResponse.json({ message: "Password changed successfully" })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json({ error: "An error occurred while changing the password" }, { status: 500 })
  }
}

