import Client from "ssh2-sftp-client"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import type { File } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import type Express from "express" // Import Express to declare the variable

// Configuration SFTP
const sftpConfig = {
    host: process.env.SFTP_HOST,
    port: Number.parseInt(process.env.SFTP_PORT || "22"),
    username: process.env.SFTP_USERNAME,
    password: process.env.SFTP_PASSWORD,
    // Ou utilisez une clé privée
    // privateKey: fs.readFileSync('/path/to/private/key')
}

// Répertoire distant sur le VPS
const remoteDir =  "/var/www/classio/files-sftp"

// URL de base pour accéder aux fichiers
const baseUrl = process.env.FILE_BASE_URL || "http://46.202.153.153"

export async function uploadFile(file: Express.Multer.File): Promise<File> {
    const sftp = new Client()

    try {
        // Générer un nom de fichier unique
        const fileExtension = path.extname(file.originalname)
        const fileName = `classio-${uuidv4()}${fileExtension}`

        // Chemin complet sur le serveur distant
        const remotePath = `${remoteDir}/${fileName}`

        // Chemin local temporaire
        const localPath = file.path

        // Se connecter au serveur SFTP
        await sftp.connect(sftpConfig)

        // Télécharger le fichier
        await sftp.put(localPath, remotePath)

        // Créer l'entrée dans la base de données
        const fileRecord = await prisma.file.create({
            data: {
                name: file.originalname,
                type: file.mimetype,
                size: file.size,
                path: remotePath,
                url: `${baseUrl}/${fileName}`,
            },
        })

        return fileRecord
    } catch (error) {
        console.error("Erreur lors du téléchargement du fichier:", error)
        throw new Error("Échec du téléchargement du fichier")
    } finally {
        // Fermer la connexion SFTP
        await sftp.end()

        // Supprimer le fichier temporaire local
        if (file.path) {
            fs.unlink(file.path, (err) => {
                if (err) console.error("Erreur lors de la suppression du fichier temporaire:", err)
            })
        }
    }
}

export async function deleteFile(fileId: string): Promise<boolean> {
    const sftp = new createClient()

    try {
        // Récupérer les informations du fichier
        const file = await prisma.file.findUnique({
            where: { id: fileId },
        })

        if (!file) {
            throw new Error("Fichier non trouvé")
        }

        // Se connecter au serveur SFTP
        await sftp.connect(sftpConfig)

        // Supprimer le fichier du serveur
        await sftp.delete(file.path)

        // Supprimer l'entrée de la base de données
        await prisma.file.delete({
            where: { id: fileId },
        })

        return true
    } catch (error) {
        console.error("Erreur lors de la suppression du fichier:", error)
        return false
    } finally {
        // Fermer la connexion SFTP
        await sftp.end()
    }
}
