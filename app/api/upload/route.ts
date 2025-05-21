import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { uploadFile } from "@/lib/files-service"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import { mkdir } from "fs/promises"
import { tmpdir } from "os"
import type { Express } from "express"
import { basename } from "path"

// Taille maximale de fichier (10 MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024

// Types de fichiers autorisés
const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/zip",
    "application/x-rar-compressed",
    "video/mp4",
    "audio/mpeg",
]

export async function POST(request: NextRequest) {
    try {
        // Vérifier l'authentification
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        // Créer un répertoire temporaire pour stocker les fichiers
        const tempDir = join(tmpdir(), "upload-temp")
        await mkdir(tempDir, { recursive: true })

        // Récupérer les données du formulaire
        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 })
        }

        // Vérifier la taille du fichier
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "Le fichier est trop volumineux (max 10 MB)" }, { status: 400 })
        }

        // Vérifier le type de fichier
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return NextResponse.json({ error: "Type de fichier non autorisé" }, { status: 400 })
        }

        // Créer un nom de fichier unique
        const tempFilePath = join(tempDir, `${uuidv4()}-${file.name}`)

        // Convertir le fichier en buffer et l'écrire sur le disque
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(tempFilePath, buffer)

        // Préparer l'objet pour le service de téléchargement
        const fileObject: Express.Multer.File = {
            fieldname: "file",
            originalname: file.name,
            encoding: "7bit",
            mimetype: file.type,
            size: file.size,
            destination: tempDir,
            filename: basename(tempFilePath),
            path: tempFilePath,
            buffer: buffer,
        }

        // Télécharger le fichier sur le VPS
        const fileRecord = await uploadFile(fileObject)

        return NextResponse.json(fileRecord, { status: 201 })
    } catch (error) {
        console.error("Erreur lors du téléchargement du fichier:", error)
        return NextResponse.json({ error: "Erreur lors du téléchargement du fichier" }, { status: 500 })
    }
}
