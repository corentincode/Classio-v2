"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Send, Paperclip, MoreVertical } from "lucide-react"

export function MessagingInterface() {
  const [selectedConversation, setSelectedConversation] = useState(1)

  // Exemple de conversations
  const conversations = [
    {
      id: 1,
      name: "Sophie Dupont",
      avatar: "/placeholder.svg",
      initials: "SD",
      role: "Enseignante - Mathématiques",
      lastMessage: "Bonjour, pourriez-vous me confirmer l'horaire de la réunion de demain ?",
      time: "10:23",
      unread: true,
    },
    {
      id: 2,
      name: "Thomas Martin",
      avatar: "/placeholder.svg",
      initials: "TM",
      role: "Enseignant - Français",
      lastMessage: "J'ai bien reçu les documents, merci.",
      time: "Hier",
      unread: false,
    },
    {
      id: 3,
      name: "Parents d'Emma Martin",
      avatar: "/placeholder.svg",
      initials: "EM",
      role: "Parents - 6ème A",
      lastMessage: "Nous souhaiterions prendre rendez-vous pour discuter des résultats de notre fille.",
      time: "Hier",
      unread: true,
    },
    {
      id: 4,
      name: "Julie Bernard",
      avatar: "/placeholder.svg",
      initials: "JB",
      role: "Enseignante - Histoire-Géo",
      lastMessage: "La sortie au musée est confirmée pour le 15 mai.",
      time: "Lun",
      unread: false,
    },
    {
      id: 5,
      name: "Nicolas Petit",
      avatar: "/placeholder.svg",
      initials: "NP",
      role: "Enseignant - Physique-Chimie",
      lastMessage: "Pouvez-vous me transmettre la liste des élèves pour le TP de demain ?",
      time: "28 avr",
      unread: false,
    },
  ]

  // Exemple de messages pour la conversation sélectionnée
  const messages = [
    {
      id: 1,
      sender: "Sophie Dupont",
      avatar: "/placeholder.svg",
      initials: "SD",
      content: "Bonjour, pourriez-vous me confirmer l'horaire de la réunion de demain ?",
      time: "10:23",
      isMe: false,
    },
    {
      id: 2,
      sender: "Moi",
      avatar: "/placeholder.svg",
      initials: "AD",
      content: "Bonjour Sophie, la réunion est prévue à 17h en salle des professeurs.",
      time: "10:25",
      isMe: true,
    },
    {
      id: 3,
      sender: "Sophie Dupont",
      avatar: "/placeholder.svg",
      initials: "SD",
      content: "Parfait, merci pour cette confirmation. Est-ce que tous les enseignants de 6ème A seront présents ?",
      time: "10:28",
      isMe: false,
    },
    {
      id: 4,
      sender: "Moi",
      avatar: "/placeholder.svg",
      initials: "AD",
      content:
        "Oui, j'ai envoyé une convocation à tous les enseignants de la classe. Nous ferons le point sur les résultats du premier trimestre.",
      time: "10:30",
      isMe: true,
    },
    {
      id: 5,
      sender: "Sophie Dupont",
      avatar: "/placeholder.svg",
      initials: "SD",
      content: "Très bien. J'apporterai les évaluations et les moyennes de la classe en mathématiques.",
      time: "10:32",
      isMe: false,
    },
  ]

  return (
    <div className="flex flex-col md:flex-row h-[600px] gap-4">
      {/* Liste des conversations */}
      <Card className="md:w-1/3 flex flex-col">
        <CardContent className="p-3 flex flex-col h-full">
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Rechercher une conversation..." className="pl-9" />
          </div>
          <div className="overflow-y-auto flex-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-start gap-3 p-3 rounded-md cursor-pointer hover:bg-muted ${
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
                    <h4 className="font-medium truncate">{conversation.name}</h4>
                    <span className="text-xs text-muted-foreground">{conversation.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conversation.role}</p>
                  <p className="text-sm truncate">{conversation.lastMessage}</p>
                </div>
                {conversation.unread && <Badge className="ml-auto bg-primary h-2 w-2 rounded-full p-0" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversation active */}
      <Card className="md:w-2/3 flex flex-col">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" alt="Sophie Dupont" />
                <AvatarFallback>SD</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">Sophie Dupont</h4>
                <p className="text-xs text-muted-foreground">Enseignante - Mathématiques</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
              <span className="sr-only">Options</span>
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start gap-3 ${message.isMe ? "flex-row-reverse" : ""}`}>
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.sender} />
                  <AvatarFallback>{message.initials}</AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-70 text-right">{message.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Paperclip className="h-4 w-4" />
                <span className="sr-only">Joindre un fichier</span>
              </Button>
              <Input placeholder="Écrivez votre message..." className="flex-1" />
              <Button size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">Envoyer</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
