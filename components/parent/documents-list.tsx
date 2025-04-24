"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Download, FileText, FileIcon as FilePdf, FileImage, FileSpreadsheet } from "lucide-react"

// Données fictives pour les documents
const documents = [
  {
    id: 1,
    title: "Bulletin scolaire - 2ème trimestre",
    type: "pdf",
    date: "15 avril 2025",
    size: "1.2 MB",
    category: "Bulletins",
    child: "Emma Dupont",
  },
  {
    id: 2,
    title: "Autorisation de sortie - Musée",
    type: "pdf",
    date: "10 avril 2025",
    size: "0.5 MB",
    category: "Administratif",
    child: "Lucas Dupont",
  },
  {
    id: 3,
    title: "Emploi du temps - 3ème trimestre",
    type: "pdf",
    date: "5 avril 2025",
    size: "0.8 MB",
    category: "Scolarité",
    child: "Emma Dupont",
  },
  {
    id: 4,
    title: "Facture cantine - Avril 2025",
    type: "pdf",
    date: "1 avril 2025",
    size: "0.3 MB",
    category: "Facturation",
    child: "Tous",
  },
  {
    id: 5,
    title: "Bulletin scolaire - 2ème trimestre",
    type: "pdf",
    date: "15 avril 2025",
    size: "1.1 MB",
    category: "Bulletins",
    child: "Lucas Dupont",
  },
  {
    id: 6,
    title: "Calendrier des vacances scolaires",
    type: "pdf",
    date: "20 mars 2025",
    size: "0.4 MB",
    category: "Scolarité",
    child: "Tous",
  },
  {
    id: 7,
    title: "Photos de classe",
    type: "image",
    date: "15 mars 2025",
    size: "5.2 MB",
    category: "Photos",
    child: "Emma Dupont",
  },
  {
    id: 8,
    title: "Photos de classe",
    type: "image",
    date: "15 mars 2025",
    size: "4.8 MB",
    category: "Photos",
    child: "Lucas Dupont",
  },
  {
    id: 9,
    title: "Règlement intérieur",
    type: "pdf",
    date: "10 mars 2025",
    size: "0.7 MB",
    category: "Administratif",
    child: "Tous",
  },
  {
    id: 10,
    title: "Facture cantine - Mars 2025",
    type: "pdf",
    date: "1 mars 2025",
    size: "0.3 MB",
    category: "Facturation",
    child: "Tous",
  },
]

// Catégories de documents
const categories = ["Tous", "Bulletins", "Administratif", "Scolarité", "Facturation", "Photos"]

export function DocumentsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [selectedChild, setSelectedChild] = useState("Tous")

  // Filtrer les documents en fonction des critères
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Tous" || doc.category === selectedCategory
    const matchesChild = selectedChild === "Tous" || doc.child === selectedChild || doc.child === "Tous"

    return matchesSearch && matchesCategory && matchesChild
  })

  // Obtenir la liste des enfants uniques
  const children = ["Tous", ...new Set(documents.map((doc) => doc.child).filter((child) => child !== "Tous"))]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>Documents administratifs et scolaires</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un document..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <select
                className="px-3 py-2 rounded-md border text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                className="px-3 py-2 rounded-md border text-sm"
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
              >
                {children.map((child) => (
                  <option key={child} value={child}>
                    {child}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border rounded-md">
            <div className="grid grid-cols-12 gap-2 p-3 border-b bg-muted font-medium text-sm">
              <div className="col-span-6">Document</div>
              <div className="col-span-2 hidden md:block">Date</div>
              <div className="col-span-2 hidden md:block">Catégorie</div>
              <div className="col-span-1 hidden md:block">Taille</div>
              <div className="col-span-1"></div>
            </div>

            <div className="divide-y">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <div key={doc.id} className="grid grid-cols-12 gap-2 p-3 items-center">
                    <div className="col-span-6 flex items-center gap-2">
                      {doc.type === "pdf" ? (
                        <FilePdf className="h-5 w-5 text-red-500" />
                      ) : doc.type === "image" ? (
                        <FileImage className="h-5 w-5 text-blue-500" />
                      ) : doc.type === "spreadsheet" ? (
                        <FileSpreadsheet className="h-5 w-5 text-green-500" />
                      ) : (
                        <FileText className="h-5 w-5 text-gray-500" />
                      )}
                      <div>
                        <div className="font-medium text-sm">{doc.title}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{doc.date}</div>
                        <div className="text-xs text-muted-foreground md:hidden">
                          {doc.child !== "Tous" && `Pour: ${doc.child}`}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 hidden md:block text-sm">{doc.date}</div>
                    <div className="col-span-2 hidden md:block">
                      <Badge variant="outline" className="text-xs">
                        {doc.category}
                      </Badge>
                    </div>
                    <div className="col-span-1 hidden md:block text-sm">{doc.size}</div>
                    <div className="col-span-6 md:col-span-1 flex justify-end">
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Télécharger</span>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium">Aucun document trouvé</h3>
                  <p className="text-sm text-muted-foreground mt-1">Essayez de modifier vos critères de recherche.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
