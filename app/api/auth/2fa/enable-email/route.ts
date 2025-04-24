// app/api/auth/2fa/enable-email/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Activer 2FA pour l'utilisateur
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: true },
    });

    return NextResponse.json({
      message: "Two-factor authentication enabled successfully",
    });
  } catch (error) {
    console.error("Error enabling 2FA:", error);
    return NextResponse.json(
      { error: "An error occurred while enabling 2FA" },
      { status: 500 }
    );
  }
}