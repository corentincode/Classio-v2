// app/auth/verify-2fa/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"

export default function Verify2FA() {
  const [token, setToken] = useState("")
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Récupérer l'email et le mot de passe des paramètres d'URL
    const emailParam = searchParams.get("email")
    const passwordParam = searchParams.get("password")
    
    if (emailParam && passwordParam) {
      setEmail(emailParam)
      setPassword(passwordParam)
    } else {
      // Rediriger vers la page de connexion si les paramètres sont manquants
      router.push("/auth/signin")
    }
  }, [searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    try {
      // Valider le code 2FA
      const validateResponse = await fetch("/api/auth/2fa/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      })
      
      if (validateResponse.ok) {
        // Si le code 2FA est valide, procéder à la connexion
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        })
        
        if (result?.error) {
          setError("Invalid credentials")
        } else {
          // Rediriger en fonction du rôle (comme dans votre code existant)
          const userResponse = await fetch("/api/user/me")
          if (userResponse.ok) {
            const userData = await userResponse.json()
            const userRole = userData.role
            
            switch (userRole) {
              case "ELEVE":
                router.push("/eleve")
                break
              case "PARENT":
                router.push("/parent")
                break
              case "ADMINISTRATION":
                router.push("/admin")
                break
              case "SUPERADMIN":
                router.push("/dashboard")
                break
              default:
                router.push("/dashboard")
            }
          } else {
            router.push("/dashboard")
          }
        }
      } else {
        const data = await validateResponse.json()
        setError(data.error || "Invalid verification code")
      }
    } catch (error) {
      setError("An error occurred during verification")
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Two-Factor Authentication</h1>
      <p className="mb-4 text-center">
        Please enter the verification code from your authenticator app.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700">
            Verification Code
          </label>
          <input
            id="token"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter 6-digit code"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Verify
        </button>
      </form>
    </div>
  )
}