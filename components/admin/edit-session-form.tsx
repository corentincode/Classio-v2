"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

interface EditSessionFormProps {
  establishmentId: string
  classId: string
  courseId: string
  sessionData: Session
  open: boolean
  onOpenChange: (open: boolean) => void
  onSessionUpdated: (updatedSession: Session) => void
}

export function EditSessionForm({
  establishmentId,
  classId,
  courseId,
  sessionData,
  open,
  onOpenChange,
  onSessionUpdated,
}: EditSessionFormProps) {
  const [formData, setFormData] = useState({
    title: sessionData.title || "",
    description: sessionData.description || "",
    dayOfWeek: sessionData.dayOfWeek.toString(),
    startTime: "",
    endTime: "",
    recurrent: sessionData.recurrent,
    room: sessionData.room || "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Convertir les dates ISO en heures locales pour les inputs de type time
  useEffect(() => {
    if (sessionData) {
      const startDate = new Date(sessionData.startTime)
      const startHours = startDate.getHours().toString().padStart(2, "0")
      const startMinutes = startDate.getMinutes().toString().padStart(2, "0")

      const endDate = new Date(sessionData.endTime)
      const endHours = endDate.getHours().toString().padStart(2, "0")
      const endMinutes = endDate.getMinutes().toString().padStart(2, "0")

      setFormData((prev) => ({
        ...prev,
        startTime: `${startHours}:${startMinutes}`,
        endTime: `${endHours}:${endMinutes}`,
      }))
    }
  }, [sessionData])

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
      // Convertir les heures en dates complètes pour l'API
      const today = new Date()
      const startDate = new Date(today)
      const [startHours, startMinutes] = formData.startTime.split(":")
      startDate.setHours(Number.parseInt(startHours), Number.parseInt(startMinutes), 0, 0)

      const endDate = new Date(today)
      const [endHours, endMinutes] = formData.endTime.split(":")
      endDate.setHours(Number.parseInt(endHours), Number.parseInt(endMinutes), 0, 0)

      const response = await fetch(
        `/api/establishments/${establishmentId}/classes/${classId}/courses/${courseId}/sessions/${sessionData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title || null,
            description: formData.description || null,
            dayOfWeek: Number.parseInt(formData.dayOfWeek),
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
            recurrent: formData.recurrent,
            room: formData.room || null,
          }),
        },
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Échec de la modification de la session")
      }

      const updatedSession = await response.json()

      // Notifier le parent
      onSessionUpdated(updatedSession)

      // Fermer le dialogue
      onOpenChange(false)

      // Afficher un message de succès
      toast({
        title: "Session modifiée",
        description: "La session a été modifiée avec succès.",
      })
    } catch (err: any) {
      console.error("Error updating session:", err)
      setError(err.message || "Une erreur s'est produite")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Modifier la session</DialogTitle>
          <DialogDescription>Mettez à jour les informations de la session.</DialogDescription>
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
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement en cours..." : "Enregistrer les modifications"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
