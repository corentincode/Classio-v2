"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const accessRequests = [
  {
    id: "req1",
    requestor: "Jean Dupont",
    requestorType: "Parent",
    requestDate: "12/05/2023",
    dataRequested: "Dossier complet de l'élève Marie Dupont",
    status: "pending",
    dueDate: "26/05/2023",
  },
  {
    id: "req2",
    requestor: "Sophie Moreau",
    requestorType: "Ancien élève",
    requestDate: "05/05/2023",
    dataRequested: "Bulletins scolaires 2020-2022",
    status: "processing",
    dueDate: "19/05/2023",
  },
  {
    id: "req3",
    requestor: "Thomas Dubois",
    requestorType: "Parent",
    requestDate: "28/04/2023",
    dataRequested: "Données de présence et notes de Lucas Dubois",
    status: "completed",
    dueDate: "12/05/2023",
    completionDate: "10/05/2023",
  },
  {
    id: "req4",
    requestor: "Marie Laurent",
    requestorType: "Enseignante",
    requestDate: "15/04/2023",
    dataRequested: "Données personnelles stockées",
    status: "completed",
    dueDate: "29/04/2023",
    completionDate: "25/04/2023",
  },
]

export function DataAccessRequests() {
  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 w-full max-w-full">
        <p className="text-sm text-muted-foreground">
          Gérez les demandes d'accès aux données personnelles (Article 15 du RGPD).
        </p>
        <Button variant="outline">Exporter le registre</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Demandeur</TableHead>
              <TableHead>Date de demande</TableHead>
              <TableHead>Données demandées</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date limite</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accessRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="font-medium">{request.requestor}</div>
                  <div className="text-xs text-muted-foreground">{request.requestorType}</div>
                </TableCell>
                <TableCell>{request.requestDate}</TableCell>
                <TableCell>{request.dataRequested}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      request.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : request.status === "processing"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-green-500/10 text-green-500"
                    }
                  >
                    {request.status === "pending" && "En attente"}
                    {request.status === "processing" && "En cours"}
                    {request.status === "completed" && "Terminée"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>{request.dueDate}</div>
                  {request.completionDate && (
                    <div className="text-xs text-muted-foreground">Complétée le: {request.completionDate}</div>
                  )}
                </TableCell>
                <TableCell>
                  {request.status !== "completed" ? (
                    <Button size="sm">Traiter</Button>
                  ) : (
                    <Button size="sm" variant="outline">
                      Détails
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-md border p-4 bg-blue-500/10">
        <h3 className="text-sm font-medium mb-2 text-blue-500">Rappel réglementaire</h3>
        <p className="text-sm text-muted-foreground">
          Les demandes d'accès aux données doivent être traitées dans un délai d'un mois à compter de leur réception,
          conformément à l'article 12 du RGPD. Ce délai peut être prolongé de deux mois supplémentaires si nécessaire,
          compte tenu de la complexité et du nombre de demandes.
        </p>
      </div>
    </div>
  )
}
