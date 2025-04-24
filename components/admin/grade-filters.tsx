"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter } from "lucide-react"

export function GradeFilters() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filtres
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Filtrer par</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-normal">Niveau</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked>Tous</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Collège</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Lycée</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-normal">Statut</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked>Tous</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Terminé</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>En attente</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Non commencé</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
