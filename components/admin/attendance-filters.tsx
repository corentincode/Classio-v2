"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"

export function AttendanceFilters() {
  const [date, setDate] = useState<Date>()

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Rechercher un élève..." className="pl-8" />
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Classe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les classes</SelectItem>
            <SelectItem value="6a">6ème A</SelectItem>
            <SelectItem value="6b">6ème B</SelectItem>
            <SelectItem value="5a">5ème A</SelectItem>
            <SelectItem value="5b">5ème B</SelectItem>
            <SelectItem value="4a">4ème A</SelectItem>
            <SelectItem value="4b">4ème B</SelectItem>
            <SelectItem value="3a">3ème A</SelectItem>
            <SelectItem value="3b">3ème B</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="present">Présent</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="late">En retard</SelectItem>
            <SelectItem value="excused">Absence justifiée</SelectItem>
            <SelectItem value="unexcused">Absence non justifiée</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[180px] justify-start text-left font-normal",
                !date && "text-muted-foreground",
              )}
            >
              {date ? format(date, "dd MMMM yyyy", { locale: fr }) : "Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={fr} />
          </PopoverContent>
        </Popover>
      </div>
      <Button className="shrink-0">Filtrer</Button>
    </div>
  )
}
