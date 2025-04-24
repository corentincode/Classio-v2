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
import { MoreHorizontal, Users, Calendar, FileText, Mail } from "lucide-react"

const classes = [
  {
    id: 1,
    name: "6ème A",
    level: "Collège",
    students: 28,
    mainTeacher: "Thomas Martin",
    subjects: [
      "Français",
      "Mathématiques",
      "Histoire-Géo",
      "Anglais",
      "SVT",
      "Physique-Chimie",
      "EPS",
      "Arts plastiques",
      "Musique",
      "Technologie",
    ],
  },
  {
    id: 2,
    name: "5ème B",
    level: "Collège",
    students: 26,
    mainTeacher: "Julie Bernard",
    subjects: [
      "Français",
      "Mathématiques",
      "Histoire-Géo",
      "Anglais",
      "SVT",
      "Physique-Chimie",
      "EPS",
      "Arts plastiques",
      "Musique",
      "Technologie",
    ],
  },
  {
    id: 3,
    name: "4ème C",
    level: "Collège",
    students: 27,
    mainTeacher: "Nicolas Petit",
    subjects: [
      "Français",
      "Mathématiques",
      "Histoire-Géo",
      "Anglais",
      "SVT",
      "Physique-Chimie",
      "EPS",
      "Arts plastiques",
      "Musique",
      "Technologie",
    ],
  },
  {
    id: 4,
    name: "3ème A",
    level: "Collège",
    students: 25,
    mainTeacher: "Émilie Leroy",
    subjects: [
      "Français",
      "Mathématiques",
      "Histoire-Géo",
      "Anglais",
      "SVT",
      "Physique-Chimie",
      "EPS",
      "Arts plastiques",
      "Musique",
      "Technologie",
    ],
  },
  {
    id: 5,
    name: "2nde 3",
    level: "Lycée",
    students: 32,
    mainTeacher: "Sophie Dupont",
    subjects: ["Français", "Mathématiques", "Histoire-Géo", "Anglais", "SVT", "Physique-Chimie", "EPS", "SES", "SNT"],
  },
  {
    id: 6,
    name: "1ère S2",
    level: "Lycée",
    students: 30,
    mainTeacher: "Pierre Moreau",
    subjects: [
      "Français",
      "Mathématiques",
      "Histoire-Géo",
      "Anglais",
      "SVT",
      "Physique-Chimie",
      "EPS",
      "Spécialité 1",
      "Spécialité 2",
      "Spécialité 3",
    ],
  },
  {
    id: 7,
    name: "Term ES1",
    level: "Lycée",
    students: 28,
    mainTeacher: "Marie Lefebvre",
    subjects: ["Philosophie", "Histoire-Géo", "Anglais", "EPS", "Spécialité 1", "Spécialité 2"],
  },
]

export function ClassesList() {
  const [page, setPage] = useState(1)
  const pageSize = 5

  const paginatedClasses = classes.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(classes.length / pageSize)

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Classe</TableHead>
              <TableHead className="hidden md:table-cell">Niveau</TableHead>
              <TableHead>Effectif</TableHead>
              <TableHead className="hidden md:table-cell">Professeur principal</TableHead>
              <TableHead className="hidden lg:table-cell">Matières</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedClasses.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell className="font-medium">{cls.name}</TableCell>
                <TableCell className="hidden md:table-cell">{cls.level}</TableCell>
                <TableCell>{cls.students} élèves</TableCell>
                <TableCell className="hidden md:table-cell">{cls.mainTeacher}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {cls.subjects.slice(0, 3).map((subject) => (
                      <Badge key={subject} variant="outline" className="bg-primary/10 text-primary">
                        {subject}
                      </Badge>
                    ))}
                    {cls.subjects.length > 3 && (
                      <Badge variant="outline" className="bg-muted text-muted-foreground">
                        +{cls.subjects.length - 3}
                      </Badge>
                    )}
                  </div>
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
                        <Users className="mr-2 h-4 w-4" />
                        Liste des élèves
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Emploi du temps
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        Bulletins
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Contacter les parents
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
