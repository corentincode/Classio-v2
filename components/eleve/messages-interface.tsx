"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send, PaperclipIcon, Plus } from "lucide-react"

export function MessagesInterface() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1")
  const [searchQuery, setSearchQuery] = useState("")

  // Données fictives pour les conversations
  const conversations = [
    {
      id: "1",
      name: "M. Dupont",
      role: "Professeur de mathématiques",
      avatar: "/placeholder.svg",
      initials: "MD",
      lastMessage: "N'oubliez pas de rendre le devoir pour demain !",
      timestamp: "10:30",
      unread: true,
    },
    {
      id: "2",
      name: "Mme Laurent",
      role: "Professeur de français",
      avatar: "/placeholder.svg",
      initials: "ML",
      lastMessage: "Votre exposé était très bien présenté.",
      timestamp: "Hier",
      unread: false,
    },
    {
      id: "3",
      name: "M. Martin",
      role: "Professeur d'histoire-géographie",
      avatar: "/placeholder.svg",
      initials: "MM",
      lastMessage: "Je vous ai envoyé les documents pour l'exposé.",
      timestamp: "Lun",
      unread: false,
    },
    {
      id: "4",
      name: "Mme Dubois",
      role: "Professeur de sciences",
      avatar: "/placeholder.svg",
      initials: "MD",
      lastMessage: "N'oubliez pas de rapporter votre blouse pour le TP de demain.",
      timestamp: "28/04",
      unread: false,
    },
  ]

  // Filtrer les conversations en fonction de la recherche
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Données fictives pour les messages de la conversation sélectionnée
  const messages = {
    "1": [
      {
        id: "1",
        sender: "M. Dupont",
        content: "Bonjour Emma, je voulais vous rappeler que le devoir sur les équations est à rendre pour demain.",
        timestamp: "10:30",
        isMe: false,
      },
      {
        id: "2",
        sender: "Moi",
        content: "Bonjour Monsieur, merci pour le rappel. J'ai presque terminé le devoir.",
        timestamp: "10:35",
        isMe: true,
      },
      {
        id: "3",
        sender: "M. Dupont",
        content: "Parfait ! N'hésitez pas si vous avez des questions.",
        timestamp: "10:40",
        isMe: false,
      },
      {
        id: "4",
        sender: "Moi",
        content: "J'ai une question sur l'exercice 3. Je ne comprends pas comment résoudre l'équation différentielle.",
        timestamp: "10:45",
        isMe: true,
      },
      {
        id: "5",
        sender: "M. Dupont",
        content:
          "Pour l'équation différentielle, vous devez d'abord identifier si elle est du premier ou du second ordre, puis appliquer la méthode appropriée. Je vous suggère de revoir le cours page 45.",
        timestamp: "10:50",
        isMe: false,
      },
      {
        id: "6",
        sender: "Moi",
        content: "Merci beaucoup, je vais regarder ça !",
        timestamp: "10:55",
        isMe: true,
      },
      {
        id: "7",
        sender: "M. Dupont",
        content: "N'oubliez pas de rendre le devoir pour demain !",
        timestamp: "11:30",
        isMe: false,
      },
    ],
    "2": [
      {
        id: "1",
        sender: "Mme Laurent",
        content: "Bonjour Emma, votre exposé sur Molière était très bien présenté.",
        timestamp: "Hier, 14:20",
        isMe: false,
      },
      {
        id: "2",
        sender: "Moi",
        content: "Merci beaucoup Madame ! J'ai beaucoup travaillé dessus.",
        timestamp: "Hier, 14:30",
        isMe: true,
      },
      {
        id: "3",
        sender: "Mme Laurent",
        content: "Cela se voit ! J'ai particulièrement apprécié votre analyse des personnages dans 'Le Misanthrope'.",
        timestamp: "Hier, 14:35",
        isMe: false,
      },
    ],
    "3": [
      {
        id: "1",
        sender: "M. Martin",
        content: "Bonjour Emma, je vous ai envoyé les documents pour l'exposé sur la Guerre Froide.",
        timestamp: "Lundi, 09:15",
        isMe: false,
      },
      {
        id: "2",
        sender: "Moi",
        content: "Merci Monsieur, je les ai bien reçus.",
        timestamp: "Lundi, 10:20",
        isMe: true,
      },
      {
        id: "3",
        sender: "M. Martin",
        content: "N'hésitez pas si vous avez des questions. L'exposé est prévu pour le 22 mai.",
        timestamp: "Lundi, 10:25",
        isMe: false,
      },
    ],
    "4": [
      {
        id: "1",
        sender: "Mme Dubois",
        content: "Bonjour à tous, n'oubliez pas de rapporter votre blouse pour le TP de demain.",
        timestamp: "28/04, 16:45",
        isMe: false,
      },
      {
        id: "2",
        sender: "Moi",
        content: "Est-ce que nous aurons besoin d'autre chose pour le TP ?",
        timestamp: "28/04, 17:00",
        isMe: true,
      },
      {
        id: "3",
        sender: "Mme Dubois",
        content:
          "Apportez également votre cahier de TP et un stylo à encre effaçable. Nous travaillerons sur les réactions d'oxydo-réduction.",
        timestamp: "28/04, 17:15",
        isMe: false,
      },
    ],
  }

  const currentMessages = selectedConversation ? messages[selectedConversation as keyof typeof messages] : []
  const currentConversation = conversations.find((conv) => conv.id === selectedConversation)

  return (
    <div className="flex h-[calc(100vh-13rem)] overflow-hidden">
      {/* Liste des conversations */}
      <div className="w-full max-w-xs border-r">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-auto h-[calc(100%-4rem)]">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">Aucune conversation trouvée</div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 ${
                  selectedConversation === conversation.id ? "bg-muted" : ""
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                  <AvatarFallback>{conversation.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-medium truncate">{conversation.name}</div>
                    <div className="text-xs text-muted-foreground">{conversation.timestamp}</div>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{conversation.role}</div>
                  <div className="text-sm truncate">
                    {conversation.unread ? (
                      <span className="font-medium">{conversation.lastMessage}</span>
                    ) : (
                      <span className="text-muted-foreground">{conversation.lastMessage}</span>
                    )}
                  </div>
                </div>
                {conversation.unread && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Zone de conversation */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* En-tête de la conversation */}
          <div className="p-4 border-b flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentConversation?.avatar || "/placeholder.svg"} alt={currentConversation?.name} />
              <AvatarFallback>{currentConversation?.initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{currentConversation?.name}</div>
              <div className="text-xs text-muted-foreground">{currentConversation?.role}</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {currentMessages.map((message) => (
              <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <div className="text-sm">{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${message.isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                  >
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Zone de saisie */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <PaperclipIcon className="h-4 w-4" />
              </Button>
              <Input placeholder="Écrivez votre message..." className="flex-1" />
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="font-medium">Sélectionnez une conversation</h3>
            <p className="text-sm text-muted-foreground">Choisissez une conversation pour commencer à discuter</p>
          </div>
        </div>
      )}
    </div>
  )
}
