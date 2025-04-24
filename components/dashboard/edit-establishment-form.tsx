"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { toast } from "@/components/ui/use-toast"

type EstablishmentData = {
  id: string
  name: string
  code: string
  address: string | null
  city: string | null
  zipCode: string | null
  country: string | null
  phone: string | null
  email: string | null
  website: string | null
}

interface EditEstablishmentFormProps {
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditEstablishmentForm({ id, open, onOpenChange }: EditEstablishmentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<EstablishmentData>({
    id: "",
    name: "",
    code: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    phone: "",
    email: "",
    website: "",
  })
  const [dataLoaded, setDataLoaded] = useState(false)

  // Charger les données de l'établissement
  useEffect(() => {
    if (open && !dataLoaded) {
      const fetchEstablishment = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/establishments/${id}`)

          if (!response.ok) {
            throw new Error("Impossible de charger les données de l'établissement")
          }

          const data = await response.json()
          setFormData(data)
          setDataLoaded(true)
        } catch (error) {
          console.error("Error fetching establishment:", error)
          setError("Impossible de charger les données de l'établissement")
        } finally {
          setLoading(false)
        }
      }

      fetchEstablishment()
    }
  }, [id, open, dataLoaded])

  // Réinitialiser l'état lorsque le dialogue se ferme
  useEffect(() => {
    if (!open) {
      setDataLoaded(false)
    }
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch(`/api/establishments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Échec de la modification de l'établissement")
      }

      // Fermer le dialogue
      onOpenChange(false)

      // Afficher un message de succès
      toast({
        title: "Établissement modifié",
        description: "L'établissement a été modifié avec succès.",
      })

      // Rafraîchir la page pour afficher les modifications
      router.refresh()
    } catch (err: any) {
      console.error("Error updating establishment:", err)
      setError(err.message || "Une erreur s'est produite")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Modifier l'établissement</DialogTitle>
          <DialogDescription>Modifiez les informations de l'établissement.</DialogDescription>
        </DialogHeader>
        {loading && !dataLoaded ? (
          <div className="py-4 text-center">Chargement des données...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Code *
                </Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Adresse
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">
                  Ville
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="zipCode" className="text-right">
                  Code postal
                </Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode || ""}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country" className="text-right">
                  Pays
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country || ""}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="website" className="text-right">
                  Site web
                </Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website || ""}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Modification en cours..." : "Enregistrer les modifications"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
