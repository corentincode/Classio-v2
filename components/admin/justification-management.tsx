"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, MoreHorizontal, Eye, CheckCircle, XCircle, Clock, FileCheck } from "lucide-react"

interface Justification {
  id: string
  student: string
  class: string
  date: string
  type: "absence" | "late"
  duration?: string
  status: "pending" | "approved" | "rejected"
  reason: string
  document: boolean
}

const justificationData: Justification[] = [
  {
    id: "1",
    student: "Lucas Bernard",
    class: "3ème A",
    date: "12/04/2023",
    type: "absence",
    status: "pending",
    reason: "Rendez-vous médical",
    document: true,
  },
  {
    id: "2",
    student: "Chloé Dubois",
    class: "3ème A",
    date: "12/04/2023",
    type: "late",
    duration: "15 min",
    status: "approved",
    reason: "Retard de bus",
    document: false,
  },
  {
    id: "3",
    student: "Théo Simon",
    class: "3ème B",
    date: "12/04/2023",
    type: "absence",
    status: "approved",
    reason: "Maladie",
    document: true,
  },
  {
    id: "4",
    student: "Nathan Thomas",
    class: "3ème A",
    date: "11/04/2023",
    type: "absence",
    status: "rejected",
    reason: "Raison familiale",
    document: false,
  },
  {
    id: "5",
    student: "Hugo Petit",
    class: "3ème B",
    date: "11/04/2023",
    type: "late",
    duration: "10 min",
    status: "pending",
    reason: "Problème de transport",
    document: false,
  },
]

const statusConfig = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80", icon: Clock },
  approved: { label: "Approuvé", color: "bg-green-100 text-green-800 hover:bg-green-100/80", icon: CheckCircle },
  rejected: { label: "Rejeté", color: "bg-red-100 text-red-800 hover:bg-red-100/80", icon: XCircle },
}

const typeConfig = {
  absence: { label: "Absence", icon: XCircle },
  late: { label: "Retard", icon: Clock },
}

export function JustificationManagement() {
  const [selectedJustification, setSelectedJustification] = useState<Justification | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const handleView = (justification: Justification) => {
    setSelectedJustification(justification)
    setViewDialogOpen(true)
  }

  const handleApprove = (justification: Justification) => {
    setSelectedJustification(justification)
    setApproveDialogOpen(true)
  }

  const handleReject = (justification: Justification) => {
    setSelectedJustification(justification)
    setRejectDialogOpen(true)
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Élève</TableHead>
              <TableHead>Classe</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Document</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {justificationData.map((justification) => {
              const StatusIcon = statusConfig[justification.status].icon
              const TypeIcon = typeConfig[justification.type].icon
              return (
                <TableRow key={justification.id}>
                  <TableCell className="font-medium">{justification.student}</TableCell>
                  <TableCell>{justification.class}</TableCell>
                  <TableCell>{justification.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        <TypeIcon className="mr-1 h-3.5 w-3.5" />
                        {typeConfig[justification.type].label}
                        {justification.duration && ` (${justification.duration})`}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusConfig[justification.status].color}>
                      <StatusIcon className="mr-1 h-3.5 w-3.5" />
                      {statusConfig[justification.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {justification.document ? (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100/80">
                        <FileCheck className="mr-1 h-3.5 w-3.5" />
                        Document
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Aucun</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(justification)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir les détails
                        </DropdownMenuItem>
                        {justification.status === "pending" && (
                          <>
                            <DropdownMenuItem onClick={() => handleApprove(justification)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approuver
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(justification)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Rejeter
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Dialogue de visualisation */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du justificatif</DialogTitle>
            <DialogDescription>Informations sur le justificatif d'absence ou de retard</DialogDescription>
          </DialogHeader>
          {selectedJustification && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Élève</Label>
                  <p className="text-sm font-medium">{selectedJustification.student}</p>
                </div>
                <div>
                  <Label>Classe</Label>
                  <p className="text-sm font-medium">{selectedJustification.class}</p>
                </div>
                <div>
                  <Label>Date</Label>
                  <p className="text-sm font-medium">{selectedJustification.date}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <p className="text-sm font-medium">
                    {typeConfig[selectedJustification.type].label}
                    {selectedJustification.duration && ` (${selectedJustification.duration})`}
                  </p>
                </div>
              </div>
              <div>
                <Label>Motif</Label>
                <p className="text-sm mt-1 p-2 border rounded-md bg-muted/50">{selectedJustification.reason}</p>
              </div>
              {selectedJustification.document && (
                <div>
                  <Label>Document justificatif</Label>
                  <div className="mt-1 p-4 border rounded-md bg-muted/50 flex items-center justify-center">
                    <Button variant="outline" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Télécharger le document
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialogue d'approbation */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approuver le justificatif</DialogTitle>
            <DialogDescription>Vous êtes sur le point d'approuver ce justificatif</DialogDescription>
          </DialogHeader>
          {selectedJustification && (
            <div className="space-y-4 py-2">
              <p>
                Vous allez approuver le justificatif de{" "}
                {selectedJustification.type === "absence" ? "l'absence" : "retard"} de{" "}
                <strong>{selectedJustification.student}</strong> du {selectedJustification.date}.
              </p>
              <p className="text-sm text-muted-foreground">
                Cette action marquera l'absence comme justifiée dans le système.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => setApproveDialogOpen(false)}>Confirmer l'approbation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de rejet */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter le justificatif</DialogTitle>
            <DialogDescription>Veuillez indiquer la raison du rejet</DialogDescription>
          </DialogHeader>
          {selectedJustification && (
            <div className="space-y-4 py-2">
              <p>
                Vous allez rejeter le justificatif de{" "}
                {selectedJustification.type === "absence" ? "l'absence" : "retard"} de{" "}
                <strong>{selectedJustification.student}</strong> du {selectedJustification.date}.
              </p>
              <div className="space-y-2">
                <Label htmlFor="reject-reason">Motif du rejet</Label>
                <Textarea
                  id="reject-reason"
                  placeholder="Veuillez indiquer pourquoi ce justificatif est rejeté..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={() => setRejectDialogOpen(false)} disabled={!rejectReason.trim()}>
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
