// app/api/auth/2fa/disable-email/route.ts
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

    // Désactiver 2FA pour l'utilisateur
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        twoFactorEnabled: false,
        twoFactorCode: null,
        twoFactorCodeExpiry: null
      },
    });

    return NextResponse.json({
      message: "Two-factor authentication disabled successfully",
    });
  } catch (error) {
    console.error("Error disabling 2FA:", error);
    return NextResponse.json(
      { error: "An error occurred while disabling 2FA" },
      { status: 500 }
    );
  }
}