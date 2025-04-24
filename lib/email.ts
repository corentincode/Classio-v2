import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`

  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset your password",
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset for your account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 24px 0px;">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    })

    console.log("Password reset email sent:", data)
    return data
  } catch (error) {
    console.error("Error sending password reset email:", error)
    throw error
  }
}

export async function send2FACode(email: string, code: string) {
    try {
      const data = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Votre code d'authentification à deux facteurs",
        html: `
          <h1>Code d'authentification à deux facteurs</h1>
          <p>Voici votre code d'authentification à deux facteurs :</p>
          <div style="font-size: 24px; font-weight: bold; background-color: #f0f0f0; padding: 16px; text-align: center; letter-spacing: 5px; margin: 24px 0px;">${code}</div>
          <p>Ce code expirera dans 5 minutes.</p>
          <p>Si vous n'avez pas demandé ce code, veuillez ignorer cet email.</p>
        `,
      })
  
      console.log("2FA code email sent:", data)
      return data
    } catch (error) {
      console.error("Error sending 2FA code email:", error)
      throw error
    }
  }

