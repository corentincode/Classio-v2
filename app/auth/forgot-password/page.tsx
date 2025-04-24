"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, Loader2 } from "lucide-react"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (response.ok) {
        setMessage("Si un compte avec cet email existe, nous avons envoyé un lien de réinitialisation.")
      } else {
        setError("Une erreur s'est produite. Veuillez réessayer.")
      }
    } catch (error) {
      setError("Une erreur s'est produite. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4 relative overflow-hidden">
      {/* Cercles décoratifs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl opacity-30"></div>

      <div className="w-full max-w-md z-10">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Mot de passe oublié</h1>
            <p className="text-gray-300 text-center">
              Entrez votre adresse email pour recevoir un lien de réinitialisation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 block w-full rounded-lg border border-gray-600 bg-gray-800/50 text-white py-3 px-4 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {message && (
              <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                <p className="text-green-300 text-sm">{message}</p>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-colors duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Envoi en cours...
                </>
              ) : (
                "Réinitialiser le mot de passe"
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <Link
              href="/login"
              className="flex items-center text-sm text-gray-300 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la connexion
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              En continuant, vous acceptez nos{" "}
              <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                Conditions d'utilisation
              </Link>{" "}
              et notre{" "}
              <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                Politique de confidentialité
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
