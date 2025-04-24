"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const deletionRequests = [
  {
    id: "del1",
    requestor: "Pierre Martin",
    requestorType: "Ancien élève",
    requestDate: "14/05/2023",
    dataRequested: "Suppression complète du compte et des données associées",
    status: "pending",
    dueDate: "28/05/2023",
    impact: "high",
  },
  {
    id: "del2",
    requestor: "Lucie Bernard",
    requestorType: "Parent",
    requestDate: "10/05/2023",
    dataRequested: "Suppression des données de santé de l'élève Emma Bernard",
    status: "processing",
    dueDate: "24/05/2023",
    impact: "medium",
  },
  {
    id: "del3",
    requestor: "Marc Petit",
    requestorType: "Ancien enseignant",
    requestDate: "02/05/2023",
    dataRequested: "Suppression des données personnelles",
    status: "completed",
    dueDate: "16/05/2023",
    completionDate: "15/05/2023",
    impact: "low",
  },
]

export function DataDeletionRequests() {
  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Attention</AlertTitle>
        <AlertDescription>
          Les demandes de suppression de données sont irréversibles. Assurez-vous de vérifier les implications légales
          et de conserver les données nécessaires aux obligations légales.
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap items-center justify-between gap-2 w-full max-w-full">
        <p className="text-sm text-muted-foreground">
          Gérez les demandes de suppression de données personnelles (Article 17 du RGPD - Droit à l'effacement).
        </p>
        <Button variant="outline">Exporter le registre</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Demandeur</TableHead>
              <TableHead>Date de demande</TableHead>
              <TableHead>Données à supprimer</TableHead>
              <TableHead>Impact</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deletionRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="font-medium">{request.requestor}</div>
                  <div className="text-xs text-muted-foreground">{request.requestorType}</div>
                </TableCell>
                <TableCell>
                  <div>{request.requestDate}</div>
                  <div className="text-xs text-muted-foreground">Échéance: {request.dueDate}</div>
                </TableCell>
                <TableCell>{request.dataRequested}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      request.impact === "high"
                        ? "bg-destructive/10 text-destructive"
                        : request.impact === "medium"
                          ? "bg-orange-500/10 text-orange-500"
                          : "bg-yellow-500/10 text-yellow-500"
                    }
                  >
                    {request.impact === "high" && "Élevé"}
                    {request.impact === "medium" && "Moyen"}
                    {request.impact === "low" && "Faible"}
                  </Badge>
                </TableCell>
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
                  <div className="flex gap-2">
                    {request.status !== "completed" ? (
                      <>
                        <Button size="sm" variant="destructive">
                          Supprimer
                        </Button>
                        <Button size="sm" variant="outline">
                          Refuser
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline">
                        Certificat
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-md border p-4 bg-muted/50">
        <h3 className="text-sm font-medium mb-2">Exceptions au droit à l'effacement</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
          <li>Exercice du droit à la liberté d'expression et d'information</li>
          <li>Respect d'une obligation légale</li>
          <li>Motifs d'intérêt public dans le domaine de la santé publique</li>
          <li>Archivage dans l'intérêt public, recherche scientifique ou historique</li>
          <li>Constatation, exercice ou défense de droits en justice</li>
        </ul>
      </div>
    </div>
  )
}
