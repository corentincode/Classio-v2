// app/profile/2fa/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function TwoFactorSettings() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  // Récupérer l'état 2FA de l'utilisateur
  useEffect(() => {
    const fetchTwoFactorStatus = async () => {
      if (session?.user?.email) {
        try {
          setIsLoading(true)
          const response = await fetch("/api/user/me")
          if (response.ok) {
            const data = await response.json()
            setTwoFactorEnabled(data.twoFactorEnabled || false)
          }
        } catch (error) {
          console.error("Error fetching 2FA status:", error)
          setError("Failed to fetch 2FA status")
        } finally {
          setIsLoading(false)
        }
      }
    }
    
    if (session) {
      fetchTwoFactorStatus()
    }
  }, [session])

  // Activer le 2FA
  const handleEnable2FA = async () => {
    setMessage("")
    setError("")
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/auth/2fa/enable-email", {
        method: "POST",
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setTwoFactorEnabled(true)
        setMessage("L'authentification à deux facteurs par email a été activée avec succès.")
      } else {
        setError(data.error || "Failed to enable 2FA")
      }
    } catch (error) {
      console.error("Error enabling 2FA:", error)
      setError("An error occurred while enabling 2FA")
    } finally {
      setIsLoading(false)
    }
  }

  // Désactiver le 2FA
  const handleDisable2FA = async () => {
    setMessage("")
    setError("")
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/auth/2fa/disable-email", {
        method: "POST",
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setTwoFactorEnabled(false)
        setMessage("L'authentification à deux facteurs par email a été désactivée avec succès.")
      } else {
        setError(data.error || "Failed to disable 2FA")
      }
    } catch (error) {
      console.error("Error disabling 2FA:", error)
      setError("An error occurred while disabling 2FA")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || isLoading) {
    return <div className="max-w-md mx-auto mt-8 p-4">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-6">Paramètres d'authentification à deux facteurs</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Authentification à deux facteurs par email</h2>
        <p className="mb-4">
          L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire à votre compte. Lorsqu'elle est activée, vous recevrez un code à 6 chiffres par email à chaque connexion.
        </p>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <p className="font-medium">
            Statut actuel : 
            <span className={twoFactorEnabled ? "text-green-600" : "text-red-600"}>
              {twoFactorEnabled ? " Activé" : " Désactivé"}
            </span>
          </p>
        </div>
        
        {twoFactorEnabled ? (
          <button
            onClick={handleDisable2FA}
            disabled={isLoading}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "Désactivation en cours..." : "Désactiver l'authentification à deux facteurs"}
          </button>
        ) : (
          <button
            onClick={handleEnable2FA}
            disabled={isLoading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "Activation en cours..." : "Activer l'authentification à deux facteurs"}
          </button>
        )}
        
        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Comment ça fonctionne</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Lorsque vous vous connectez avec votre email et votre mot de passe, un code à 6 chiffres est envoyé à votre adresse email.</li>
          <li>Vous devez entrer ce code dans la page de vérification pour compléter votre connexion.</li>
          <li>Le code expire après 5 minutes pour des raisons de sécurité.</li>
          <li>Si vous ne recevez pas le code, vous pouvez en demander un nouveau.</li>
        </ol>
      </div>
    </div>
  )
}