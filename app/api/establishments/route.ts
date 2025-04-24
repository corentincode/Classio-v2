import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get all establishments (admin only)
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Get user with role
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      select: { role: true },
    })

    // Check if user is admin
    if (user?.role !== "SUPERADMIN" && user?.role !== "ADMINISTRATION") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const establishments = await prisma.establishment.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json(establishments)
  } catch (error) {
    console.error("Error fetching establishments:", error)
    return NextResponse.json({ error: "An error occurred while fetching establishments" }, { status: 500 })
  }
}

// Create a new establishment (admin only)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Get user with role
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      select: { role: true },
    })

    // Check if user is admin
    if (user?.role !== "SUPERADMIN" && user?.role !== "ADMINISTRATION") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const { name, code, address, city, zipCode, country, phone, email, website } = await request.json()

    // Validate required fields
    if (!name || !code) {
      return NextResponse.json({ error: "Name and code are required" }, { status: 400 })
    }

    // Check if establishment with this code already exists
    const existingEstablishment = await prisma.establishment.findUnique({
      where: { code },
    })

    if (existingEstablishment) {
      return NextResponse.json({ error: "An establishment with this code already exists" }, { status: 400 })
    }

    // Create the establishment
    const establishment = await prisma.establishment.create({
      data: {
        name,
        code,
        address,
        city,
        zipCode,
        country,
        phone,
        email,
        website,
      },
    })

    return NextResponse.json(establishment, { status: 201 })
  } catch (error) {
    console.error("Error creating establishment:", error)
    return NextResponse.json({ error: "An error occurred while creating the establishment" }, { status: 500 })
  }
}
