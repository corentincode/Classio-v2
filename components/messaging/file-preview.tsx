"use client"

import { useState } from "react"
import { File, FileText, ImageIcon, Film, Music, Archive, Download, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"

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
    const [previewOpen, setPreviewOpen] = useState(false)

    const getFileIcon = () => {
        const type = file.type.split("/")[0]
        switch (type) {
            case "image":
                return <ImageIcon className="h-4 w-4" />
            case "video":
                return <Film className="h-4 w-4" />
            case "audio":
                return <Music className="h-4 w-4" />
            case "application":
                if (file.type.includes("pdf")) {
                    return <FileText className="h-4 w-4" />
                } else if (file.type.includes("zip") || file.type.includes("rar") || file.type.includes("tar")) {
                    return <Archive className="h-4 w-4" />
                }
                return <File className="h-4 w-4" />
            default:
                return <File className="h-4 w-4" />
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    const isPreviewable = () => {
        return file.type.startsWith("image/") || file.type === "application/pdf"
    }

    return (
        <>
            <div className="border rounded-lg p-2 bg-background/50 max-w-xs">
                <div className="flex items-center gap-2 mb-1">
                    {getFileIcon()}
                    <div className="text-sm font-medium truncate flex-1">{file.name}</div>
                </div>
                <div className="text-xs text-muted-foreground mb-2">{formatFileSize(file.size)}</div>

                {file.type.startsWith("image/") && (
                    <div className="relative h-32 w-full mb-2 rounded overflow-hidden">
                        <Image
                            src={file.url || "/placeholder.svg"}
                            alt={file.name}
                            fill
                            className="object-cover"
                            onClick={() => setPreviewOpen(true)}
                        />
                    </div>
                )}

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer">
                            <Download className="h-3.5 w-3.5 mr-1" />
                            Télécharger
                        </a>
                    </Button>

                    {isPreviewable() && (
                        <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Aperçu
                        </Button>
                    )}
                </div>
            </div>

            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-4xl">
                    {file.type.startsWith("image/") ? (
                        <div className="relative h-[70vh] w-full">
                            <Image
                                src={file.url || "/placeholder.svg"}
                                alt={file.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                    ) : file.type === "application/pdf" ? (
                        <iframe
                            src={`${file.url}#toolbar=0`}
                            className="w-full h-[70vh]"
                            title={file.name}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8">
                            <File className="h-16 w-16 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium mb-2">{file.name}</p>
                            <p className="text-sm text-muted-foreground mb-4">{formatFileSize(file.size)}</p>
                            <Button asChild>
                                <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer">
                                    <Download className="h-4 w-4 mr-2" />
                                    Télécharger le fichier
                                </a>
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
