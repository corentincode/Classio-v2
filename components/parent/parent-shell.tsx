"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { School, Home, Calendar, Users, MessageSquare, LogOut, Menu, X } from "lucide-react"
import { useSession } from "next-auth/react"

interface ParentShellProps {
  children: React.ReactNode
}

export function ParentShell({ children }: ParentShellProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [establishment, setEstablishment] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Charger les détails de l'établissement
  useEffect(() => {
    const fetchEstablishmentDetails = async () => {
      if (session?.user?.establishmentId) {
        try {
          setLoading(true)
          const response = await fetch(`/api/establishments/${session.user.establishmentId}`)

          if (response.ok) {
            const data = await response.json()
            setEstablishment(data)
          }
        } catch (error) {
          console.error("Error fetching establishment details:", error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    if (session) {
      fetchEstablishmentDetails()
    }
  }, [session])

  const navigation = [
    { name: "Tableau de bord", href: "/parent", icon: Home },
    { name: "Enfants", href: "/parent/children", icon: Users },
    { name: "Événements", href: "/parent/events", icon: Calendar },
    { name: "Messages", href: "/parent/messages", icon: MessageSquare },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar pour mobile */}
      <div
        className={`fixed inset-0 z-40 flex md:hidden ${
          sidebarOpen ? "visible" : "invisible"
        } transition-opacity duration-300`}
        onClick={toggleSidebar}
      >
        <div
          className={`fixed inset-0 bg-gray-600 ${
            sidebarOpen ? "opacity-75" : "opacity-0"
          } transition-opacity duration-300`}
        ></div>
        <div
          className={`relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={toggleSidebar}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex flex-shrink-0 items-center px-4">
            <div className="flex items-center">
              <School className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Classio</span>
            </div>
          </div>
          <div className="mt-5 h-0 flex-1 overflow-y-auto">
            <nav className="space-y-1 px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    pathname === item.href
                      ? "bg-indigo-100 text-indigo-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`mr-4 h-6 w-6 flex-shrink-0 ${
                      pathname === item.href ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div>
                <div className="text-base font-medium text-gray-800">{session?.user?.email}</div>
                <div className="text-sm font-medium text-gray-500">Parent</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar pour desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <School className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">Classio</span>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 space-y-1 px-2 pb-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    pathname === item.href
                      ? "bg-indigo-100 text-indigo-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      pathname === item.href ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div>
                <div className="text-sm font-medium text-gray-800">{session?.user?.email}</div>
                <div className="text-xs font-medium text-gray-500">Parent</div>
                <Link href="/auth/signout">
                  <Button variant="ghost" size="sm" className="mt-2 w-full justify-start text-red-600 px-2">
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1 items-center">
              {establishment && (
                <div className="flex items-center">
                  <School className="h-5 w-5 text-indigo-500 mr-2" />
                  <span className="font-medium text-gray-900">{establishment.name}</span>
                  <span className="ml-2 text-sm text-gray-500">({establishment.code})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
