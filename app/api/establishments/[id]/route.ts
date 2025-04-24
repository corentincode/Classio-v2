import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get a specific establishment
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const establishment = await prisma.establishment.findUnique({
      where: { id: params.id },
    })

    if (!establishment) {
      return NextResponse.json({ error: "Establishment not found" }, { status: 404 })
    }

    return NextResponse.json(establishment)
  } catch (error) {
    console.error("Error fetching establishment:", error)
    return NextResponse.json({ error: "An error occurred while fetching the establishment" }, { status: 500 })
  }
}

// Delete an establishment
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

    // Check if establishment exists
    const establishment = await prisma.establishment.findUnique({
      where: { id: params.id },
    })

    if (!establishment) {
      return NextResponse.json({ error: "Establishment not found" }, { status: 404 })
    }

    // Delete all professor associations
    await prisma.establishmentProfessor.deleteMany({
      where: { establishmentId: params.id },
    })

    // Update users to remove establishment reference
    await prisma.user.updateMany({
      where: { establishmentId: params.id },
      data: { establishmentId: null },
    })

    // Delete the establishment
    await prisma.establishment.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Establishment deleted successfully" })
  } catch (error) {
    console.error("Error deleting establishment:", error)
    return NextResponse.json({ error: "An error occurred while deleting the establishment" }, { status: 500 })
  }
}

// Update an establishment
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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

    const data = await request.json()

    // Check if establishment exists
    const establishment = await prisma.establishment.findUnique({
      where: { id: params.id },
    })

    if (!establishment) {
      return NextResponse.json({ error: "Establishment not found" }, { status: 404 })
    }

    // If code is being changed, check if it's unique
    if (data.code && data.code !== establishment.code) {
      const existingEstablishment = await prisma.establishment.findUnique({
        where: { code: data.code },
      })

      if (existingEstablishment) {
        return NextResponse.json({ error: "An establishment with this code already exists" }, { status: 400 })
      }
    }

    // Update the establishment
    const updatedEstablishment = await prisma.establishment.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json(updatedEstablishment)
  } catch (error) {
    console.error("Error updating establishment:", error)
    return NextResponse.json({ error: "An error occurred while updating the establishment" }, { status: 500 })
  }
}
