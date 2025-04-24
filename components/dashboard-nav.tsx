"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Users, School, FileText, Shield, Settings, HelpCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function DashboardNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      icon: BarChart3,
      title: "Tableau de bord",
    },
    {
      href: "/dashboard/utilisateurs",
      icon: Users,
      title: "Utilisateurs",
    },
    {
      href: "/dashboard/etablissements",
      icon: School,
      title: "Établissements",
    },
    {
      href: "/dashboard/audit",
      icon: FileText,
      title: "Journal d'audit",
    },
    {
      href: "/dashboard/rgpd",
      icon: Shield,
      title: "Conformité RGPD",
    },
    {
      href: "/dashboard/parametres",
      icon: Settings,
      title: "Paramètres",
    },
  ]

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              C
            </div>
            <span>Classio</span>
          </Link>
          <SidebarTrigger className="ml-auto md:hidden" />
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-[calc(100vh-8.5rem)]">
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton asChild isActive={pathname === route.href} tooltip={route.title}>
                    <Link href={route.href}>
                      <route.icon className="h-5 w-5" />
                      <span>{route.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <div className="grid gap-2">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/aide">
                <HelpCircle className="mr-2 h-4 w-4" />
                Centre d'aide
              </Link>
            </Button>
            <Button variant="outline" className="justify-start text-destructive hover:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
