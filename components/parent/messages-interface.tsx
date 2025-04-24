"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send, PaperclipIcon, Users } from "lucide-react"

// Données fictives pour les conversations
const conversations = [
  {
    id: 1,
    name: "Mme Martin",
    role: "Professeur principal - Emma",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Bonjour, pourriez-vous venir à la réunion parents-professeurs le 15 mai ?",
    date: "10 mai",
    unread: true,
  },
  {
    id: 2,
    name: "M. Bernard",
    role: "Professeur principal - Lucas",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Lucas a fait de bons progrès en mathématiques ce trimestre.",
    date: "8 mai",
    unread: false,
  },
  {
    id: 3,
    name: "Administration",
    role: "Collège Victor Hugo",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Information importante concernant les dates des conseils de classe.",
    date: "5 mai",
    unread: false,
  },
  {
    id: 4,
    name: "Mme Dubois",
    role: "Professeur de français - Emma",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Emma doit rendre son devoir de français pour lundi prochain.",
    date: "3 mai",
    unread: false,
  },
]

// Données fictives pour les messages
const messageHistory = [
  {
    id: 1,
    conversationId: 1,
    messages: [
      {
        id: 1,
        sender: "Mme Martin",
        content: "Bonjour M. et Mme Dupont, j'espère que vous allez bien.",
        time: "10 mai, 09:15",
        isParent: false,
      },
      {
        id: 2,
        sender: "Mme Martin",
        content:
          "Je vous contacte pour vous inviter à la réunion parents-professeurs qui aura lieu le 15 mai à 18h00 dans la salle polyvalente.",
        time: "10 mai, 09:16",
        isParent: false,
      },
      {
        id: 3,
        sender: "Mme Martin",
        content: "Ce sera l'occasion de discuter des progrès d'Emma et de son orientation pour l'année prochaine.",
        time: "10 mai, 09:17",
        isParent: false,
      },
      {
        id: 4,
        sender: "Mme Martin",
        content: "Pourriez-vous me confirmer votre présence ? Merci d'avance.",
        time: "10 mai, 09:18",
        isParent: false,
      },
    ],
  },
  {
    id: 2,
    conversationId: 2,
    messages: [
      {
        id: 1,
        sender: "M. Bernard",
        content: "Bonjour, je souhaitais vous informer des progrès de Lucas en mathématiques.",
        time: "8 mai, 14:30",
        isParent: false,
      },
      {
        id: 2,
        sender: "M. Bernard",
        content:
          "Il a obtenu d'excellents résultats lors du dernier contrôle et sa participation en classe est très active.",
        time: "8 mai, 14:31",
        isParent: false,
      },
      {
        id: 3,
        sender: "Vous",
        content: "Merci pour ces bonnes nouvelles ! Nous l'encourageons beaucoup à la maison.",
        time: "8 mai, 15:45",
        isParent: true,
      },
      {
        id: 4,
        sender: "M. Bernard",
        content: "C'est très bien. Continuez ainsi, cela porte ses fruits !",
        time: "8 mai, 16:20",
        isParent: false,
      },
    ],
  },
]

export function MessagesInterface() {
  const [activeConversation, setActiveConversation] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const currentMessages =
    messageHistory.find((history) => history.conversationId === activeConversation)?.messages || []

  const currentConversation = conversations.find((conv) => conv.id === activeConversation)

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return
    // Ici, on ajouterait la logique pour envoyer le message
    // Pour l'instant, on réinitialise juste le champ
    setNewMessage("")
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] gap-4">
      {/* Liste des conversations */}
      <Card className="w-full md:w-1/3 flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="flex-1 p-0 overflow-auto">
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 cursor-pointer hover:bg-accent ${
                  activeConversation === conversation.id ? "bg-accent" : ""
                }`}
                onClick={() => setActiveConversation(conversation.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                    <AvatarFallback>{conversation.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium truncate">{conversation.name}</h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{conversation.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{conversation.role}</p>
                    <p className="text-sm truncate mt-1">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread && <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Zone de conversation */}
      <Card className="w-full md:w-2/3 flex flex-col">
        {activeConversation ? (
          <>
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={currentConversation?.avatar || "/placeholder.svg"}
                    alt={currentConversation?.name}
                  />
                  <AvatarFallback>{currentConversation?.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{currentConversation?.name}</h3>
                  <p className="text-xs text-muted-foreground">{currentConversation?.role}</p>
                </div>
              </div>
            </div>
            <CardContent className="flex-1 p-4 overflow-auto">
              <div className="space-y-4">
                {currentMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.isParent ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.isParent ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{message.sender}</span>
                        <span className="text-xs opacity-70 ml-2">{message.time}</span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="shrink-0">
                  <PaperclipIcon className="h-4 w-4" />
                  <span className="sr-only">Joindre un fichier</span>
                </Button>
                <Input
                  placeholder="Écrivez votre message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button onClick={handleSendMessage} className="shrink-0">
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Messagerie</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              Sélectionnez une conversation pour afficher les messages ou commencez une nouvelle discussion.
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
