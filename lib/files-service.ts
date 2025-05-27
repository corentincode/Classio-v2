import { Client } from "basic-ftp"
import { v4 as uuidv4 } from "uuid"
import path from "path"
import fs from "fs"
import prisma from "@/lib/prisma"

// Configuration FTP
const FTP_CONFIG = {
  host: process.env.FTP_HOST || "localhost",
  port: Number.parseInt(process.env.FTP_PORT || "21"),
  user: process.env.FTP_USERNAME || "user",
  password: process.env.FTP_PASSWORD || "password",
  secure: process.env.FTP_SECURE === 'true' // pour FTPS
}

// Dossier distant sur le serveur FTP
const REMOTE_DIR = process.env.FTP_REMOTE_DIR || "/uploads"

// URL de base pour accéder aux fichiers
const FILE_BASE_URL = process.env.FILE_BASE_URL || "/api/files"

// Interface pour les fichiers
export interface FileData {
  id: string
  name: string
  type: string
  size: number
  url: string
  path: string
}

export async function uploadFile(file: any, messageId?: string): Promise<FileData> {
  // Créer un nom de fichier unique avec un préfixe pour éviter les collisions
  const fileExtension = path.extname(file.originalname)
  const fileName = `classio-${uuidv4()}${fileExtension}`

  // Créer la structure de dossiers par date
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")

  // Chemin local temporaire
  const tempDir = path.join(process.cwd(), "tmp")
  const tempPath = path.join(tempDir, fileName)

  // S'assurer que le dossier temporaire existe
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  // Écrire le fichier temporairement
  fs.writeFileSync(tempPath, file.buffer)

  // Initialiser le client FTP
  const client = new Client()
  client.ftp.verbose = true // Pour le debug

  try {
    console.log("Connexion au serveur FTP...")
    await client.access(FTP_CONFIG)
    console.log("Connexion FTP établie avec succès")

    // Aller au répertoire racine
    await client.cd("/")

    // Vérifier/créer le dossier racine distant
    try {
      await client.cd(REMOTE_DIR)
      console.log(`Dossier distant ${REMOTE_DIR} existe`)
      // Revenir à la racine
      await client.cd("/")
    } catch (error) {
      console.log(`Le dossier distant ${REMOTE_DIR} n'existe pas, tentative de création...`)
      try {
        // Créer le dossier en enlevant le / initial s'il existe
        const dirName = REMOTE_DIR.startsWith("/") ? REMOTE_DIR.substring(1) : REMOTE_DIR
        await client.ensureDir(dirName)
        console.log(`Dossier distant ${REMOTE_DIR} créé avec succès`)
      } catch (mkdirError) {
        console.error(`Impossible de créer le dossier distant ${REMOTE_DIR}:`, mkdirError)
        throw new Error("Impossible de créer le dossier distant")
      }
    }

    // Créer le chemin complet pour l'année et le mois
    const yearPath = `${REMOTE_DIR}/${year}`.replace(/\/+/g, '/') // Éviter les doubles slashes
    const monthPath = `${yearPath}/${month}`

    // Créer les dossiers année/mois s'ils n'existent pas
    try {
      console.log(`Création/vérification des dossiers ${yearPath} et ${monthPath}...`)
      
      // Naviguer vers le dossier de base
      await client.cd(REMOTE_DIR)
      
      // Créer/naviguer vers le dossier année
      try {
        await client.cd(String(year))
        console.log(`Dossier année ${year} existe`)
      } catch {
        await client.ensureDir(String(year))
        await client.cd(String(year))
        console.log(`Dossier année ${year} créé`)
      }
      
      // Créer/naviguer vers le dossier mois
      try {
        await client.cd(month)
        console.log(`Dossier mois ${month} existe`)
      } catch {
        await client.ensureDir(month)
        await client.cd(month)
        console.log(`Dossier mois ${month} créé`)
      }

      console.log(`Dossiers distants créés ou existants: ${monthPath}`)
    } catch (mkdirError) {
      console.error(`Impossible de créer les dossiers distants pour année/mois:`, mkdirError)
      throw new Error("Impossible de créer les dossiers distants pour année/mois")
    }

    console.log(`Téléchargement du fichier ${tempPath} vers ${fileName}...`)

    // Télécharger le fichier dans le répertoire courant (année/mois)
    await client.uploadFrom(tempPath, fileName)
    console.log(`Fichier téléchargé avec succès vers ${monthPath}/${fileName}`)

    // Supprimer le fichier temporaire
    fs.unlinkSync(tempPath)
    console.log(`Fichier temporaire ${tempPath} supprimé`)

    // URL publique du fichier
    const fileUrl = `${FILE_BASE_URL}/${year}/${month}/${fileName}`

    // Enregistrer le fichier dans la base de données
    const dbFile = await prisma.files.create({
      data: {
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
        url: fileUrl,
        path: `${year}/${month}/${fileName}`,
        messageId: messageId || null, // Établir la relation avec le message si fourni
      },
    })

    console.log(`Fichier enregistré dans la base de données avec l'ID ${dbFile.id}`)
    return dbFile
  } catch (error) {
    console.error("Erreur lors du téléchargement du fichier:", error)

    // Supprimer le fichier temporaire en cas d'erreur
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath)
    }

    // Essayer de stocker localement en cas d'échec FTP
    console.log("Tentative de stockage local comme solution de secours...")
    try {
      return await uploadFileLocally(file, messageId)
    } catch (localError) {
      console.error("Échec également du stockage local:", localError)
      throw new Error("Échec du téléchargement du fichier (FTP et local)")
    }
  } finally {
    // Fermer la connexion FTP
    try {
      client.close()
      console.log("Connexion FTP fermée")
    } catch (endError) {
      console.error("Erreur lors de la fermeture de la connexion FTP:", endError)
    }
  }
}

// Fonction alternative pour stocker les fichiers localement
export async function uploadFileLocally(file: any, messageId?: string): Promise<FileData> {
  console.log("Stockage local du fichier...")

  // Créer un nom de fichier unique
  const fileExtension = path.extname(file.originalname)
  const fileName = `classio-${uuidv4()}${fileExtension}`

  // Créer la structure de dossiers par date
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const uploadDir = path.join(process.cwd(), "public", "uploads", String(year), month)

  // Créer le dossier s'il n'existe pas
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
    console.log(`Dossier local ${uploadDir} créé`)
  }

  // Chemin complet du fichier
  const filePath = path.join(uploadDir, fileName)
  const relativePath = path.join("uploads", String(year), month, fileName)

  // Écrire le fichier sur le disque
  fs.writeFileSync(filePath, file.buffer)
  console.log(`Fichier écrit localement à ${filePath}`)

  // URL publique du fichier
  const fileUrl = `/uploads/${year}/${month}/${fileName}`

  // Enregistrer le fichier dans la base de données
  const dbFile = await prisma.files.create({
    data: {
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
      url: fileUrl,
      path: relativePath,
      messageId: messageId || null, // Établir la relation avec le message si fourni
    },
  })

  console.log(`Fichier enregistré dans la base de données avec l'ID ${dbFile.id} (stockage local)`)
  return dbFile
}

// Fonction pour télécharger un fichier depuis le serveur FTP
export async function downloadFile(filePath: string): Promise<Buffer> {
  const client = new Client()
  
  try {
    await client.access(FTP_CONFIG)
    console.log(`Téléchargement du fichier ${filePath}...`)
    
    // Créer un fichier temporaire
    const tempPath = path.join(process.cwd(), "tmp", `download-${uuidv4()}`)
    
    // Télécharger le fichier
    await client.downloadTo(tempPath, `${REMOTE_DIR}/${filePath}`)
    
    // Lire le fichier et le retourner comme Buffer
    const fileBuffer = fs.readFileSync(tempPath)
    
    // Supprimer le fichier temporaire
    fs.unlinkSync(tempPath)
    
    return fileBuffer
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error)
    throw error
  } finally {
    client.close()
  }
}

// Fonction pour supprimer un fichier du serveur FTP
export async function deleteFile(filePath: string): Promise<void> {
  const client = new Client()
  
  try {
    await client.access(FTP_CONFIG)
    console.log(`Suppression du fichier ${filePath}...`)
    
    await client.remove(`${REMOTE_DIR}/${filePath}`)
    console.log(`Fichier ${filePath} supprimé avec succès`)
  } catch (error) {
    console.error("Erreur lors de la suppression:", error)
    throw error
  } finally {
    client.close()
  }
}