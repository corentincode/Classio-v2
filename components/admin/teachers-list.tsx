"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, FileText, Mail, Phone, Calendar } from "lucide-react"

const teachers = [
  {
    id: 1,
    name: "Sophie Dupont",
    avatar: "/placeholder.svg",
    initials: "SD",
    subject: "Mathématiques",
    email: "sophie.dupont@example.com",
    phone: "06 12 34 56 78",
    classes: ["2nde 1", "2nde 2", "1ère S1", "Term S2"],
    status: "Titulaire",
  },
  {
    id: 2,
    name: "Thomas Martin",
    avatar: "/placeholder.svg",
    initials: "TM",
    subject: "Français",
    email: "thomas.martin@example.com",
    phone: "06 23 45 67 89",
    classes: ["6ème A", "6ème B", "5ème A", "5ème B"],
    status: "Titulaire",
  },
  {
    id: 3,
    name: "Julie Bernard",
    avatar: "/placeholder.svg",
    initials: "JB",
    subject: "Histoire-Géographie",
    email: "julie.bernard@example.com",
    phone: "06 34 56 78 90",
    classes: ["4ème A", "4ème B", "3ème A", "3ème B"],
    status: "Titulaire",
  },
  {
    id: 4,
    name: "Nicolas Petit",
    avatar: "/placeholder.svg",
    initials: "NP",
    subject: "Physique-Chimie",
    email: "nicolas.petit@example.com",
    phone: "06 45 67 89 01",
    classes: ["2nde 3", "1ère S1", "1ère S2", "Term S1"],
    status: "Titulaire",
  },
  {
    id: 5,
    name: "Émilie Leroy",
    avatar: "/placeholder.svg",
    initials: "EL",
    subject: "Anglais",
    email: "emilie.leroy@example.com",
    phone: "06 56 78 90 12",
    classes: ["6ème A", "6ème B", "5ème A", "5ème B"],
    status: "Contractuel",
  },
  {
    id: 6,
    name: "Pierre Moreau",
    avatar: "/placeholder.svg",
    initials: "PM",
    subject: "EPS",
    email: "pierre.moreau@example.com",
    phone: "06 67 89 01 23",
    classes: ["6ème A", "6ème B", "5ème A", "5ème B", "4ème A", "4ème B"],
    status: "Titulaire",
  },
  {
    id: 7,
    name: "Marie Lefebvre",
    avatar: "/placeholder.svg",
    initials: "ML",
    subject: "SVT",
    email: "marie.lefebvre@example.com",
    phone: "06 78 90 12 34",
    classes: ["2nde 1", "2nde 2", "1ère S1", "1ère S2"],
    status: "Remplaçant",
  },
]

export function TeachersList() {
  const [page, setPage] = useState(1)
  const pageSize = 5

  const paginatedTeachers = teachers.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(teachers.length / pageSize)

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enseignant</TableHead>
              <TableHead className="hidden md:table-cell">Matière</TableHead>
              <TableHead className="hidden lg:table-cell">Classes</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTeachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={teacher.avatar || "/placeholder.svg"} alt={teacher.name} />
                      <AvatarFallback>{teacher.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{teacher.name}</p>
                      <p className="text-xs text-muted-foreground md:hidden">{teacher.subject}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{teacher.subject}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {teacher.classes.slice(0, 3).map((cls) => (
                      <Badge key={cls} variant="outline" className="bg-primary/10 text-primary">
                        {cls}
                      </Badge>
                    ))}
                    {teacher.classes.length > 3 && (
                      <Badge variant="outline" className="bg-muted text-muted-foreground">
                        +{teacher.classes.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center text-xs">
                      <Mail className="mr-1 h-3 w-3" />
                      {teacher.email}
                    </div>
                    <div className="flex items-center text-xs">
                      <Phone className="mr-1 h-3 w-3" />
                      {teacher.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      teacher.status === "Titulaire"
                        ? "bg-green-500/10 text-green-500"
                        : teacher.status === "Contractuel"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-orange-500/10 text-orange-500"
                    }
                  >
                    {teacher.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        Voir le profil
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Emploi du temps
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Envoyer un message
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
            Précédent
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
            Suivant
          </Button>
        </div>
      )}
    </div>
  )
}
