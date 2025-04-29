"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
}

interface Evaluation {
  id: string
  title: string
  description: string | null
  type: string
  date: string
  maxGrade: number
  coefficient: number
  isPublished: boolean
  periodId: string | null
  period: Period | null
  _count: {
    grades: number
  }
}

export function EvaluationsClient({ courseId, periods }: { courseId: string; periods: Period[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const establishmentId = searchParams.get("establishmentId")

  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentEvaluation, setCurrentEvaluation] = useState<Evaluation | null>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("CONTROLE")
  const [date, setDate] = useState<Date>(new Date())
  const [maxGrade, setMaxGrade] = useState(20)
  const [coefficient, setCoefficient] = useState(1)
  const [periodId, setPeriodId] = useState<string | null>(null)
  const [isPublished, setIsPublished] = useState(false)

  // Fetch evaluations
  const fetchEvaluations = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/courses/${courseId}/evaluations`)
      if (response.ok) {
        const data = await response.json()
        setEvaluations(data)
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les évaluations",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching evaluations:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération des évaluations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvaluations()
  }, [courseId])

  // Filter evaluations by period
  const filteredEvaluations =
    selectedPeriod === "all" ? evaluations : evaluations.filter((evaluation) => evaluation.periodId === selectedPeriod)

  // Reset form
  const resetForm = () => {
    setTitle("")
    setDescription("")
    setType("CONTROLE")
    setDate(new Date())
    setMaxGrade(20)
    setCoefficient(1)
    setPeriodId(null)
    setIsPublished(false)
  }

  // Open edit dialog
  const handleEdit = (evaluation: Evaluation) => {
    setCurrentEvaluation(evaluation)
    setTitle(evaluation.title)
    setDescription(evaluation.description || "")
    setType(evaluation.type)
    setDate(new Date(evaluation.date))
    setMaxGrade(evaluation.maxGrade)
    setCoefficient(evaluation.coefficient)
    setPeriodId(evaluation.periodId)
    setIsPublished(evaluation.isPublished)
    setIsEditDialogOpen(true)
  }

  // Open delete dialog
  const handleDelete = (evaluation: Evaluation) => {
    setCurrentEvaluation(evaluation)
    setIsDeleteDialogOpen(true)
  }

  // Create evaluation
  const handleCreateEvaluation = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/evaluations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          type,
          date,
          maxGrade,
          coefficient,
          periodId: periodId === "none" ? null : periodId,
          isPublished,
        }),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "L'évaluation a été créée avec succès",
        })
        fetchEvaluations()
        setIsAddDialogOpen(false)
        resetForm()
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.error || "Impossible de créer l'évaluation",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating evaluation:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'évaluation",
        variant: "destructive",
      })
    }
  }

  // Update evaluation
  const handleUpdateEvaluation = async () => {
    if (!currentEvaluation) return

    try {
      const response = await fetch(`/api/evaluations/${currentEvaluation.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          type,
          date,
          maxGrade,
          coefficient,
          periodId: periodId === "none" ? null : periodId,
          isPublished,
        }),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "L'évaluation a été mise à jour avec succès",
        })
        fetchEvaluations()
        setIsEditDialogOpen(false)
        resetForm()
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.error || "Impossible de mettre à jour l'évaluation",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating evaluation:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'évaluation",
        variant: "destructive",
      })
    }
  }

  // Delete evaluation
  const handleDeleteEvaluation = async () => {
    if (!currentEvaluation) return

    try {
      const response = await fetch(`/api/evaluations/${currentEvaluation.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "L'évaluation a été supprimée avec succès",
        })
        fetchEvaluations()
        setIsDeleteDialogOpen(false)
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.error || "Impossible de supprimer l'évaluation",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting evaluation:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'évaluation",
        variant: "destructive",
      })
    }
  }

  // Navigate to grades page
  const navigateToGrades = (evaluationId: string) => {
    router.push(`/professeur/evaluations/${evaluationId}/grades?establishmentId=${establishmentId || ""}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedPeriod}>
          <TabsList>
            <TabsTrigger value="all">Toutes les périodes</TabsTrigger>
            {periods.map((period) => (
              <TabsTrigger key={period.id} value={period.id}>
                {period.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button
          onClick={() => {
            resetForm()
            setIsAddDialogOpen(true)
          }}
          className="ml-4"
        >
          <Plus className="mr-2 h-4 w-4" /> Nouvelle évaluation
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : filteredEvaluations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 mb-4">Aucune évaluation pour cette période</p>
            <Button
              onClick={() => {
                resetForm()
                setIsAddDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Créer une évaluation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvaluations.map((evaluation) => (
            <Card
              key={evaluation.id}
              className={cn(
                "cursor-pointer hover:shadow-md transition-shadow",
                evaluation.isPublished ? "border-green-200" : "border-amber-200",
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{evaluation.title}</CardTitle>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(evaluation)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(evaluation)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                  <div>{format(new Date(evaluation.date), "dd MMMM yyyy", { locale: fr })}</div>
                  <div
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs",
                      evaluation.isPublished ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800",
                    )}
                  >
                    {evaluation.isPublished ? "Publié" : "Non publié"}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div>
                    <span className="font-medium">Type:</span>{" "}
                    {evaluation.type === "CONTROLE"
                      ? "Contrôle"
                      : evaluation.type === "DEVOIR"
                        ? "Devoir"
                        : evaluation.type === "EXAMEN"
                          ? "Examen"
                          : evaluation.type === "TP"
                            ? "TP"
                            : evaluation.type === "ORAL"
                              ? "Oral"
                              : evaluation.type === "PROJET"
                                ? "Projet"
                                : "Autre"}
                  </div>
                  <div>
                    <span className="font-medium">Coefficient:</span> {evaluation.coefficient}
                  </div>
                  <div>
                    <span className="font-medium">Note max:</span> {evaluation.maxGrade}
                  </div>
                  <div>
                    <span className="font-medium">Période:</span> {evaluation.period?.name || "Non définie"}
                  </div>
                </div>
                {evaluation.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{evaluation.description}</p>
                )}
                <Button variant="outline" className="w-full" onClick={() => navigateToGrades(evaluation.id)}>
                  {evaluation._count.grades > 0 ? `Voir les notes (${evaluation._count.grades})` : "Saisir les notes"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog for adding a new evaluation */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nouvelle évaluation</DialogTitle>
            <DialogDescription>Créez une nouvelle évaluation pour ce cours.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre de l'évaluation"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (optionnelle)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description de l'évaluation"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type d'évaluation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONTROLE">Contrôle</SelectItem>
                    <SelectItem value="DEVOIR">Devoir</SelectItem>
                    <SelectItem value="EXAMEN">Examen</SelectItem>
                    <SelectItem value="TP">TP</SelectItem>
                    <SelectItem value="ORAL">Oral</SelectItem>
                    <SelectItem value="PROJET">Projet</SelectItem>
                    <SelectItem value="AUTRE">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="maxGrade">Note maximale</Label>
                <Input
                  id="maxGrade"
                  type="number"
                  value={maxGrade}
                  onChange={(e) => setMaxGrade(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="coefficient">Coefficient</Label>
                <Input
                  id="coefficient"
                  type="number"
                  step="0.1"
                  value={coefficient}
                  onChange={(e) => setCoefficient(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="period">Période</Label>
                <Select value={periodId || "none"} onValueChange={setPeriodId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune période</SelectItem>
                    {periods.map((period) => (
                      <SelectItem key={period.id} value={period.id}>
                        {period.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch id="isPublished" checked={isPublished} onCheckedChange={setIsPublished} />
                <Label htmlFor="isPublished">Publier immédiatement</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateEvaluation}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing an evaluation */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier l'évaluation</DialogTitle>
            <DialogDescription>Modifiez les détails de cette évaluation.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="edit-title">Titre</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre de l'évaluation"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description (optionnelle)</Label>
                <Textarea
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description de l'évaluation"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-type">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type d'évaluation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONTROLE">Contrôle</SelectItem>
                    <SelectItem value="DEVOIR">Devoir</SelectItem>
                    <SelectItem value="EXAMEN">Examen</SelectItem>
                    <SelectItem value="TP">TP</SelectItem>
                    <SelectItem value="ORAL">Oral</SelectItem>
                    <SelectItem value="PROJET">Projet</SelectItem>
                    <SelectItem value="AUTRE">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="edit-maxGrade">Note maximale</Label>
                <Input
                  id="edit-maxGrade"
                  type="number"
                  value={maxGrade}
                  onChange={(e) => setMaxGrade(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="edit-coefficient">Coefficient</Label>
                <Input
                  id="edit-coefficient"
                  type="number"
                  step="0.1"
                  value={coefficient}
                  onChange={(e) => setCoefficient(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="edit-period">Période</Label>
                <Select value={periodId || "none"} onValueChange={setPeriodId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune période</SelectItem>
                    {periods.map((period) => (
                      <SelectItem key={period.id} value={period.id}>
                        {period.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch id="edit-isPublished" checked={isPublished} onCheckedChange={setIsPublished} />
                <Label htmlFor="edit-isPublished">Publier</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateEvaluation}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for deleting an evaluation */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'évaluation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette évaluation ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvaluation}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
