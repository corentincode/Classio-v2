"use client"

import type React from "react"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Vérifier si l'utilisateur a activé 2FA
      const checkResponse = await fetch("/api/auth/check-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const checkData = await checkResponse.json()

      if (checkResponse.ok && checkData.twoFactorEnabled) {
        // Si 2FA est activé, générer et envoyer un code
        const codeResponse = await fetch("/api/auth/2fa/generate-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })

        if (codeResponse.ok) {
          // Rediriger vers la page de vérification 2FA
          router.push(`/auth/verify-email-2fa?email=${encodeURIComponent(email)}`)
          return
        } else {
          const codeData = await codeResponse.json()
          setError(codeData.error || "Identifiants invalides")
          setIsLoading(false)
          return
        }
      }

      // Si pas de 2FA, procéder à la connexion normale
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError("Email ou mot de passe invalide")
        setIsLoading(false)
      } else {
        // Récupérer les informations de l'utilisateur pour déterminer où rediriger
        const userResponse = await fetch("/api/user/me")

        if (userResponse.ok) {
          const userData = await userResponse.json()

          // Rediriger en fonction du rôle
          if (userData.role === "SUPERADMIN") {
            router.push("/dashboard")
          } else if (userData.role === "ADMINISTRATION") {
            router.push("/admin")
          } else if (userData.role === "PROFESSEUR") {
            // Si le professeur est associé à plusieurs établissements, rediriger vers la page de sélection
            const teachingAtCount = userData.teachingAt?.length || 0

            if (teachingAtCount > 1) {
              router.push("/professeur/select-establishment")
            } else if (teachingAtCount === 1) {
              // Si un seul établissement, rediriger directement
              router.push(`/professeur?establishmentId=${userData.teachingAt[0].establishmentId}`)
            } else {
              // Si aucun établissement
              router.push("/professeur/no-establishment")
            }
          } else if (userData.role === "ELEVE") {
            if (userData.establishmentId) {
              router.push("/eleve")
            } else {
              router.push("/eleve/no-establishment")
            }
          } else if (userData.role === "PARENT") {
            if (userData.establishmentId) {
              router.push("/parent")
            } else {
              router.push("/parent/no-establishment")
            }
          } else {
            // Rôle inconnu
            router.push("/")
          }
        } else {
          // En cas d'erreur, rediriger vers la page d'accueil
          router.push("/")
        }
      }
    } catch (error) {
      console.error("Error during sign in:", error)
      setError("Une erreur s'est produite lors de la connexion")
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Connexion</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Vous n'avez pas de compte ?{" "}
        <Link href="/auth/signup" className="text-indigo-600 hover:text-indigo-500">
          S'inscrire
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-gray-600">
        <Link href="/auth/forgot-password" className="text-indigo-600 hover:text-indigo-500">
          Mot de passe oublié ?
        </Link>
      </p>
    </div>
  )
}
