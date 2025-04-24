"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ThemeToggleProps {
  variant?: "default" | "menu-item"
}

export function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
  const { setTheme } = useTheme()

  if (variant === "menu-item") {
    return (
      <div className="flex items-center justify-between w-full">
        <span>Thème</span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setTheme("light")}>
            <Sun className="h-[1rem] w-[1rem]" />
            <span className="sr-only">Thème clair</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setTheme("dark")}>
            <Moon className="h-[1rem] w-[1rem]" />
            <span className="sr-only">Thème sombre</span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Changer de thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Clair</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Sombre</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>Système</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
