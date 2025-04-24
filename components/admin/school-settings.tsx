"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"

export function SchoolSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Informations générales</h3>
        <p className="text-sm text-muted-foreground">Configurez les informations de base de votre établissement.</p>
      </div>
      <Separator />
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="school-name">Nom de l'établissement</Label>
            <Input id="school-name" defaultValue="Lycée Victor Hugo" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="school-type">Type d'établissement</Label>
            <Select defaultValue="lycee-college">
              <SelectTrigger id="school-type">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ecole">École primaire</SelectItem>
                <SelectItem value="college">Collège</SelectItem>
                <SelectItem value="lycee">Lycée</SelectItem>
                <SelectItem value="lycee-college">Cité scolaire (Collège + Lycée)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="school-address">Adresse</Label>
          <Textarea id="school-address" defaultValue="12 rue des Écoles, 75005 Paris" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="school-phone">Téléphone</Label>
            <Input id="school-phone" defaultValue="01 23 45 67 89" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="school-email">Email</Label>
            <Input id="school-email" defaultValue="contact@lycee-victorhugo.fr" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="school-website">Site web</Label>
            <Input id="school-website" defaultValue="www.lycee-victorhugo.fr" />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium">Année scolaire</h3>
        <p className="text-sm text-muted-foreground">Configurez les dates de l'année scolaire en cours.</p>
      </div>
      <Separator />
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="school-year">Année scolaire</Label>
            <Input id="school-year" defaultValue="2023-2024" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="period-type">Type de période</Label>
            <Select defaultValue="trimestre">
              <SelectTrigger id="period-type">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trimestre">Trimestre</SelectItem>
                <SelectItem value="semestre">Semestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Date de rentrée</Label>
            <Input id="start-date" type="date" defaultValue="2023-09-04" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">Date de fin d'année</Label>
            <Input id="end-date" type="date" defaultValue="2024-07-05" />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium">Paramètres d'affichage</h3>
        <p className="text-sm text-muted-foreground">Configurez les options d'affichage pour les utilisateurs.</p>
      </div>
      <Separator />
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="show-grades">Afficher les notes aux élèves</Label>
            <p className="text-sm text-muted-foreground">
              Permet aux élèves de voir leurs notes dès qu'elles sont saisies.
            </p>
          </div>
          <Switch id="show-grades" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="show-attendance">Afficher les absences aux parents</Label>
            <p className="text-sm text-muted-foreground">
              Permet aux parents de voir les absences de leurs enfants en temps réel.
            </p>
          </div>
          <Switch id="show-attendance" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="show-average">Afficher les moyennes de classe</Label>
            <p className="text-sm text-muted-foreground">
              Permet aux élèves et parents de voir les moyennes de classe pour comparaison.
            </p>
          </div>
          <Switch id="show-average" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  )
}
