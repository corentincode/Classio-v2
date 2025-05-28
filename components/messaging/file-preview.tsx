"use client"

import { Download, File, ImageIcon, FileText, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilePreviewProps {
  file: {
    id: string
    name: string
    type: string
    size: number
    url: string
  }
}

export default function FilePreview({ file }: FilePreviewProps) {
  const getFileIcon = () => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />
    } else if (file.type === "application/pdf") {
      return <FileText className="h-4 w-4 text-red-500" />
    } else {
      return <File className="h-4 w-4 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // SOLUTION 1: Téléchargement via fetch avec blob
  const handleDownload = async () => {
    try {
      const response = await fetch(file.url)
      const blob = await response.blob()

      // Créer un URL temporaire pour le blob
      const blobUrl = window.URL.createObjectURL(blob)

      // Créer un lien temporaire et le cliquer
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = file.name // Force le téléchargement avec le nom original
      document.body.appendChild(link)
      link.click()

      // Nettoyer
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error)
      // Fallback vers la méthode simple
      handleDownloadFallback()
    }
  }

  // SOLUTION 2: Fallback - Téléchargement simple avec attribut download
  const handleDownloadFallback = () => {
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleView = () => {
    window.open(file.url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="border rounded-lg p-3 bg-muted/30 max-w-sm">
      {file.type.startsWith("image/") ? (
        <div className="space-y-2">
          <img
            src={file.url || "/placeholder.svg"}
            alt={file.name}
            className="w-full h-32 object-cover rounded cursor-pointer"
            onClick={handleView}
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              {getFileIcon()}
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleView} title="Voir">
                <ExternalLink className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDownload} title="Télécharger">
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {getFileIcon()}
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleView} title="Voir">
              <ExternalLink className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDownload} title="Télécharger">
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
