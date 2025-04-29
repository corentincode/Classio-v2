"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { StudentGradesClient } from "@/components/eleve/student-grades-client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Period {
  id: string
  name: string
  period: string
  startDate: string
  endDate: string
  schoolYear: string
  isActive: boolean
}

interface Course {
  id: string
  name: string
  coefficient: number
}

interface Child {
  id: string
  name: string | null
  email: string
  className?: string
  courses: Course[]
}

export function ParentGradesClient({
  children,
  periods,
}: {
  children: Child[]
  periods: Period[]
}) {
  const [selectedChild, setSelectedChild] = useState<string>(children.length > 0 ? children[0].id : "")

  if (children.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-gray-500">Aucun enfant n'est associé à votre compte</p>
          <Button asChild>
            <Link href="/parent/children">Associer un enfant</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const selectedChildData = children.find((child) => child.id === selectedChild)

  return (
    <div className="space-y-6">
      <Tabs defaultValue={selectedChild} onValueChange={setSelectedChild}>
        <TabsList className="mb-4">
          {children.map((child) => (
            <TabsTrigger key={child.id} value={child.id}>
              {child.name || child.email}
              {child.className && ` (${child.className})`}
            </TabsTrigger>
          ))}
        </TabsList>

        {children.map((child) => (
          <TabsContent key={child.id} value={child.id}>
            {child.courses.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Aucun cours disponible</AlertTitle>
                <AlertDescription>
                  {child.className === "Aucune classe"
                    ? "Cet élève n'est pas encore inscrit dans une classe."
                    : "Aucun cours n'est disponible pour la classe de cet élève."}
                </AlertDescription>
              </Alert>
            ) : (
              selectedChildData && (
                <StudentGradesClient studentId={child.id} periods={periods} courses={child.courses} />
              )
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
