// app/debug/2fa/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

// Fonction simple pour générer un secret base32 valide
function generateSimpleSecret(length = 16) {
  const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  let secret = ""
  for (let i = 0; i < length; i++) {
    secret += base32Chars.charAt(Math.floor(Math.random() * base32Chars.length))
  }
  return secret
}

export default function Debug2FA() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // États pour la gestion du 2FA
  const [isEnabled, setIsEnabled] = useState(false)
  const [secret, setSecret] = useState("")
  const [token, setToken] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [manualMode, setManualMode] = useState(false)

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  // Récupérer l'état 2FA de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          setIsLoading(true)
          const response = await fetch("/api/user/me")
          if (response.ok) {
            const data = await response.json()
            setIsEnabled(data.twoFactorEnabled || false)
            setDebugInfo(data)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          setError("Failed to fetch user data")
        } finally {
          setIsLoading(false)
        }
      }
    }
    
    if (session) {
      fetchUserData()
    }
  }, [session])

  // Générer un nouveau secret manuellement
  const handleGenerateSecret = async () => {
    setMessage("")
    setError("")
    try {
      setIsLoading(true)
      
      // Générer un secret localement
      const newSecret = generateSimpleSecret(16)
      setSecret(newSecret)
      
      // Enregistrer le secret dans la base de données
      const response = await fetch("/api/debug/2fa/save-secret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: newSecret }),
      })
      
      if (response.ok) {
        setMessage("Secret generated successfully. Enter this in your authenticator app.")
        setManualMode(true)
      } else {
        const data = await response.json()
        setError(data.error || "Failed to save secret")
      }
    } catch (error) {
      console.error("Error generating secret:", error)
      setError("An error occurred while generating the secret")
    } finally {
      setIsLoading(false)
    }
  }

  // Vérifier et activer le 2FA
  const handleVerifyAndEnable = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setError("")
    
    if (!token) {
      setError("Please enter the verification code")
      return
    }
    
    try {
      setIsLoading(true)
      
      // Pour le développement, accepter n'importe quel code à 6 chiffres
      if (!/^\d{6}$/.test(token)) {
        setError("Invalid token format. Must be 6 digits.")
        setIsLoading(false)
        return
      }
      
      // Activer le 2FA directement (pour le développement)
      const response = await fetch("/api/debug/2fa/enable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setIsEnabled(true)
        setMessage("Two-factor authentication enabled successfully")
        setToken("")
        setSecret("")
        setManualMode(false)
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
    
    try {
      setIsLoading(true)
      const response = await fetch("/api/debug/2fa/disable", {
        method: "POST",
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setIsEnabled(false)
        setMessage("Two-factor authentication disabled successfully")
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
      <h1 className="text-3xl font-bold mb-6">2FA Debug Page (Simplified)</h1>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="text-yellow-700">
          Cette page simplifiée vous permet de configurer l'authentification à deux facteurs (2FA) pour votre compte.
          <br />
          <strong>Note:</strong> Pour le développement, n'importe quel code à 6 chiffres sera accepté.
        </p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Statut de l'authentification à deux facteurs</h2>
        <p className="mb-4">
          Le 2FA est actuellement 
          <span className={`font-bold ${isEnabled ? ' text-green-600' : ' text-red-600'}`}>
            {isEnabled ? ' activé' : ' désactivé'}
          </span> 
          pour votre compte.
        </p>
        
        {isEnabled ? (
          <div>
            <p className="mb-4">
              Votre compte est protégé par l'authentification à deux facteurs. Vous devrez entrer un code de vérification lors de la connexion.
            </p>
            <button
              onClick={handleDisable2FA}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Désactiver le 2FA
            </button>
          </div>
        ) : (
          <div>
            {manualMode && secret ? (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Votre clé secrète</h3>
                
                <p className="mb-2">Entrez cette clé manuellement dans votre application d'authentification :</p>
                <div className="bg-gray-100 p-3 rounded-md font-mono text-sm mb-4 break-all">
                  {secret}
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <h4 className="text-blue-700 font-medium">Instructions pour Google Authenticator</h4>
                  <ol className="list-decimal pl-5 mt-2 text-blue-700">
                    <li>Ouvrez l'application Google Authenticator</li>
                    <li>Appuyez sur le "+" en bas à droite</li>
                    <li>Sélectionnez "Saisir une clé de configuration"</li>
                    <li>Dans "Nom du compte", entrez: <span className="font-medium">SecureAuth</span></li>
                    <li>Dans "Votre clé", entrez le secret ci-dessus <strong>sans espaces</strong></li>
                    <li>Assurez-vous que "Basé sur le temps" est sélectionné</li>
                    <li>Appuyez sur "Ajouter"</li>
                  </ol>
                </div>
                
                <form onSubmit={handleVerifyAndEnable} className="mt-4">
                  <div className="mb-4">
                    <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                      Code de vérification
                    </label>
                    <input
                      type="text"
                      id="token"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      required
                      pattern="\d{6}"
                      maxLength={6}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder="Entrez le code à 6 chiffres"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Pour le développement, n'importe quel code à 6 chiffres sera accepté.
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Activer le 2FA
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setManualMode(false)
                        setSecret("")
                      }}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={handleGenerateSecret}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Générer une clé secrète
              </button>
            )}
          </div>
        )}
        
        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Informations de débogage</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-xs">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
    </div>
  )
}