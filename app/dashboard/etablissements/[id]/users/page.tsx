"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Search, UserPlus } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddUserToEstablishmentForm } from "@/components/dashboard/add-user-to-establishment-form"
import { UsersTable } from "@/components/dashboard/users-table"
import { ProfessorsTable } from "@/components/dashboard/professors-table"

export default function ManageEstablishmentUsersPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [establishment, setEstablishment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("students")

  // Charger les données de l'établissement
  useEffect(() => {
    const fetchEstablishment = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/establishments/${params.id}`)

        if (!response.ok) {
          throw new Error("Impossible de charger les données de l'établissement")
        }

        const data = await response.json()
        setEstablishment(data)
      } catch (error) {
        console.error("Error fetching establishment:", error)
        setError("Impossible de charger les données de l'établissement")
      } finally {
        setLoading(false)
      }
    }

    fetchEstablishment()
  }, [params.id])

  if (loading) {
    return <div>Chargement des données...</div>
  }

  if (error || !establishment) {
    return <div className="text-red-500">{error || "Impossible de charger les données"}</div>
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/etablissements/${params.id}`}>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h1>
        </div>
        <Button onClick={() => setAddUserDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un utilisateur
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{establishment.name}</CardTitle>
          <CardDescription>Code: {establishment.code}</CardDescription>
        </CardHeader>
      </Card>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 w-full max-w-sm">
          <Input
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9"
          />
          <Button variant="outline" size="sm" className="h-9 px-3">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="students" className="w-full" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="students">Élèves</TabsTrigger>
          <TabsTrigger value="parents">Parents</TabsTrigger>
          <TabsTrigger value="professors">Professeurs</TabsTrigger>
          <TabsTrigger value="administration">Administration</TabsTrigger>
        </TabsList>
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Élèves</CardTitle>
              <CardDescription>Liste des élèves inscrits dans cet établissement</CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable establishmentId={params.id} role="ELEVE" searchTerm={searchTerm} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="parents">
          <Card>
            <CardHeader>
              <CardTitle>Parents</CardTitle>
              <CardDescription>Liste des parents associés à cet établissement</CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable establishmentId={params.id} role="PARENT" searchTerm={searchTerm} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="professors">
          <Card>
            <CardHeader>
              <CardTitle>Professeurs</CardTitle>
              <CardDescription>Liste des professeurs enseignant dans cet établissement</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfessorsTable establishmentId={params.id} searchTerm={searchTerm} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="administration">
          <Card>
            <CardHeader>
              <CardTitle>Administration</CardTitle>
              <CardDescription>Liste du personnel administratif de cet établissement</CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable establishmentId={params.id} role="ADMINISTRATION" searchTerm={searchTerm} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddUserToEstablishmentForm
        establishmentId={params.id}
        open={addUserDialogOpen}
        onOpenChange={setAddUserDialogOpen}
        defaultTab={activeTab}
      />
    </div>
  )
}
