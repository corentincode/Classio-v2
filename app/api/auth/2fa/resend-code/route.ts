// app/api/auth/2fa/resend-code/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateCode } from "@/lib/2fa-email";
import { send2FACode } from "@/lib/email";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Générer un nouveau code
    const code = generateCode();
    
    // Définir une nouvelle date d'expiration (5 minutes)
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 5);
    
    // Mettre à jour le code et sa date d'expiration
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorCode: code,
        twoFactorCodeExpiry: expiryDate,
      },
    });
    
    // Envoyer le code par email
    await send2FACode(user.email, code);

    return NextResponse.json({
      message: "2FA code resent successfully",
    });
  } catch (error) {
    console.error("Error resending 2FA code:", error);
    return NextResponse.json(
      { error: "An error occurred while resending 2FA code" },
      { status: 500 }
    );
  }
}