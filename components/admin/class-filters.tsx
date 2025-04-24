"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter, Search } from "lucide-react"

export function ClassFilters() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Rechercher une classe..." className="w-full pl-9 sm:w-[250px] md:w-[300px]" />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filtrer</span>
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
          <DropdownMenuLabel className="font-normal">Classe</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked>Toutes</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>6ème</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>5ème</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>4ème</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>3ème</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>2nde</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>1ère</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Terminale</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
