import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { EmptyState } from "@/components/eleve/empty-state"
import { EleveShell } from "@/components/eleve/eleve-shell"

export default async function EleveNoClassPage() {
  const session = await getServerSession(authOptions)

  // Redirect if not authenticated
  if (!session) {
    redirect("/auth/signin")
  }

  // Only students can access this page
  if (session.user.role !== "ELEVE") {
    redirect("/dashboard")
  }

  return (
      <EmptyState
        title="Vous n'êtes inscrit dans aucune classe"
        description="Veuillez contacter l'administration de votre établissement pour être inscrit dans une classe."
        icon="school"
      />
  )
}
