"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import type { User } from "next-auth"
import { MessageSquare, Users, Search, PlusCircle, UserPlus } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import NewConversationModal from "./new-conversation-modal"

interface Conversation {
  id: string
  title: string | null
  isGroup: boolean
  lastMessageAt: Date
  participants: {
    user: {
      id: string
      name: string | null
      email: string
      role: string
    }
  }[]
  messages: {
    content: string
    createdAt: Date
    sender: {
      id: string
      name: string | null
    }
  }[]
}

interface ConversationListProps {
  currentUser: User
  establishmentId?: string
}

export default function ConversationList({ currentUser, establishmentId }: ConversationListProps) {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch("/api/conversations")
        if (response.ok) {
          const data = await response.json()
          setConversations(data)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des conversations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversations()
  }, [])

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.isGroup) {
      return conversation.title || "Groupe sans nom"
    }

    const otherParticipant = conversation.participants.find((participant) => participant.user.id !== currentUser.id)

    return otherParticipant?.user.name || otherParticipant?.user.email || "Utilisateur inconnu"
  }

  const getLastMessage = (conversation: Conversation) => {
    // Vérifier si messages existe et a une longueur
    if (!conversation.messages || conversation.messages.length === 0) {
      return "Aucun message"
    }
  
    const lastMessage = conversation.messages[0]
    const isOwnMessage = lastMessage.sender.id === currentUser.id
  
    return `${isOwnMessage ? "Vous" : (lastMessage.sender.name || "Utilisateur")}: ${lastMessage.content}`
  }

  const formatLastMessageTime = (date: Date) => {
    const now = new Date()
    const messageDate = new Date(date)

    // Si c'est aujourd'hui, afficher l'heure
    if (messageDate.toDateString() === now.toDateString()) {
      return format(messageDate, "HH:mm")
    }

    // Si c'est cette semaine, afficher le jour
    const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays < 7) {
      return format(messageDate, "EEEE", { locale: fr })
    }

    // Sinon afficher la date
    return format(messageDate, "dd/MM/yyyy")
  }

  const filteredConversations = conversations.filter((conversation) => {
    if (!searchQuery.trim()) return true

    // Rechercher dans le titre ou les noms des participants
    const title = getConversationTitle(conversation).toLowerCase()
    if (title.includes(searchQuery.toLowerCase())) return true

    // Rechercher dans les messages
    if (conversation.messages.some((msg) => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))) return true

    return false
  })

  // Dans components/messaging/conversation-list.tsx
const handleSelectConversation = (conversationId: string) => {
    let basePath = "";
    
    switch (currentUser.role) {
      case "ELEVE":
        basePath = "/eleve/messagerie";
        break;
      case "PARENT":
        basePath = "/parent/messagerie";
        break;
      case "PROFESSEUR":
        // Pour les professeurs, nous devons inclure l'establishmentId dans l'URL
        basePath = `/professeur/messagerie?establishmentId=${establishmentId}`;
        return router.push(`/professeur/messagerie/${conversationId}?establishmentId=${establishmentId}`);
      case "ADMINISTRATION":
      case "SUPERADMIN":
        basePath = "/admin/messagerie";
        break;
      default:
        basePath = "/messagerie";
    }
  
    router.push(`${basePath}/${conversationId}`);
  }

  const handleCreateConversation = () => {
    setIsModalOpen(true)
  }

  const handleConversationCreated = (newConversation: Conversation) => {
    setConversations((prev) => [newConversation, ...prev])
    router.push(`/parent/messagerie/${newConversation.id}`)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b">
        <h2 className="text-xl font-semibold">Messages</h2>
        <div className="mt-2 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button size="icon" variant="outline" onClick={handleCreateConversation}>
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">Aucune conversation</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery ? "Aucun résultat pour cette recherche" : "Commencez une nouvelle conversation"}
            </p>
            <Button onClick={handleCreateConversation} className="mt-4" variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              Nouvelle conversation
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="p-4 hover:bg-muted cursor-pointer transition"
                onClick={() => handleSelectConversation(conversation.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center text-white",
                      conversation.isGroup ? "bg-indigo-500" : "bg-emerald-500",
                    )}
                  >
                    {conversation.isGroup ? (
                      <Users className="h-5 w-5" />
                    ) : (
                      <div className="font-medium">
                        {(getConversationTitle(conversation).charAt(0) || "?").toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{getConversationTitle(conversation)}</h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatLastMessageTime(new Date(conversation.lastMessageAt))}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">{getLastMessage(conversation)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <NewConversationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUser={currentUser}
        onConversationCreated={handleConversationCreated}
        establishmentId={establishmentId}
      />
    </div>
  )
}