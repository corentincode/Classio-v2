"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserFilters() {
  const [activeTab, setActiveTab] = useState("tous")

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un utilisateur..."
            className="w-full pl-10 sm:w-[300px] bg-[#f3f3f3] border-none h-10 rounded-lg"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 border-none bg-[#f3f3f3] hover:bg-[#e5e5e5] text-black">
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filtrer par</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Statut</DropdownMenuItem>
                <DropdownMenuItem>Établissement</DropdownMenuItem>
                <DropdownMenuItem>Date d'inscription</DropdownMenuItem>
                <DropdownMenuItem>Dernière connexion</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="h-10 bg-black hover:bg-black/90 text-white">Ajouter</Button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex -mb-px overflow-x-auto hide-scrollbar">
          {["tous", "administrateurs", "enseignants", "eleves", "parents"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize whitespace-nowrap ${
                activeTab === tab ? "border-b-2 border-black text-black" : "text-gray-500 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
