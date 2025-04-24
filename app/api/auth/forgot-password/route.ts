import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"
import { sendPasswordResetEmail } from "@/lib/email"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex")
      const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry },
      })

      await sendPasswordResetEmail(user.email, resetToken)
    }

    // Always return a success message, even if the email doesn't exist
    return NextResponse.json({ message: "If a user with that email exists, a password reset email has been sent." })
  } catch (error) {
    console.error("Error in forgot password:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}

