"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MobileOverview() {
  const [activeTab, setActiveTab] = useState("enfants")

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <Tabs defaultValue="enfants" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-5 h-auto p-0">
            <TabsTrigger
              value="enfants"
              className="text-xs py-2 px-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Enfants
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="text-xs py-2 px-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Événements
            </TabsTrigger>
            <TabsTrigger
              value="grades"
              className="text-xs py-2 px-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Notes
            </TabsTrigger>
            <TabsTrigger
              value="attendance"
              className="text-xs py-2 px-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Assiduité
            </TabsTrigger>
            <TabsTrigger
              value="news"
              className="text-xs py-2 px-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Annonces
            </TabsTrigger>
          </TabsList>
          <TabsContent value="enfants" className="p-4">
            <h3 className="font-medium mb-2">Mes enfants</h3>
            <p className="text-sm text-muted-foreground">Informations sur vos enfants à venir</p>
            <div className="mt-4 text-center">
              <Link href="/parent/enfants" className="text-sm text-primary hover:underline">
                Voir tous les détails
              </Link>
            </div>
          </TabsContent>
          <TabsContent value="events" className="p-4">
            <h3 className="font-medium mb-2">Événements à venir</h3>
            <p className="text-sm text-muted-foreground">Calendrier des événements à venir</p>
          </TabsContent>
          <TabsContent value="grades" className="p-4">
            <h3 className="font-medium mb-2">Notes récentes</h3>
            <p className="text-sm text-muted-foreground">Dernières notes de vos enfants</p>
            <div className="mt-4 text-center">
              <Link href="/parent/notes" className="text-sm text-primary hover:underline">
                Voir toutes les notes
              </Link>
            </div>
          </TabsContent>
          <TabsContent value="attendance" className="p-4">
            <h3 className="font-medium mb-2">Assiduité</h3>
            <p className="text-sm text-muted-foreground">Suivi des présences et absences</p>
            <div className="mt-4 text-center">
              <Link href="/parent/assiduite" className="text-sm text-primary hover:underline">
                Voir tous les détails
              </Link>
            </div>
          </TabsContent>
          <TabsContent value="news" className="p-4">
            <h3 className="font-medium mb-2">Annonces de l'école</h3>
            <p className="text-sm text-muted-foreground">Communications importantes de l'établissement</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
