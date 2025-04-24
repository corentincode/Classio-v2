"use client"

import { signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function VerifyEmail2FA() {
  const [code, setCode] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes en secondes
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    } else {
      router.push("/auth/signin")
    }
  }, [searchParams, router])

  // Compte à rebours
  useEffect(() => {
    if (timeLeft <= 0) {
      setError("Le code a expiré. Veuillez vous reconnecter.")
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft])

  // Formater le temps restant
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    try {
      // Vérifier le code 2FA
      const response = await fetch("/api/auth/2fa/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Si le code est valide, procéder à la connexion
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password: data.tempPassword, // Mot de passe temporaire généré par l'API
        })
        
        if (result?.error) {
          setError("Une erreur s'est produite lors de la connexion")
        } else {
          // Rediriger vers le dashboard
          router.push("/dashboard")
        }
      } else {
        setError(data.error || "Code invalide")
      }
    } catch (error) {
      console.error("Error verifying 2FA code:", error)
      setError("Une erreur s'est produite. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setError("")
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/auth/2fa/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      
      if (response.ok) {
        setTimeLeft(300) // Réinitialiser le compte à rebours
        alert("Un nouveau code a été envoyé à votre adresse email.")
      } else {
        const data = await response.json()
        setError(data.error || "Impossible d'envoyer un nouveau code")
      }
    } catch (error) {
      console.error("Error resending 2FA code:", error)
      setError("Une erreur s'est produite. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Vérification à deux facteurs</h1>
      <p className="mb-6 text-center text-gray-600">
        Un code de vérification a été envoyé à votre adresse email. Veuillez entrer ce code ci-dessous.
      </p>
      
      <div className="mb-6 text-center">
        <p className="text-sm text-gray-500">Le code expirera dans</p>
        <p className={`text-xl font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-800'}`}>
          {formatTime()}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Code de vérification
          </label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            maxLength={6}
            pattern="\d{6}"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Entrez le code à 6 chiffres"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isLoading || timeLeft <= 0}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? "Vérification..." : "Vérifier"}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          onClick={handleResendCode}
          disabled={isLoading}
          className="text-indigo-600 hover:text-indigo-500 text-sm"
        >
          Renvoyer le code
        </button>
      </div>
    </div>
  )
}
