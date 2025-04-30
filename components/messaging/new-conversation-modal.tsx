"use client"

import { useState, useEffect } from "react"
import type { User } from "next-auth"
import { X, Search } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

interface NewConversationModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser: User
  onConversationCreated: (conversation: any) => void
  establishmentId?: string
}

export default function NewConversationModal({
  isOpen,
  onClose,
  currentUser,
  onConversationCreated,
  establishmentId,
}: NewConversationModalProps) {
  const [isGroup, setIsGroup] = useState(false)
  const [title, setTitle] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedUsers, setSelectedUsers] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [initialMessage, setInitialMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([])
      return
    }

    const searchUsers = async () => {
      setIsSearching(true)
      try {
        let url = `/api/users/search?q=${encodeURIComponent(searchQuery)}`

        if (establishmentId) {
          url += `&establishmentId=${establishmentId}`
        }

        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          // Filtrer les utilisateurs déjà sélectionnés
          const filteredResults = data.filter((user: any) => !selectedUsers.some((selected) => selected.id === user.id))
          setSearchResults(filteredResults)
        }
      } catch (error) {
        console.error("Erreur lors de la recherche d'utilisateurs:", error)
      } finally {
        setIsSearching(false)
      }
    }

    const timeoutId = setTimeout(searchUsers, 500)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, selectedUsers, establishmentId])


  
  const handleSelectUser = (user: any) => {
    setSelectedUsers((prev) => [...prev, user])
    setSearchResults((prev) => prev.filter((u) => u.id !== user.id))
    setSearchQuery("")
  }

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  // Dans components/messaging/new-conversation-modal.tsx
const handleSubmit = async () => {
    if (selectedUsers.length === 0) return
    if (isGroup && !title.trim()) return
  
    setIsSubmitting(true)
  
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: isGroup ? title : null,
          isGroup,
          participantIds: selectedUsers.map((user) => user.id),
          initialMessage: initialMessage.trim() || null,
        }),
      })
  
      if (response.ok) {
        const conversation = await response.json()
        
        // Informer le parent que la conversation a été créée
        onConversationCreated(conversation)
        
        // Fermer le modal
        handleClose()
        
        // Attendre un court instant avant de rediriger
        // Cela permet de s'assurer que l'état est correctement mis à jour
        setTimeout(() => {
          // Déterminer la route de redirection en fonction du rôle
          let redirectUrl = '';
          
          switch (currentUser.role) {
            case "ELEVE":
              redirectUrl = `/eleve/messagerie/${conversation.id}`;
              break;
            case "PARENT":
              redirectUrl = `/parent/messagerie/${conversation.id}`;
              break;
            case "PROFESSEUR":
              redirectUrl = `/professeur/messagerie/${conversation.id}${establishmentId ? `?establishmentId=${establishmentId}` : ''}`;
              break;
            case "ADMINISTRATION":
            case "SUPERADMIN":
              redirectUrl = `/admin/messagerie/${conversation.id}`;
              break;
            default:
              redirectUrl = `/messagerie/${conversation.id}`;
          }
          
          // Utiliser window.location pour une navigation complète
          // Cela peut aider à résoudre les problèmes de session
          window.location.href = redirectUrl;
        }, 100);
      }
    } catch (error) {
      console.error("Erreur lors de la création de la conversation:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsGroup(false)
    setTitle("")
    setSearchQuery("")
    setSearchResults([])
    setSelectedUsers([])
    setInitialMessage("")
    onClose()
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle conversation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="isGroup" checked={isGroup} onCheckedChange={(checked) => setIsGroup(checked as boolean)} />
            <Label htmlFor="isGroup" className="cursor-pointer">
              Créer un groupe
            </Label>
          </div>

          {isGroup && (
            <div className="space-y-2">
              <Label htmlFor="title">Nom du groupe</Label>
              <Input id="title" placeholder="Nom du groupe" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
          )}

          <div className="space-y-2">
            <Label>Participants</Label>

            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedUsers.map((user) => (
                  <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                    {user.name || user.email}
                    <button
                      onClick={() => handleRemoveUser(user.id)}
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des utilisateurs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {searchResults.length > 0 && (
              <ScrollArea className="h-40 border rounded-md">
                <div className="p-2 space-y-1">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                      onClick={() => handleSelectUser(user)}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name || user.email}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getRoleLabel(user.role)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {searchQuery && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
              <p className="text-sm text-muted-foreground p-2">Aucun utilisateur trouvé</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message initial (optionnel)</Label>
            <Textarea
              id="message"
              placeholder="Écrivez votre premier message..."
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedUsers.length === 0 || (isGroup && !title.trim()) || isSubmitting}
          >
            {isSubmitting ? "Création..." : "Créer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}