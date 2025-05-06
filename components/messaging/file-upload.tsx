"use client"

import { useState, useRef } from "react"
import { Paperclip, X, File, ImageIcon, FileText, Film, Music, Archive, Upload, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface FileUploadProps {
    onFileSelect: (file: File) => void
    onCancel: () => void
    isUploading: boolean
    progress?: number
}

export default function FileUpload({ onFileSelect, onCancel, isUploading, progress = 0 }: FileUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setSelectedFile(file)
            onFileSelect(file)
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            setSelectedFile(file)
            onFileSelect(file)
        }
    }

    const getFileIcon = (file: File) => {
        const type = file.type.split("/")[0]
        switch (type) {
            case "image":
                return <ImageIcon className="h-5 w-5" />
            case "video":
                return <Film className="h-5 w-5" />
            case "audio":
                return <Music className="h-5 w-5" />
            case "application":
                if (file.type.includes("pdf")) {
                    return <FileText className="h-5 w-5" />
                } else if (file.type.includes("zip") || file.type.includes("rar") || file.type.includes("tar")) {
                    return <Archive className="h-5 w-5" />
                }
                return <File className="h-5 w-5" />
            default:
                return <File className="h-5 w-5" />
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return (
        <div className="w-full">
            {!selectedFile ? (
        <div
            className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50"
    )}
    onClick={() => fileInputRef.current?.click()}
    onDragEnter={handleDrag}
    onDragLeave={handleDrag}
    onDragOver={handleDrag}
    onDrop={handleDrop}
    >
    <input
        ref={fileInputRef}
    type="file"
    className="hidden"
    onChange={handleFileChange}
    accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip,application/x-rar-compressed,video/*,audio/*"
    />
    <div className="flex flex-col items-center gap-2 py-4">
    <Upload className="h-8 w-8 text-muted-foreground" />
    <p className="text-sm font-medium">
        Cliquez pour sélectionner un fichier ou glissez-déposez ici
    </p>
    <p className="text-xs text-muted-foreground">
        PNG, JPG, PDF, DOCX, XLSX, ZIP, RAR, MP4, MP3 (max. 10MB)
    </p>
    </div>
    </div>
) : (
        <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
            {getFileIcon(selectedFile)}
            <div className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</div>
        </div>
    {!isUploading && (
        <Button variant="ghost" size="icon" onClick={onCancel} className="h-8 w-8">
    <X className="h-4 w-4" />
        </Button>
    )}
    </div>
    <div className="text-xs text-muted-foreground mb-2">{formatFileSize(selectedFile.size)}</div>
    {isUploading && (
        <div className="space-y-2">
        <Progress value={progress} className="h-2" />
    <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Envoi en cours...</span>
    <span>{progress}%</span>
    </div>
    </div>
    )}
    </div>
)}
    </div>
)
}
