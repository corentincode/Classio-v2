"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, Edit, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

interface Period {
  id: string
  name: string
  period: string
  startDate: string
  endDate: string
  schoolYear: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function PeriodsManagementClient({ establishmentId }: { establishmentId: string }) {
  const [periods, setPeriods] = useState<Period[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPeriod, setCurrentPeriod] = useState<Period | null>(null)

  // Form state
  const [name, setName] = useState("")
  const [period, setPeriod] = useState("TRIMESTRE_1")
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [schoolYear, setSchoolYear] = useState(`${new Date().getFullYear()}-${new Date().getFullYear() + 1}`)
  const [isActive, setIsActive] = useState(true)

  // Fetch periods
  const fetchPeriods = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/establishments/${establishmentId}/periods`)
      if (response.ok) {
        const data = await response.json()
        setPeriods(data)
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les périodes",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching periods:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération des périodes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPeriods()
  }, [establishmentId])

  // Reset form
  const resetForm = () => {
    setName("")
    setPeriod("TRIMESTRE_1")
    setStartDate(new Date())
    setEndDate(new Date())
    setSchoolYear(`${new Date().getFullYear()}-${new Date().getFullYear() + 1}`)
    setIsActive(true)
  }

  // Open edit dialog
  const handleEdit = (period: Period) => {
    setCurrentPeriod(period)
    setName(period.name)
    setPeriod(period.period)
    setStartDate(new Date(period.startDate))
    setEndDate(new Date(period.endDate))
    setSchoolYear(period.schoolYear)
    setIsActive(period.isActive)
    setIsEditDialogOpen(true)
  }

  // Open delete dialog
  const handleDelete = (period: Period) => {
    setCurrentPeriod(period)
    setIsDeleteDialogOpen(true)
  }

  // Create period
  const handleCreatePeriod = async () => {
    try {
      const response = await fetch(`/api/establishments/${establishmentId}/periods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          period,
          startDate,
          endDate,
          schoolYear,
          isActive,
        }),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "La période a été créée avec succès",
        })
        fetchPeriods()
        setIsAddDialogOpen(false)
        resetForm()
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.error || "Impossible de créer la période",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating period:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la période",
        variant: "destructive",
      })
    }
  }

  // Update period
  const handleUpdatePeriod = async () => {
    if (!currentPeriod) return

    try {
      const response = await fetch(`/api/establishments/${establishmentId}/periods/${currentPeriod.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          startDate,
          endDate,
          isActive,
        }),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "La période a été mise à jour avec succès",
        })
        fetchPeriods()
        setIsEditDialogOpen(false)
        resetForm()
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.error || "Impossible de mettre à jour la période",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating period:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la période",
        variant: "destructive",
      })
    }
  }

  // Delete period
  const handleDeletePeriod = async () => {
    if (!currentPeriod) return

    try {
      const response = await fetch(`/api/establishments/${establishmentId}/periods/${currentPeriod.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "La période a été supprimée avec succès",
        })
        fetchPeriods()
        setIsDeleteDialogOpen(false)
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.error || "Impossible de supprimer la période",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting period:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la période",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            resetForm()
            setIsAddDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Nouvelle période
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : periods.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 mb-4">Aucune période configurée</p>
            <Button
              onClick={() => {
                resetForm()
                setIsAddDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Créer une période
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {periods.map((period) => (
            <Card
              key={period.id}
              className={cn(
                "hover:shadow-md transition-shadow",
                period.isActive ? "border-green-200" : "border-gray-200",
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{period.name}</CardTitle>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(period)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(period)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                  <div>{period.schoolYear}</div>
                  <div
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs",
                      period.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800",
                    )}
                  >
                    {period.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Type:</span>{" "}
                    {period.period === "TRIMESTRE_1"
                      ? "1er Trimestre"
                      : period.period === "TRIMESTRE_2"
                        ? "2ème Trimestre"
                        : period.period === "TRIMESTRE_3"
                          ? "3ème Trimestre"
                          : period.period === "SEMESTRE_1"
                            ? "1er Semestre"
                            : period.period === "SEMESTRE_2"
                              ? "2ème Semestre"
                              : "Année"}
                  </div>
                  <div>
                    <span className="font-medium">Début:</span>{" "}
                    {format(new Date(period.startDate), "dd MMMM yyyy", { locale: fr })}
                  </div>
                  <div>
                    <span className="font-medium">Fin:</span>{" "}
                    {format(new Date(period.endDate), "dd MMMM yyyy", { locale: fr })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog for adding a new period */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nouvelle période</DialogTitle>
            <DialogDescription>Créez une nouvelle période d'évaluation.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nom de la période"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="period">Type de période</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type de période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TRIMESTRE_1">1er Trimestre</SelectItem>
                    <SelectItem value="TRIMESTRE_2">2ème Trimestre</SelectItem>
                    <SelectItem value="TRIMESTRE_3">3ème Trimestre</SelectItem>
                    <SelectItem value="SEMESTRE_1">1er Semestre</SelectItem>
                    <SelectItem value="SEMESTRE_2">2ème Semestre</SelectItem>
                    <SelectItem value="ANNEE">Année</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="schoolYear">Année scolaire</Label>
                <Input
                  id="schoolYear"
                  value={schoolYear}
                  onChange={(e) => setSchoolYear(e.target.value)}
                  placeholder="2023-2024"
                />
              </div>
              <div>
                <Label htmlFor="startDate">Date de début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="endDate">Date de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                <Label htmlFor="isActive">Période active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreatePeriod}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing a period */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier la période</DialogTitle>
            <DialogDescription>Modifiez les détails de cette période.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="edit-name">Nom</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nom de la période"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-startDate">Date de début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="edit-endDate">Date de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch id="edit-isActive" checked={isActive} onCheckedChange={setIsActive} />
                <Label htmlFor="edit-isActive">Période active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdatePeriod}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for deleting a period */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la période</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette période ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeletePeriod}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
