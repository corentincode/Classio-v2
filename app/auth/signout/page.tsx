"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { Loader2 } from "lucide-react"

export default function SignOut() {
  useEffect(() => {
    signOut({ callbackUrl: "/" })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Cercles décoratifs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8 w-full max-w-md mx-4 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-6">
          <Loader2 className="h-12 w-12 text-blue-400 animate-spin" />

          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Déconnexion en cours...</h1>
            <p className="text-gray-300">Vous allez être redirigé vers la page d'accueil dans un instant.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
