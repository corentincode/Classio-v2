import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ParentNoEstablishmentPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Aucun établissement</h1>

      <Card>
        <CardHeader>
          <CardTitle>Vous n'êtes associé à aucun établissement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Vous n'êtes actuellement associé à aucun établissement scolaire. Veuillez contacter l'administrateur du
            système pour être assigné à un établissement.
          </p>
          <Link href="/auth/signout">
            <Button variant="outline">Se déconnecter</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
