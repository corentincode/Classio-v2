import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { MessagesInterface } from "@/components/eleve/messages-interface"

export const metadata: Metadata = {
  title: "Classio - Messagerie",
  description: "Communiquez avec vos enseignants et camarades",
}

export default function MessagesPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Messagerie</h1>
      </div>

      <Card className="flex-1">
        <CardContent className="p-0">
          <MessagesInterface />
        </CardContent>
      </Card>
    </div>
  )
}
