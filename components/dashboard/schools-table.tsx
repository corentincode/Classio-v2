"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, ArrowUpDown, ChevronDown, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

type Establishment = {
  id: string
  name: string
  code: string
  address?: string | null
  city?: string | null
  zipCode?: string | null
  country?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  createdAt: string
  updatedAt: string
}

export function SchoolsTable() {
  const { data: session } = useSession()
  const router = useRouter()
  const [establishments, setEstablishments] = useState<Establishment[]>([])
  const [selectedSchools, setSelectedSchools] = useState<string[]>([])
  const [expandedSchool, setExpandedSchool] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [establishmentToDelete, setEstablishmentToDelete] = useState<string | null>(null)

  // Détection de la taille d'écran
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  // Récupération des établissements depuis l'API
  useEffect(() => {
    const fetchEstablishments = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/establishments")

        if (!response.ok) {
          throw new Error("Failed to fetch establishments")
        }

        const data = await response.json()
        setEstablishments(data)
      } catch (err) {
        console.error("Error fetching establishments:", err)
        setError("Impossible de charger les établissements")
      } finally {
        setLoading(false)
      }
    }

    fetchEstablishments()
  }, [])

  const toggleSelectAll = () => {
    if (selectedSchools.length === establishments.length) {
      setSelectedSchools([])
    } else {
      setSelectedSchools(establishments.map((school) => school.id))
    }
  }

  const toggleSelectSchool = (schoolId: string) => {
    if (selectedSchools.includes(schoolId)) {
      setSelectedSchools(selectedSchools.filter((id) => id !== schoolId))
    } else {
      setSelectedSchools([...selectedSchools, schoolId])
    }
  }

  const toggleExpandSchool = (schoolId: string) => {
    setExpandedSchool(expandedSchool === schoolId ? null : schoolId)
  }

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/etablissements/${id}`)
  }

  const handleEdit = (id: string) => {
    // Pour l'instant, rediriger vers la page de détails
    // Dans une implémentation future, vous pourriez ouvrir un modal d'édition
    router.push(`/dashboard/etablissements/${id}`)
  }

  const handleManageUsers = (id: string) => {
    // Rediriger vers une page de gestion des utilisateurs pour cet établissement
    // Cette page n'existe pas encore, mais vous pourriez la créer plus tard
    router.push(`/dashboard/etablissements/${id}/users`)
  }

  const confirmDelete = (id: string) => {
    setEstablishmentToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!establishmentToDelete) return

    try {
      const response = await fetch(`/api/establishments/${establishmentToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Échec de la suppression de l'établissement")
      }

      // Mettre à jour la liste des établissements
      setEstablishments(establishments.filter((e) => e.id !== establishmentToDelete))
      toast({
        title: "Établissement supprimé",
        description: "L'établissement a été supprimé avec succès.",
      })
    } catch (err) {
      console.error("Error deleting establishment:", err)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression de l'établissement.",
        variant: "destructive",
      })
    } finally {
      setEstablishmentToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  // Filtrer les établissements en fonction du terme de recherche
  const filteredEstablishments = establishments.filter(
    (establishment) =>
      establishment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      establishment.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (establishment.city && establishment.city.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const isAdmin = session?.user?.role === "SUPERADMIN" || session?.user?.role === "ADMINISTRATION"

  if (loading) {
    return (
      <div className="space-y-4 w-full max-w-full overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 w-full max-w-full">
          <div className="flex flex-1 items-center space-x-2">
            <Skeleton className="h-9 w-[300px]" />
            <Skeleton className="h-9 w-[100px]" />
          </div>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-20" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 w-full max-w-full">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Rechercher un établissement..."
            className="h-9 w-full max-w-full sm:w-[250px] lg:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <span>Filtres</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filtrer par</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Ville</DropdownMenuItem>
              <DropdownMenuItem>Code</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          {selectedSchools.length > 0 && (
            <Button variant="outline" size="sm" className="h-9">
              Exporter ({selectedSchools.length})
            </Button>
          )}
        </div>
      </div>

      {filteredEstablishments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? "Aucun établissement ne correspond à votre recherche" : "Aucun établissement trouvé"}
        </div>
      ) : (
        <>
          {/* Version mobile du tableau */}
          {isMobile ? (
            <div className="space-y-3">
              {filteredEstablishments.map((school) => (
                <div key={school.id} className="rounded-md border overflow-hidden">
                  <div
                    className="flex items-center p-3 cursor-pointer bg-background"
                    onClick={() => toggleExpandSchool(school.id)}
                  >
                    <Checkbox
                      checked={selectedSchools.includes(school.id)}
                      onCheckedChange={() => toggleSelectSchool(school.id)}
                      aria-label={`Sélectionner ${school.name}`}
                      onClick={(e) => e.stopPropagation()}
                      className="mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{school.name}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{school.city || "Non spécifié"}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-auto mr-2">
                      {school.code}
                    </Badge>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${expandedSchool === school.id ? "rotate-180" : ""}`}
                    />
                  </div>

                  {expandedSchool === school.id && (
                    <div className="p-3 border-t bg-muted/30 space-y-2">
                      <div className="grid gap-2 text-sm">
                        {school.address && (
                          <div>
                            <div className="font-medium text-xs text-muted-foreground">Adresse complète</div>
                            <div>{school.address}</div>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          {school.email && (
                            <div>
                              <div className="font-medium text-xs text-muted-foreground">Email</div>
                              <div>{school.email}</div>
                            </div>
                          )}
                          {school.phone && (
                            <div>
                              <div className="font-medium text-xs text-muted-foreground">Téléphone</div>
                              <div>{school.phone}</div>
                            </div>
                          )}
                        </div>
                      </div>
                      {isAdmin && (
                        <div className="flex justify-end gap-2 pt-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(school.id)}>
                            Modifier
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Plus
                                <ChevronDown className="ml-1 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(school.id)}>
                                Voir les détails
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleManageUsers(school.id)}>
                                Gérer les utilisateurs
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={() => confirmDelete(school.id)}>
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Version desktop du tableau
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          selectedSchools.length === filteredEstablishments.length && filteredEstablishments.length > 0
                        }
                        onCheckedChange={toggleSelectAll}
                        aria-label="Sélectionner tous les établissements"
                      />
                    </TableHead>
                    <TableHead className="w-[250px]">
                      <div className="flex items-center gap-1">
                        Établissement
                        <Button variant="ghost" size="sm" className="h-8 p-0">
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Contact</TableHead>
                    {isAdmin && <TableHead className="w-[50px]"></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEstablishments.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedSchools.includes(school.id)}
                          onCheckedChange={() => toggleSelectSchool(school.id)}
                          aria-label={`Sélectionner ${school.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{school.name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{school.code}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{school.city || "Non spécifié"}</span>
                        </div>
                        {school.address && <div className="text-xs text-muted-foreground mt-1">{school.address}</div>}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {school.email && <div className="text-sm">{school.email}</div>}
                          {school.phone && <div className="text-sm">{school.phone}</div>}
                        </div>
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(school.id)}>
                                Voir les détails
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(school.id)}>Modifier</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleManageUsers(school.id)}>
                                Gérer les utilisateurs
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={() => confirmDelete(school.id)}>
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet établissement ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Tous les utilisateurs associés à cet établissement seront affectés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
