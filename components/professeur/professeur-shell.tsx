"use client"

import type React from "react"

import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { BookOpen, Users, Calendar, Bell, Menu, X, LogOut, User, BookText, ClipboardCheck, ClipboardList } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { signOut } from "next-auth/react"

interface ProfesseurShellProps {
  children: React.ReactNode
  establishment: {
    id: string
    name: string
  } | null
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function ProfesseurShell({ children, establishment, user }: ProfesseurShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Gérer le cas où establishment est null
  const establishmentId = establishment?.id || ""

  const navigation = [
    { name: "Tableau de bord", href: `/professeur?establishmentId=${establishmentId}`, icon: BookOpen },
    { name: "Mes cours", href: `/professeur/courses?establishmentId=${establishmentId}`, icon: BookText },
    { name: "Mes classes", href: `/professeur/classes?establishmentId=${establishmentId}`, icon: Users },
    { name: "Emploi du temps", href: `/professeur/schedule?establishmentId=${establishmentId}`, icon: Calendar },
    {
      name: "Absences & retards",
      href: `/professeur/attendance?establishmentId=${establishmentId}`,
      icon: ClipboardCheck,
    },
    { name: "Notifications", href: `/professeur/notifications?establishmentId=${establishmentId}`, icon: Bell },
    { name: "Évaluations", href: `/professeur/evaluations?establishmentId=${establishmentId}`, icon: ClipboardList },
  ]

  const userNavigation = [
    { name: "Votre profil", href: "/profile" },
    { name: "Paramètres", href: "/profile/settings" },
  ]

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Fermer le menu</span>
                        <X className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                      <Link href="/" className="flex items-center space-x-2">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold">Classio</span>
                      </Link>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={`
                                    group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6
                                    ${
                                      pathname === item.href
                                        ? "bg-gray-50 text-blue-600"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                                    }
                                  `}
                                >
                                  <item.icon
                                    className={`h-6 w-6 shrink-0 ${
                                      pathname === item.href
                                        ? "text-blue-600"
                                        : "text-gray-400 group-hover:text-blue-600"
                                    }`}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li className="mt-auto">
                          <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                          >
                            <LogOut
                              className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-600"
                              aria-hidden="true"
                            />
                            Déconnexion
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <Link href="/" className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold">Classio</span>
              </Link>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`
                            group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6
                            ${
                              pathname === item.href
                                ? "bg-gray-50 text-blue-600"
                                : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                            }
                          `}
                        >
                          <item.icon
                            className={`h-6 w-6 shrink-0 ${
                              pathname === item.href ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600"
                            }`}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  >
                    <LogOut className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-600" aria-hidden="true" />
                    Déconnexion
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <span className="sr-only">Ouvrir le menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
                {/* Profile dropdown */}
                <div className="relative">
                  <div className="flex items-center gap-x-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-500 text-white">
                      {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                    </div>
                    <span className="hidden lg:flex lg:items-center">
                      <span className="text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                        {user?.name || user?.email || "Utilisateur"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  )
}
