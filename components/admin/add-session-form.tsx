"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type Session = {
  id: string
  title: string | null
  description: string | null
  dayOfWeek: number
  startTime: string
  endTime: string
  recurrent: boolean
  room: string | null
}

interface AddSessionFormProps {
  establishmentId: string
  classId: string
  courseId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSessionAdded: (newSession: Session) => void
}

export function AddSessionForm({
  establishmentId,
  classId,
  courseId,
  open,
  onOpenChange,
  onSessionAdded,
}: AddSessionFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dayOfWeek: "1", // Lundi par défaut
    startTime: "08:00",
    endTime: "09:00",
    recurrent: true,
    room: "",
  })
  const [specificDate, setSpecificDate] = useState<Date | undefined>(new Date())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectDay = (value: string) => {
    setFormData((prev) => ({ ...prev, dayOfWeek: value }))
  }

  const handleToggleRecurrent = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, recurrent: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let startDate: Date
      let endDate: Date

      if (formData.recurrent) {
        // Pour les sessions récurrentes, on utilise la date du jour pour stocker l'heure
        const today = new Date()
        const [startHours, startMinutes] = formData.startTime.split(":")
        startDate = new Date(today)
        startDate.setHours(Number.parseInt(startHours), Number.parseInt(startMinutes), 0, 0)

        const [endHours, endMinutes] = formData.endTime.split(":")
        endDate = new Date(today)
        endDate.setHours(Number.parseInt(endHours), Number.parseInt(endMinutes), 0, 0)
      } else {
        // Pour les sessions uniques, on utilise la date spécifique sélectionnée
        if (!specificDate) {
          toast({
            title: "Erreur",
            description: "Veuillez sélectionner une date pour cette session unique",
            variant: "destructive",
          })
          setLoading(false)
          return
        }

        // Créer des dates avec la date spécifique et les heures sélectionnées
        const [startHours, startMinutes] = formData.startTime.split(":")
        startDate = new Date(specificDate)
        startDate.setHours(Number.parseInt(startHours), Number.parseInt(startMinutes), 0, 0)

        const [endHours, endMinutes] = formData.endTime.split(":")
        endDate = new Date(specificDate)
        endDate.setHours(Number.parseInt(endHours), Number.parseInt(endMinutes), 0, 0)
      }

      // Convertir le jour de la semaine en nombre (0-6, où 0 = dimanche, 1 = lundi, etc.)
      const dayNumber = formData.recurrent ? Number.parseInt(formData.dayOfWeek) : specificDate!.getDay()

      const response = await fetch(
        `/api/establishments/${establishmentId}/classes/${classId}/courses/${courseId}/sessions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title || null,
            description: formData.description || null,
            dayOfWeek: dayNumber,
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
            recurrent: formData.recurrent,
            room: formData.room || null,
          }),
        },
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Échec de la création de la session")
      }

      const newSession = await response.json()

      // Notifier le parent
      onSessionAdded(newSession)

      // Réinitialiser le formulaire
      setFormData({
        title: "",
        description: "",
        dayOfWeek: "1",
        startTime: "08:00",
        endTime: "09:00",
        recurrent: true,
        room: "",
      })
      setSpecificDate(new Date())

      // Fermer le dialogue
      onOpenChange(false)

      // Afficher un message de succès
      toast({
        title: "Session créée",
        description: "La session a été créée avec succès.",
      })
    } catch (err: any) {
      console.error("Error creating session:", err)
      setError(err.message || "Une erreur s'est produite")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle session</DialogTitle>
          <DialogDescription>Remplissez les informations pour créer une nouvelle session.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Titre
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Optionnel"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Optionnel"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recurrent" className="text-right">
                Récurrent
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch id="recurrent" checked={formData.recurrent} onCheckedChange={handleToggleRecurrent} />
                <Label htmlFor="recurrent" className="text-sm text-muted-foreground">
                  {formData.recurrent ? "Session hebdomadaire" : "Session unique"}
                </Label>
              </div>
            </div>

            {formData.recurrent ? (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dayOfWeek" className="text-right">
                  Jour *
                </Label>
                <Select value={formData.dayOfWeek} onValueChange={handleSelectDay} required>
                  <SelectTrigger id="dayOfWeek" className="col-span-3">
                    <SelectValue placeholder="Sélectionner un jour" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Dimanche</SelectItem>
                    <SelectItem value="1">Lundi</SelectItem>
                    <SelectItem value="2">Mardi</SelectItem>
                    <SelectItem value="3">Mercredi</SelectItem>
                    <SelectItem value="4">Jeudi</SelectItem>
                    <SelectItem value="5">Vendredi</SelectItem>
                    <SelectItem value="6">Samedi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="specificDate" className="text-right">
                  Date *
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="specificDate"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !specificDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {specificDate ? (
                          format(specificDate, "PPP", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={specificDate}
                        onSelect={setSpecificDate}
                        initialFocus
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Heure de début *
              </Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                Heure de fin *
              </Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room" className="text-right">
                Salle
              </Label>
              <Input
                id="room"
                name="room"
                value={formData.room}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Optionnel"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Création en cours..." : "Créer la session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
