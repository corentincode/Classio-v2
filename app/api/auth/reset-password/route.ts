import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { token, password } = await request.json()

  if (!token || !password) {
    return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    return NextResponse.json({ message: "Password reset successfully" })
  } catch (error) {
    console.error("Error resetting password:", error)
    return NextResponse.json({ error: "An error occurred while resetting the password" }, { status: 500 })
  }
}

