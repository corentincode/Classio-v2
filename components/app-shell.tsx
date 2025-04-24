"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  BarChart3,
  Bell,
  FileText,
  HelpCircle,
  LogOut,
  Menu,
  School,
  Search,
  Settings,
  Shield,
  Users,
  X,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Utilisateurs", href: "/dashboard/utilisateurs", icon: Users },
  { name: "Établissements", href: "/dashboard/etablissements", icon: School },
  { name: "Journal d'audit", href: "/dashboard/audit", icon: FileText },
  { name: "Conformité RGPD", href: "/dashboard/rgpd", icon: Shield },
  { name: "Paramètres", href: "/dashboard/parametres", icon: Settings },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [notificationCount] = useState(3)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  // Détection de la taille d'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640)
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar pour desktop */}
      {!isMobile && !isTablet && (
        <div className="fixed inset-y-0 left-0 z-50 w-16 flex flex-col border-r bg-background">
          <div className="flex h-16 shrink-0 items-center justify-center border-b">
            <Link href="/dashboard" className="flex items-center justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold">
                C
              </div>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col py-4">
            <ul className="flex flex-col items-center space-y-3">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                      pathname === item.href && "bg-muted text-foreground",
                    )}
                    title={item.name}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col items-center py-4 space-y-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/aide" title="Centre d'aide">
                <HelpCircle className="h-5 w-5" />
                <span className="sr-only">Centre d'aide</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" title="Déconnexion">
              <LogOut className="h-5 w-5 text-destructive" />
              <span className="sr-only">Déconnexion</span>
            </Button>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className={cn("flex flex-1 flex-col", !isMobile && !isTablet && "pl-16")}>
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
          {/* Menu hamburger pour mobile et tablette */}
          <div className="flex items-center">
            {isTablet && (
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[250px] sm:w-[300px] p-0">
                  <div className="flex h-16 items-center border-b px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold">
                        C
                      </div>
                      <span className="font-semibold">Classio</span>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsMobileMenuOpen(false)}>
                      <X className="h-5 w-5" />
                      <span className="sr-only">Fermer</span>
                    </Button>
                  </div>
                  <nav className="flex flex-col py-4">
                    <ul className="space-y-1 px-2">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                              pathname === item.href && "bg-muted text-foreground",
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto px-2 py-4 space-y-1">
                      <Link
                        href="/aide"
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <HelpCircle className="h-5 w-5" />
                        Centre d'aide
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-3 py-2 h-auto text-sm font-medium text-destructive"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Déconnexion
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>

          <h1 className="text-xl font-semibold">Classio</h1>
          <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4">
            <form className="hidden md:flex relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Rechercher..." className="w-full pl-9 bg-background shadow-none" />
            </form>

            {/* Bouton de recherche sur mobile */}
            {isMobile && (
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
                <span className="sr-only">Rechercher</span>
              </Button>
            )}

            {!isMobile && <ThemeToggle />}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {notificationCount}
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[280px] sm:w-[350px]">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[60vh] overflow-auto">
                  {[1, 2, 3].map((i) => (
                    <DropdownMenuItem key={i} className="cursor-pointer p-4">
                      <div className="grid gap-1">
                        <div className="font-medium">Nouvelle demande d'accès aux données</div>
                        <div className="text-sm text-muted-foreground">
                          Un utilisateur a demandé l'accès à ses données personnelles
                        </div>
                        <div className="text-xs text-muted-foreground">Il y a 2 heures</div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer justify-center text-center font-medium">
                  Voir toutes les notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Avatar" />
                    <AvatarFallback>SA</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Menu utilisateur</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profil</DropdownMenuItem>
                <DropdownMenuItem>Paramètres</DropdownMenuItem>
                {isMobile && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setIsMobileMenuOpen(true)}>Menu principal</DropdownMenuItem>
                    <DropdownMenuItem>
                      <ThemeToggle variant="menu-item" />
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Déconnexion</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Contenu de la page */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {/* Navigation tablette (en haut) */}
          {isTablet && (
            <div className="mb-6 overflow-hidden border-b">
              <nav className="flex overflow-x-auto pb-2 hide-scrollbar">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground whitespace-nowrap",
                      pathname === item.href && "bg-muted text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          )}

          {/* Navigation mobile (en bas) */}
          {isMobile && (
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
              <nav className="flex justify-around">
                {navigation.slice(0, 5).map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center py-2 px-1 text-[10px] text-muted-foreground",
                      pathname === item.href && "text-primary",
                    )}
                  >
                    <item.icon className="h-5 w-5 mb-1" />
                    <span className="truncate max-w-[60px] text-center">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          )}

          {/* Contenu principal avec padding pour la navigation mobile */}
          <div className={cn("w-full max-w-full overflow-x-hidden", isMobile && "pb-20")}>{children}</div>
        </main>
      </div>
    </div>
  )
}
