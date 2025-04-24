"use client"

import { useState, useEffect } from "react"
import { Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function DataProtectionBanner() {
  const [showBanner, setShowBanner] = useState(false)

  // Simuler une vérification de conformité
  useEffect(() => {
    // Dans un cas réel, cela viendrait d'une API
    const hasComplianceIssues = true
    setShowBanner(hasComplianceIssues)
  }, [])

  if (!showBanner) return null

  return (
    <Alert variant="destructive" className="rounded-none border-t-0 border-x-0">
      <div className="container flex items-center justify-between py-1">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>
            Des problèmes de conformité RGPD ont été détectés. Veuillez consulter la section Conformité RGPD.
          </AlertDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-background text-destructive hover:bg-background/90"
          onClick={() => setShowBanner(false)}
        >
          Fermer
        </Button>
      </div>
    </Alert>
  )
}
