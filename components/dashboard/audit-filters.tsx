"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

export function AuditFilters() {
  return (
    <div className="grid gap-4 md:grid-cols-4 w-full max-w-full">
      <Select defaultValue="all">
        <SelectTrigger>
          <SelectValue placeholder="Type d'action" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les actions</SelectItem>
          <SelectItem value="login">Connexion</SelectItem>
          <SelectItem value="create">Création</SelectItem>
          <SelectItem value="update">Modification</SelectItem>
          <SelectItem value="delete">Suppression</SelectItem>
          <SelectItem value="export">Export</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger>
          <SelectValue placeholder="Utilisateur" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les utilisateurs</SelectItem>
          <SelectItem value="admin">Administrateurs</SelectItem>
          <SelectItem value="teacher">Enseignants</SelectItem>
          <SelectItem value="student">Élèves</SelectItem>
          <SelectItem value="parent">Parents</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger>
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="success">Succès</SelectItem>
          <SelectItem value="failure">Échec</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Input placeholder="Rechercher..." className="flex-1" />
        <Button variant="outline" size="icon" className="h-10 w-10">
          <X className="h-4 w-4" />
          <span className="sr-only">Réinitialiser les filtres</span>
        </Button>
      </div>
    </div>
  )
}
