"use client"

import { Badge } from "@/components/ui/badge"

export function Announcements() {
  // Données fictives pour les annonces
  const announcements = [
    {
      id: 1,
      title: "Sortie scolaire au musée",
      content:
        "Une sortie au musée d'histoire naturelle est prévue le 20 mai. N'oubliez pas de rapporter l'autorisation parentale signée avant le 15 mai.",
      date: "08/05/2023",
      author: "Mme Moreau, CPE",
      type: "event",
    },
    {
      id: 2,
      title: "Fermeture exceptionnelle du CDI",
      content:
        "Le CDI sera fermé le jeudi 12 mai en raison d'un inventaire. Nous nous excusons pour la gêne occasionnée.",
      date: "05/05/2023",
      author: "M. Petit, Documentaliste",
      type: "info",
    },
    {
      id: 3,
      title: "Conseil de classe du 3ème trimestre",
      content:
        "Les conseils de classe du 3ème trimestre auront lieu du 15 au 19 juin. Le planning détaillé sera communiqué ultérieurement.",
      date: "03/05/2023",
      author: "Direction",
      type: "important",
    },
  ]

  return (
    <div className="space-y-4 bg-white rounded-lg border border-gray-100 shadow-sm p-4">
      {announcements.map((announcement) => (
        <div key={announcement.id} className="border-b pb-4 last:border-0 last:pb-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{announcement.title}</h3>
            <Badge
              className={
                announcement.type === "important"
                  ? "bg-red-100 text-red-800 hover:bg-red-100 border-0"
                  : announcement.type === "event"
                    ? "bg-green-100 text-green-800 hover:bg-green-100 border-0"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-100 border-0"
              }
            >
              {announcement.type === "important" && "Important"}
              {announcement.type === "event" && "Événement"}
              {announcement.type === "info" && "Information"}
            </Badge>
          </div>
          <p className="mt-2 text-sm">{announcement.content}</p>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <div>{announcement.author}</div>
            <div>{announcement.date}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
