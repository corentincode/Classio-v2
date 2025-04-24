// app/api/auth/2fa/generate-code/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateCode } from "@/lib/2fa-email";
import { send2FACode } from "@/lib/email";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  try {
    // Vérifier les identifiants de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Générer un code à 6 chiffres
    const code = generateCode();
    
    // Définir une date d'expiration (5 minutes)
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 5);
    
    // Enregistrer le code et sa date d'expiration
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
      message: "2FA code sent successfully",
    });
  } catch (error) {
    console.error("Error generating 2FA code:", error);
    return NextResponse.json(
      { error: "An error occurred while generating 2FA code" },
      { status: 500 }
    );
  }
}