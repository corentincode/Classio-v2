"use client"

import { useState } from "react"
import type { User } from "next-auth"
import { UserPlus, Pencil, Trash } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ConversationInfoModalProps {
  isOpen: boolean
  onClose: () => void
  conversation: any
  currentUser: User
  onConversationUpdated: (conversation: any) => void
}

export default function ConversationInfoModal({
  isOpen,
  onClose,
  conversation,
  currentUser,
  onConversationUpdated,
}: ConversationInfoModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(conversation?.title || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUpdateTitle = async () => {
    if (!title.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/conversations/${conversation.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
        }),
      })

      if (response.ok) {
        const updatedConversation = await response.json()
        onConversationUpdated(updatedConversation)
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du titre:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveParticipant = async (userId: string) => {
    if (!conversation.isGroup) return
    if (userId === currentUser.id) return

    if (!confirm("Êtes-vous sûr de vouloir retirer ce participant ?")) return

    try {
      const currentParticipants = conversation.participants.map((p: any) => p.user.id)
      const updatedParticipants = currentParticipants.filter((id: string) => id !== userId)

      const response = await fetch(`/api/conversations/${conversation.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participantIds: updatedParticipants,
        }),
      })

      if (response.ok) {
        const updatedConversation = await response.json()
        onConversationUpdated(updatedConversation)
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du participant:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMMM yyyy à HH:mm", { locale: fr })
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ELEVE":
        return "Élève"
      case "PARENT":
        return "Parent"
      case "PROFESSEUR":
        return "Professeur"
      case "ADMINISTRATION":
        return "Administration"
      case "SUPERADMIN":
        return "Super Admin"
      default:
        return role
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Informations sur la conversation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {conversation?.isGroup ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Nom du groupe</Label>
                {!isEditing && (
                  <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setIsEditing(true)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nom du groupe"
                    className="flex-1"
                  />
                  <Button onClick={handleUpdateTitle} disabled={!title.trim() || isSubmitting}>
                    Enregistrer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      setTitle(conversation.title || "")
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              ) : (
                <p className="text-sm font-medium">{conversation.title || "Groupe sans nom"}</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Conversation avec</Label>
              <div className="flex items-center gap-3">
                {conversation?.participants
                  .filter((p: any) => p.user.id !== currentUser.id)
                  .map((participant: any) => (
                    <div key={participant.user.id} className="flex flex-col items-center">
                      <Avatar>
                        <AvatarFallback>
                          {participant.user.name 
                            ? participant.user.name.charAt(0).toUpperCase() 
                            : participant.user.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm mt-1">{participant.user.name || participant.user.email}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Participants ({conversation?.participants.length})</Label>
              {conversation?.isGroup && (
                <Button variant="outline" size="sm" className="h-8">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              )}
            </div>

            <ScrollArea className="h-40 border rounded-md">
              <div className="p-2 space-y-1">
                {conversation?.participants.map((participant: any) => (
                  <div
                    key={participant.user.id}
                    className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {participant.user.name 
                            ? participant.user.name.charAt(0).toUpperCase() 
                            : participant.user.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {participant.user.name || participant.user.email}
                          {participant.user.id === currentUser.id && " (Vous)"}
                        </p>
                        <p className="text-xs text-muted-foreground">{participant.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {getRoleLabel(participant.user.role)}
                      </Badge>

                      {conversation?.isGroup && participant.user.id !== currentUser.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleRemoveParticipant(participant.user.id)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Créée le</Label>
            <p className="text-sm">{formatDate(conversation?.createdAt)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}