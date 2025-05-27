"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import type { User } from "next-auth"
import { ArrowLeft, MoreVertical, Info, Send, Loader2, Smile, Paperclip } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ConversationInfoModal from "./conversation-info-modal"
import EmojiPicker from "./emoji-picker"
import FileUpload from "./file-upload"
import FilePreview from "./file-preview"

// Mettre à jour l'interface Message pour inclure les fichiers
interface Message {
  id: string
  content: string
  createdAt: string
  senderId: string
  sender: {
    id: string
    name: string | null
    email: string
    role: string
  }
  file?: {
    id: string
    name: string
    type: string
    size: number
    url: string
  } | null
}

interface ConversationProps {
  conversationId: string
  currentUser: User
  initialConversation?: any
}

export default function Conversation({ conversationId, currentUser, initialConversation }: ConversationProps) {
  const router = useRouter()
  const [conversation, setConversation] = useState<any>(initialConversation)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(!initialConversation)
  const [isLoadingMessages, setIsLoadingMessages] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  // Ajouter les états pour la gestion des fichiers dans le composant Conversation
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    const fetchConversation = async () => {
      if (initialConversation) return

      try {
        const response = await fetch(`/api/conversations/${conversationId}`)
        if (response.ok) {
          const data = await response.json()
          setConversation(data)
        } else {
          router.push("/parent/messagerie")
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la conversation:", error)
        router.push("/parent/messagerie")
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversation()
  }, [conversationId, initialConversation, router])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return

      try {
        const response = await fetch(`/api/conversations/${conversationId}/messages`)
        if (response.ok) {
          const data = await response.json()
          setMessages(data)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des messages:", error)
      } finally {
        setIsLoadingMessages(false)
      }
    }

    fetchMessages()
  }, [conversationId])

  useEffect(() => {
    // Marquer la conversation comme lue
    if (conversationId) {
      fetch(`/api/conversations/${conversationId}/seen`, {
        method: "POST",
      }).catch((error) => {
        console.error("Erreur lors du marquage de la conversation comme lue:", error)
      })
    }
  }, [conversationId, messages])

  useEffect(() => {
    // Faire défiler jusqu'au dernier message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getConversationTitle = () => {
    if (!conversation) return "Chargement..."

    if (conversation.isGroup) {
      return conversation.title || "Groupe sans nom"
    }

    const otherParticipant = conversation.participants.find(
        (participant: any) => participant.user.id !== currentUser.id,
    )

    return otherParticipant?.user.name || otherParticipant?.user.email || "Utilisateur inconnu"
  }

  // Ajouter la fonction handleFileSelect
  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  // Ajouter la fonction handleCancelFileUpload
  const handleCancelFileUpload = () => {
    setSelectedFile(null)
    setIsFileUploadOpen(false)
  }

  // Modifier la fonction handleSendMessage pour gérer l'envoi de fichiers
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if ((!newMessage.trim() && !selectedFile) || isSending) return

    setIsSending(true)

    try {
      let fileId = null

      // Si un fichier est sélectionné, le télécharger d'abord
      if (selectedFile) {
        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", selectedFile)

        // Simuler la progression du téléchargement
        const uploadInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(uploadInterval)
              return 90
            }
            return prev + 10
          })
        }, 300)
        console.log(selectedFile);
        
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        clearInterval(uploadInterval)
        setUploadProgress(100)

        if (uploadResponse.ok) {
          const fileData = await uploadResponse.json()
          fileId = fileData.id
        } else {
          throw new Error("Échec du téléchargement du fichier")
        }
      }

      // Envoyer le message avec ou sans fichier
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage,
          fileId,
        }),
      })

      if (response.ok) {
        const message = await response.json()
        setMessages((prev) => [...prev, message])
        setNewMessage("")
        setSelectedFile(null)
        setIsFileUploadOpen(false)
        setUploadProgress(0)
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error)
    } finally {
      setIsSending(false)
      setIsUploading(false)
    }
  }

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === now.toDateString()) {
      return `Aujourd'hui à ${format(date, "HH:mm")}`
    }

    if (date.toDateString() === yesterday.toDateString()) {
      return `Hier à ${format(date, "HH:mm")}`
    }

    return format(date, "dd MMMM à HH:mm", { locale: fr })
  }

  const handleBack = () => {
    router.push("/parent/messagerie")
  }

  const handleDeleteConversation = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette conversation ?")) return

    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/parent/messagerie")
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la conversation:", error)
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prevMessage) => prevMessage + emoji)
  }

  if (isLoading) {
    return (
        <div className="h-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  return (
      <div className="h-full flex flex-col">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-3">
              <Avatar>
                {conversation?.isGroup ? (
                    <div className="h-full w-full bg-indigo-500 flex items-center justify-center">
                      <Badge className="h-5 w-5 p-0 flex items-center justify-center">
                        {conversation.participants.length}
                      </Badge>
                    </div>
                ) : (
                    <AvatarFallback>{getConversationTitle().charAt(0).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>

              <div>
                <h2 className="font-medium">{getConversationTitle()}</h2>
                <p className="text-xs text-muted-foreground">
                  {conversation?.isGroup ? `${conversation.participants.length} participants` : "Conversation privée"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsInfoModalOpen(true)}>
              <Info className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsInfoModalOpen(true)}>Informations</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDeleteConversation}>
                  Supprimer la conversation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          {isLoadingMessages ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
          ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Send className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-2 text-lg font-medium">Aucun message</h3>
                <p className="text-sm text-muted-foreground mt-1">Commencez la conversation en envoyant un message</p>
              </div>
          ) : (
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isOwn = message.sender.id === currentUser.id
                  const showAvatar = index === 0 || messages[index - 1].sender.id !== message.sender.id

                  return (
                      <div key={message.id} className={cn("flex gap-2", isOwn ? "justify-end" : "justify-start")}>
                        {!isOwn && showAvatar && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {message.sender.name
                                    ? message.sender.name.charAt(0).toUpperCase()
                                    : message.sender.email.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                        )}

                        {!isOwn && !showAvatar && <div className="w-8" />}

                        <div className={cn("max-w-[70%] space-y-1", isOwn && "items-end")}>
                          {showAvatar && !isOwn && (
                              <p className="text-xs font-medium ml-1">{message.sender.name || message.sender.email}</p>
                          )}

                          <div
                              className={cn(
                                  "rounded-lg px-3 py-2 text-sm",
                                  isOwn ? "bg-primary text-primary-foreground" : "bg-white",
                              )}
                          >
                            {message.content}
                            {message.file && (
                                <div className="mt-2">
                                  <FilePreview file={message.file} />
                                </div>
                            )}
                          </div>

                          <p className={cn("text-xs text-muted-foreground", isOwn ? "text-right" : "text-left")}>
                            {formatMessageDate(message.createdAt)}
                          </p>
                        </div>
                      </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
          )}
        </ScrollArea>

        <form onSubmit={handleSendMessage} className="p-4 border-t">
          {isFileUploadOpen && (
              <div className="mb-4">
                <FileUpload
                    onFileSelect={handleFileSelect}
                    onCancel={handleCancelFileUpload}
                    isUploading={isUploading}
                    progress={uploadProgress}
                />
              </div>
          )}

          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  className="flex-shrink-0"
              >
                <Smile className="h-5 w-5" />
              </Button>

              {isEmojiPickerOpen && (
                  <div className="absolute bottom-12 left-0 z-10">
                    <EmojiPicker onEmojiSelect={handleEmojiSelect} onClose={() => setIsEmojiPickerOpen(false)} />
                  </div>
              )}
            </div>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsFileUploadOpen(!isFileUploadOpen)
                  setIsEmojiPickerOpen(false)
                }}
                className="flex-shrink-0"
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            <Input
                placeholder="Écrivez un message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSending}
                className="flex-1"
            />

            <Button type="submit" size="icon" disabled={(!newMessage.trim() && !selectedFile) || isSending}>
              {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </form>

        {conversation && (
            <ConversationInfoModal
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
                conversation={conversation}
                currentUser={currentUser}
                onConversationUpdated={setConversation}
            />
        )}
      </div>
  )
}
