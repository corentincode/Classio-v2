import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"
import path from "path"

// Configuration du chemin de stockage sur le VPS
const VPS_STORAGE_URL = process.env.VPS_STORAGE_URL || "https://votre-vps.com/files"
const VPS_API_URL = process.env.VPS_API_URL || "https://votre-vps.com/api/upload"
const VPS_API_KEY = process.env.VPS_API_KEY || "votre-clé-secrète"

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return new NextResponse("Non autorisé", { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return new NextResponse("Aucun fichier fourni", { status: 400 })
        }

        // Vérifier la taille du fichier (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return new NextResponse("Le fichier est trop volumineux (max 10MB)", { status: 400 })
        }

        // Générer un nom de fichier unique pour éviter les collisions
        const fileExtension = path.extname(file.name)
        const uniqueFileName = `${uuidv4()}${fileExtension}`

        // Convertir le fichier en buffer
        const buffer = Buffer.from(await file.arrayBuffer())

        // Créer un nouveau FormData pour l'envoi au VPS
        const vpsFormData = new FormData()
        vpsFormData.append("file", new Blob([buffer]), uniqueFileName)
        vpsFormData.append("originalName", file.name)

        // Envoyer le fichier au VPS
        const uploadResponse = await fetch(VPS_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${VPS_API_KEY}`,
            },
            body: vpsFormData,
        })

        if (!uploadResponse.ok) {
            throw new Error("Échec du téléchargement du fichier sur le VPS")
        }

        // Construire l'URL du fichier
        const fileUrl = `${VPS_STORAGE_URL}/${uniqueFileName}`

        // Stocker les métadonnées du fichier dans la base de données avec Prisma
        const vpsFile = await prisma.vpsFile.create({
            data: {
                filePath: uniqueFileName,
                fileUrl: fileUrl,
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                uploadedById: session.user.id,
            },
        })

        // Retourner les informations du fichier
        return NextResponse.json({
            id: vpsFile.id,
            name: vpsFile.fileName,
            type: vpsFile.fileType,
            size: vpsFile.fileSize,
            url: vpsFile.fileUrl,
            uploadedById: vpsFile.uploadedById,
        })
    } catch (error) {
        console.error("Erreur lors du téléchargement du fichier:", error)
        return new NextResponse("Erreur lors du téléchargement du fichier", { status: 500 })
    }
}
