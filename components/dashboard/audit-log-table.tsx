"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown } from "lucide-react"

// Données fictives pour la démonstration
const auditLogs = [
  {
    id: "log1",
    action: "Connexion",
    user: "Thomas Dubois",
    userRole: "Administrateur",
    resource: "Système",
    timestamp: "2023-05-15 14:32:45",
    ip: "192.168.1.45",
    status: "success",
  },
  {
    id: "log2",
    action: "Création d'utilisateur",
    user: "Marie Laurent",
    userRole: "Administrateur",
    resource: "Utilisateur: Jean Martin",
    timestamp: "2023-05-15 13:21:10",
    ip: "192.168.1.46",
    status: "success",
  },
  {
    id: "log3",
    action: "Modification de permissions",
    user: "Thomas Dubois",
    userRole: "Administrateur",
    resource: "Groupe: Enseignants",
    timestamp: "2023-05-15 11:45:22",
    ip: "192.168.1.45",
    status: "success",
  },
  {
    id: "log4",
    action: "Tentative de connexion",
    user: "Inconnu",
    userRole: "N/A",
    resource: "Système",
    timestamp: "2023-05-15 10:12:33",
    ip: "45.67.89.123",
    status: "failure",
  },
  {
    id: "log5",
    action: "Export de données",
    user: "Sophie Moreau",
    userRole: "Administrateur",
    resource: "Données élèves: Collège Albert Camus",
    timestamp: "2023-05-15 09:05:17",
    ip: "192.168.1.48",
    status: "success",
  },
  {
    id: "log6",
    action: "Suppression d'utilisateur",
    user: "Thomas Dubois",
    userRole: "Administrateur",
    resource: "Utilisateur: Pierre Lefebvre",
    timestamp: "2023-05-14 16:42:51",
    ip: "192.168.1.45",
    status: "success",
  },
  {
    id: "log7",
    action: "Modification de données sensibles",
    user: "Jean Dupont",
    userRole: "Enseignant",
    resource: "Dossier élève: Emma Bernard",
    timestamp: "2023-05-14 15:30:19",
    ip: "192.168.1.50",
    status: "success",
  },
  {
    id: "log8",
    action: "Tentative d'accès non autorisé",
    user: "Jean Dupont",
    userRole: "Enseignant",
    resource: "Module Administration",
    timestamp: "2023-05-14 14:22:05",
    ip: "192.168.1.50",
    status: "failure",
  },
]

// Remplacer la fonction AuditLogTable par cette version améliorée pour mobile
export function AuditLogTable() {
  const [page, setPage] = useState(1)
  const [expandedLog, setExpandedLog] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const itemsPerPage = 5
  const totalPages = Math.ceil(auditLogs.length / itemsPerPage)

  // Détection de la taille d'écran
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  const paginatedLogs = auditLogs.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const toggleExpandLog = (logId: string) => {
    setExpandedLog(expandedLog === logId ? null : logId)
  }

  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      {/* Version mobile du tableau */}
      {isMobile ? (
        <div className="space-y-3">
          {paginatedLogs.map((log) => (
            <div key={log.id} className="rounded-md border overflow-hidden">
              <div
                className="flex items-center p-3 cursor-pointer bg-background"
                onClick={() => toggleExpandLog(log.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{log.action}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {log.user} • {log.timestamp}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    log.status === "success"
                      ? "bg-green-500/10 text-green-500 ml-2"
                      : "bg-destructive/10 text-destructive ml-2"
                  }
                >
                  {log.status === "success" ? "Succès" : "Échec"}
                </Badge>
                <ChevronDown
                  className={`h-4 w-4 ml-2 transition-transform ${expandedLog === log.id ? "rotate-180" : ""}`}
                />
              </div>

              {expandedLog === log.id && (
                <div className="p-3 border-t bg-muted/30 space-y-2">
                  <div className="grid gap-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="font-medium text-xs text-muted-foreground">Utilisateur</div>
                        <div>{log.user}</div>
                        <div className="text-xs text-muted-foreground">{log.userRole}</div>
                      </div>
                      <div>
                        <div className="font-medium text-xs text-muted-foreground">Date et heure</div>
                        <div>{log.timestamp}</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-xs text-muted-foreground">Ressource</div>
                      <div>{log.resource}</div>
                    </div>
                    <div>
                      <div className="font-medium text-xs text-muted-foreground">Adresse IP</div>
                      <div>{log.ip}</div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      Détails
                    </Button>
                    <Button variant="ghost" size="sm">
                      Exporter
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Version desktop du tableau (inchangée)
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Ressource</TableHead>
                <TableHead>Date et heure</TableHead>
                <TableHead>Adresse IP</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>
                    <div>{log.user}</div>
                    <div className="text-xs text-muted-foreground">{log.userRole}</div>
                  </TableCell>
                  <TableCell>{log.resource}</TableCell>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>{log.ip}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        log.status === "success"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-destructive/10 text-destructive"
                      }
                    >
                      {log.status === "success" ? "Succès" : "Échec"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Affichage de <strong>{(page - 1) * itemsPerPage + 1}</strong> à{" "}
          <strong>{Math.min(page * itemsPerPage, auditLogs.length)}</strong> sur <strong>{auditLogs.length}</strong>{" "}
          entrées
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={itemsPerPage.toString()}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={itemsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              &lt;
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              &gt;
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
