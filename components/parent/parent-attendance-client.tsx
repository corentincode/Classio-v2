"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StudentAttendance } from "@/components/eleve/student-attendance"
import { User } from "lucide-react"

interface ParentChildWithClass {
  id: string
  child: {
    id: string
    name: string
    email: string
    studentClasses: {
      class: {
        id: string
        name: string
      }
    }[]
  }
}

interface ParentAttendanceClientProps {
  children: ParentChildWithClass[]
}

export function ParentAttendanceClient({ children }: ParentAttendanceClientProps) {
  const [selectedChildId, setSelectedChildId] = useState<string>(children[0]?.child.id || "")

  if (children.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucun enfant associé</h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas encore d'enfants associés à votre compte. Veuillez contacter l'administration de
            l'établissement.
          </p>
        </div>
      </div>
    )
  }

  const selectedChild = children.find((child) => child.child.id === selectedChildId)?.child

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Absences et retards</h1>
      </div>

      <Tabs defaultValue={selectedChildId} onValueChange={setSelectedChildId} className="w-full">
        <TabsList className="mb-4 flex overflow-x-auto pb-1">
          {children.map((child) => (
            <TabsTrigger key={child.child.id} value={child.child.id} className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{child.child.name || child.child.email}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {children.map((child) => (
          <TabsContent key={child.child.id} value={child.child.id}>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  {child.child.name || child.child.email}
                  {child.child.studentClasses.length > 0 && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({child.child.studentClasses[0].class.name})
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>{selectedChild && <StudentAttendance studentId={selectedChild.id} />}</CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
