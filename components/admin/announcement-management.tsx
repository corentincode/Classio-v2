"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash, Eye } from "lucide-react"

export function AnnouncementManagement() {
  const [showForm, setShowForm] = useState(false)

  // Exemple d'annonces
  const announcements = [
    {
      id: 1,
      title: "Réunion parents-professeurs",
      content:
        "Une réunion parents-professeurs aura lieu le jeudi 18 mai de 16h30 à 20h00 dans le hall principal de l'établissement.",
      target: "Tous",
      author: "Philippe Moreau",
      date: "10/05/2023",
      status: "Publiée",
    },
    {
      id: 2,
      title: "Sortie scolaire - Musée d'Histoire",
      content:
        "Les classes de 4ème participeront à une sortie au Musée d'Histoire Naturelle le vendredi 19 mai. Départ à 9h00, retour prévu à 16h00.",
      target: "4ème",
      author: "Julie Bernard",
      date: "08/05/2023",
      status: "Publiée",
    },
    {
      id: 3,
      title: "Formation premiers secours",
      content:
        "Une formation aux premiers secours est proposée au personnel volontaire le mardi 23 mai de 14h00 à 17h00 au gymnase.",
      target: "Personnel",
      author: "Nathalie Roux",
      date: "05/05/2023",
      status: "Publiée",
    },
    {
      id: 4,
      title: "Journée portes ouvertes",
      content:
        "L'établissement organise une journée portes ouvertes le samedi 27 mai de 10h00 à 16h00. Tous les personnels sont attendus pour cette occasion.",
      target: "Tous",
      author: "Philippe Moreau",
      date: "03/05/2023",
      status: "Brouillon",
    },
    {
      id: 5,
      title: "Conseil de classe - 3ème trimestre",
      content:
        "Les conseils de classe du 3ème trimestre se dérouleront du 12 au 23 juin selon le planning qui sera communiqué ultérieurement.",
      target: "Enseignants",
      author: "Sophie Dupont",
      date: "01/05/2023",
      status: "Programmée",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Liste des annonces</h3>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle annonce
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Titre
              </label>
              <Input id="title" placeholder="Titre de l'annonce" />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Contenu
              </label>
              <Textarea id="content" placeholder="Contenu de l'annonce" rows={5} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="target" className="text-sm font-medium">
                  Destinataires
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner les destinataires" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="teachers">Enseignants</SelectItem>
                    <SelectItem value="students">Élèves</SelectItem>
                    <SelectItem value="parents">Parents</SelectItem>
                    <SelectItem value="staff">Personnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Statut
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Publier maintenant</SelectItem>
                    <SelectItem value="scheduled">Programmer</SelectItem>
                    <SelectItem value="draft">Enregistrer comme brouillon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Annuler
              </Button>
              <Button>Enregistrer</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead className="hidden md:table-cell">Destinataires</TableHead>
              <TableHead className="hidden md:table-cell">Auteur</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell className="font-medium">{announcement.title}</TableCell>
                <TableCell className="hidden md:table-cell">{announcement.target}</TableCell>
                <TableCell className="hidden md:table-cell">{announcement.author}</TableCell>
                <TableCell className="hidden md:table-cell">{announcement.date}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      announcement.status === "Publiée"
                        ? "bg-green-500/10 text-green-500"
                        : announcement.status === "Programmée"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-gray-500/10 text-gray-500"
                    }
                  >
                    {announcement.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Voir</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
