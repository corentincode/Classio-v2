"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash, Eye, Mail } from "lucide-react"

export function EmailCampaigns() {
  const [showForm, setShowForm] = useState(false)

  // Exemple de campagnes d'emails
  const campaigns = [
    {
      id: 1,
      title: "Informations rentrée scolaire 2023-2024",
      recipients: "Parents",
      sentTo: 450,
      opened: 380,
      date: "15/06/2023",
      status: "Envoyée",
    },
    {
      id: 2,
      title: "Rappel - Réunion parents-professeurs",
      recipients: "Parents 6ème, 5ème",
      sentTo: 180,
      opened: 150,
      date: "12/05/2023",
      status: "Envoyée",
    },
    {
      id: 3,
      title: "Informations examens - Baccalauréat 2023",
      recipients: "Parents, Élèves Term",
      sentTo: 120,
      opened: 115,
      date: "05/05/2023",
      status: "Envoyée",
    },
    {
      id: 4,
      title: "Invitation - Journée portes ouvertes",
      recipients: "Tous",
      sentTo: 0,
      opened: 0,
      date: "20/05/2023",
      status: "Programmée",
    },
    {
      id: 5,
      title: "Informations voyage scolaire - Espagne",
      recipients: "Parents, Élèves 4ème",
      sentTo: 0,
      opened: 0,
      date: "",
      status: "Brouillon",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Campagnes d'emails</h3>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle campagne
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Titre de la campagne
              </label>
              <Input id="title" placeholder="Titre de la campagne" />
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Objet de l'email
              </label>
              <Input id="subject" placeholder="Objet de l'email" />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Contenu
              </label>
              <Textarea id="content" placeholder="Contenu de l'email" rows={10} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="recipients" className="text-sm font-medium">
                  Destinataires
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner les destinataires" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="parents">Parents</SelectItem>
                    <SelectItem value="students">Élèves</SelectItem>
                    <SelectItem value="teachers">Enseignants</SelectItem>
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
                    <SelectItem value="send">Envoyer maintenant</SelectItem>
                    <SelectItem value="schedule">Programmer</SelectItem>
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
              <TableHead className="hidden md:table-cell">Envoyés</TableHead>
              <TableHead className="hidden md:table-cell">Ouverts</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.title}</TableCell>
                <TableCell className="hidden md:table-cell">{campaign.recipients}</TableCell>
                <TableCell className="hidden md:table-cell">{campaign.sentTo}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {campaign.status === "Envoyée" ? (
                    <>
                      {campaign.opened} ({Math.round((campaign.opened / campaign.sentTo) * 100)}%)
                    </>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">{campaign.date || "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      campaign.status === "Envoyée"
                        ? "bg-green-500/10 text-green-500"
                        : campaign.status === "Programmée"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-gray-500/10 text-gray-500"
                    }
                  >
                    {campaign.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Voir</span>
                    </Button>
                    {campaign.status !== "Envoyée" && (
                      <>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                        {campaign.status === "Brouillon" && (
                          <Button variant="ghost" size="icon">
                            <Mail className="h-4 w-4" />
                            <span className="sr-only">Envoyer</span>
                          </Button>
                        )}
                      </>
                    )}
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
