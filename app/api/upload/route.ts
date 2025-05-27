import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 })
    }

    // Vérifier la taille du fichier (limite à 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "Le fichier est trop volumineux (max 10MB)" }, { status: 400 })
    }

    // Vérifier le type de fichier
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Type de fichier non autorisé" }, { status: 400 })
    }

    // Créer le dossier uploads s'il n'existe pas
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = path.extname(file.name)
    const fileName = `${timestamp}-${randomString}${fileExtension}`
    const filePath = path.join(uploadDir, fileName)

    // Convertir le fichier en buffer et l'écrire
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Sauvegarder les métadonnées en base de données
    const savedFile = await prisma.files.create({
      data: {
        name: file.name,
        type: file.type,
        size: file.size,
        url: `/uploads/${fileName}`,
        path: filePath,
        updatedAt: new Date(), // Ajouter le champ updatedAt manquant
      },
    })

    return NextResponse.json({
      id: savedFile.id,
      name: savedFile.name,
      type: savedFile.type,
      size: savedFile.size,
      url: savedFile.url,
    })
  } catch (error) {
    console.error("Erreur lors de l'upload:", error)
    return NextResponse.json({ error: "Erreur lors de l'upload du fichier" }, { status: 500 })
  }
}
