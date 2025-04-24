import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Receipt, AlertCircle } from "lucide-react"

// Données fictives pour l'historique des paiements
const payments = [
  {
    id: 1,
    description: "Cantine - Mai 2025",
    amount: "85,50 €",
    date: "28 avril 2025",
    status: "paid",
    method: "Prélèvement automatique",
  },
  {
    id: 2,
    description: "Sortie scolaire - Musée",
    amount: "12,00 €",
    date: "15 avril 2025",
    status: "paid",
    method: "Carte bancaire",
  },
  {
    id: 3,
    description: "Cantine - Avril 2025",
    amount: "85,50 €",
    date: "28 mars 2025",
    status: "paid",
    method: "Prélèvement automatique",
  },
  {
    id: 4,
    description: "Voyage scolaire - Acompte",
    amount: "150,00 €",
    date: "15 mars 2025",
    status: "pending",
    method: "En attente",
    dueDate: "15 mai 2025",
  },
]

export function PaymentHistory() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Historique des paiements</CardTitle>
        <CardDescription>Suivi des paiements et factures</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-start gap-3 py-2 border-b last:border-0">
              {payment.status === "paid" ? (
                <Receipt className="h-5 w-5 text-green-500 mt-0.5" />
              ) : payment.status === "pending" ? (
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              ) : (
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{payment.description}</h4>
                    <p className="text-xs text-muted-foreground">{payment.date}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-medium">{payment.amount}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs mt-1 ${
                        payment.status === "paid"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : payment.status === "pending"
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                            : ""
                      }`}
                    >
                      {payment.status === "paid" ? "Payé" : "En attente"}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm mt-1">
                  {payment.method}
                  {payment.dueDate && ` - Échéance: ${payment.dueDate}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
