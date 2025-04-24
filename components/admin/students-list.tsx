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
import { MoreHorizontal, FileText, Mail, Phone, AlertTriangle } from "lucide-react"

interface StudentsListProps {
  level?: "college" | "lycee"
}

const students = [
  {
    id: 1,
    name: "Emma Martin",
    avatar: "/placeholder.svg",
    initials: "EM",
    class: "6ème A",
    level: "college",
    birthdate: "12/05/2011",
    email: "parent.martin@example.com",
    phone: "06 12 34 56 78",
    status: "active",
  },
  {
    id: 2,
    name: "Lucas Dubois",
    avatar: "/placeholder.svg",
    initials: "LD",
    class: "5ème B",
    level: "college",
    birthdate: "23/09/2010",
    email: "parent.dubois@example.com",
    phone: "06 23 45 67 89",
    status: "warning",
  },
  {
    id: 3,
    name: "Chloé Bernard",
    avatar: "/placeholder.svg",
    initials: "CB",
    class: "4ème C",
    level: "college",
    birthdate: "05/03/2009",
    email: "parent.bernard@example.com",
    phone: "06 34 56 78 90",
    status: "active",
  },
  {
    id: 4,
    name: "Nathan Petit",
    avatar: "/placeholder.svg",
    initials: "NP",
    class: "3ème A",
    level: "college",
    birthdate: "17/11/2008",
    email: "parent.petit@example.com",
    phone: "06 45 67 89 01",
    status: "active",
  },
  {
    id: 5,
    name: "Léa Moreau",
    avatar: "/placeholder.svg",
    initials: "LM",
    class: "2nde 3",
    level: "lycee",
    birthdate: "30/07/2007",
    email: "parent.moreau@example.com",
    phone: "06 56 78 90 12",
    status: "active",
  },
  {
    id: 6,
    name: "Hugo Lefebvre",
    avatar: "/placeholder.svg",
    initials: "HL",
    class: "1ère S2",
    level: "lycee",
    birthdate: "14/02/2006",
    email: "parent.lefebvre@example.com",
    phone: "06 67 89 01 23",
    status: "warning",
  },
  {
    id: 7,
    name: "Manon Leroy",
    avatar: "/placeholder.svg",
    initials: "ML",
    class: "Term ES1",
    level: "lycee",
    birthdate: "09/12/2005",
    email: "parent.leroy@example.com",
    phone: "06 78 90 12 34",
    status: "active",
  },
]

export function StudentsList({ level }: StudentsListProps) {
  const [page, setPage] = useState(1)
  const pageSize = 5

  const filteredStudents = level ? students.filter((student) => student.level === level) : students

  const paginatedStudents = filteredStudents.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(filteredStudents.length / pageSize)

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Élève</TableHead>
              <TableHead className="hidden md:table-cell">Classe</TableHead>
              <TableHead className="hidden md:table-cell">Date de naissance</TableHead>
              <TableHead className="hidden lg:table-cell">Contact</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                      <AvatarFallback>{student.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground md:hidden">{student.class}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{student.class}</TableCell>
                <TableCell className="hidden md:table-cell">{student.birthdate}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center text-xs">
                      <Mail className="mr-1 h-3 w-3" />
                      {student.email}
                    </div>
                    <div className="flex items-center text-xs">
                      <Phone className="mr-1 h-3 w-3" />
                      {student.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={student.status === "active" ? "outline" : "outline"}
                    className={
                      student.status === "active"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-orange-500/10 text-orange-500"
                    }
                  >
                    {student.status === "active" ? "Actif" : "Attention"}
                    {student.status === "warning" && <AlertTriangle className="ml-1 h-3 w-3 text-orange-500" />}
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
                        Voir le dossier
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Contacter les parents
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Signaler un problème</DropdownMenuItem>
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
