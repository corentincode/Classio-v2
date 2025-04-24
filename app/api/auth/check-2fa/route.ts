// app/api/auth/check-2fa/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { twoFactorEnabled: true },
    });

    if (!user) {
      // Pour des raisons de sécurité, ne pas révéler si l'utilisateur existe
      return NextResponse.json({ twoFactorEnabled: false });
    }

    return NextResponse.json({ twoFactorEnabled: user.twoFactorEnabled });
  } catch (error) {
    console.error("Error checking 2FA status:", error);
    return NextResponse.json(
      { error: "An error occurred while checking 2FA status" },
      { status: 500 }
    );
  }
}