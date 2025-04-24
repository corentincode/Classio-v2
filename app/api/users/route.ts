import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import crypto from "crypto"

const prisma = new PrismaClient()

// Créer un nouvel utilisateur
export async function POST(request: Request) {
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

  const { email, role, establishmentId } = await request.json()

  if (!email || !role) {
    return NextResponse.json({ error: "Email and role are required" }, { status: 400 })
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Générer un mot de passe aléatoire
    const password = crypto.randomBytes(8).toString("hex")
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role as any,
        ...(establishmentId && role !== "PROFESSEUR" ? { establishmentId } : {}),
      },
    })

    // Si c'est un professeur et qu'un établissement est spécifié, créer la relation
    if (role === "PROFESSEUR" && establishmentId) {
      await prisma.establishmentProfessor.create({
        data: {
          professorId: user.id,
          establishmentId,
        },
      })
    }

    // TODO: Envoyer un email à l'utilisateur avec son mot de passe temporaire

    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role,
      temporaryPassword: password,
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "An error occurred while creating the user" }, { status: 500 })
  }
}
