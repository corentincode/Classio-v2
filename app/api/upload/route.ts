import { type NextRequest, NextResponse } from "next/server"
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

    // Préparer les données pour l'envoi vers votre VPS
    const uploadFormData = new FormData()
    uploadFormData.append("file", file)
    uploadFormData.append("folder", "messages") // Organiser les fichiers par dossier

    // Envoyer le fichier vers votre VPS
    const uploadResponse = await fetch(`${process.env.VPS_API_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VPS_API_KEY}`,
      },
      body: uploadFormData,
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error("Erreur VPS:", errorText)
      throw new Error(`Erreur lors de l'upload vers le VPS: ${uploadResponse.status}`)
    }

    const uploadResult = await uploadResponse.json()
    console.log("Réponse de l'API VPS:", uploadResult)

    // CORRECTION : Utiliser l'URL complète retournée par l'API VPS
    // L'API VPS retourne maintenant uploadResult.url avec le chemin complet
    const fileUrl = `${process.env.VPS_STORAGE_URL}${uploadResult.url}`

    // Alternative si VPS_STORAGE_URL contient déjà le domaine complet :
    // const fileUrl = uploadResult.url.startsWith('http')
    //   ? uploadResult.url
    //   : `${process.env.VPS_STORAGE_URL}${uploadResult.url}`

    console.log("URL finale du fichier:", fileUrl)

    // Sauvegarder les métadonnées en base de données
    const savedFile = await prisma.files.create({
      data: {
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl, // URL complète avec la structure de dossiers
        path: uploadResult.path || uploadResult.filename, // Chemin relatif pour référence
        updatedAt: new Date(),
      },
    })

    console.log(`Fichier uploadé vers VPS: ${file.name}`)
    console.log(`URL du fichier: ${fileUrl}`)

    return NextResponse.json({
      id: savedFile.id,
      name: savedFile.name,
      type: savedFile.type,
      size: savedFile.size,
      url: savedFile.url,
    })
  } catch (error) {
    console.error("Erreur lors de l'upload:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de l'upload du fichier",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    )
  }
}
