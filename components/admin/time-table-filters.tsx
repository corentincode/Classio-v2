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

export function TimeTableFilters() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filtres
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Options d'affichage</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>Afficher les pauses</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked>Afficher les salles</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked>Afficher les enseignants</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Plage horaire</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked>Journée complète</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Matin uniquement</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Après-midi uniquement</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
