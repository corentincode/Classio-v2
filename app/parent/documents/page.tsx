import type { Metadata } from "next"
import { DocumentsList } from "@/components/parent/documents-list"

export const metadata: Metadata = {
  title: "Documents | Espace Parent",
  description: "Documents administratifs et scolaires",
}

export default function DocumentsPage() {
  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
        </div>

        <DocumentsList />
      </div>
    </div>
  )
}
