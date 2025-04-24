import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { isCodeExpired } from "@/lib/2fa-email";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email, code } = await request.json();

  if (!email || !code) {
    return NextResponse.json(
      { error: "Email and code are required" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Vérifier si le code est expiré
    if (isCodeExpired(user.twoFactorCodeExpiry)) {
      return NextResponse.json(
        { error: "Code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Vérifier si le code est correct
    if (user.twoFactorCode !== code) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    // Effacer le code après utilisation
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorCode: null,
        twoFactorCodeExpiry: null,
        lastLogin: new Date(),
      },
    });

    // Générer un mot de passe temporaire pour la connexion
    // (Ceci est une astuce pour éviter de stocker le mot de passe réel)
    const tempPassword = crypto.randomBytes(32).toString("hex");

    return NextResponse.json({
      message: "Code verified successfully",
      tempPassword,
    });
  } catch (error) {
    console.error("Error verifying 2FA code:", error);
    return NextResponse.json(
      { error: "An error occurred while verifying 2FA code" },
      { status: 500 }
    );
  }
}
