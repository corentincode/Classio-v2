import type { Metadata } from "next"
import { MessagesInterface } from "@/components/parent/messages-interface"

export const metadata: Metadata = {
  title: "Messages | Espace Parent",
  description: "Communications avec l'établissement et les enseignants",
}

export default function MessagesPage() {
  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
        </div>

        <MessagesInterface />
      </div>
    </div>
  )
}
