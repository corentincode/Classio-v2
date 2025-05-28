// Route pour supprimer un fichier
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { vpsClient } from "@/lib/vps-client"

export async function DELETE(request: NextRequest, { params }: { params: { fileId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { fileId } = params

    // Récupérer le fichier
    const file = await prisma.files.findUnique({
      where: { id: fileId },
      include: {
        Message: {
          include: {
            sender: { select: { id: true } },
          },
        },
      },
    })

    if (!file) {
      return NextResponse.json({ error: "Fichier non trouvé" }, { status: 404 })
    }

    // Vérifier que l'utilisateur peut supprimer ce fichier
    if (file.Message?.sender.id !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    try {
      // Supprimer le fichier du VPS
      await vpsClient.deleteFile(file.path)
    } catch (vpsError) {
      console.error("Erreur lors de la suppression sur le VPS:", vpsError)
      // Continuer même si la suppression VPS échoue
    }

    // Supprimer l'entrée de la base de données
    await prisma.files.delete({
      where: { id: fileId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}
