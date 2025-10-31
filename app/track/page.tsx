"use client"

import { useState, useEffect } from "react"
import { trackOrder } from "@/app/actions/orders"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"

const statusLabels: Record<string, string> = {
  pending_payment: "En attente de paiement",
  payment_received: "Paiement reçu",
  preparing: "Commande en préparation",
  shipped: "Colis envoyé",
  delivered: "Colis livré / reçu",
}

export default function TrackPage() {
  // Ajout : lecture des query params pour pré-remplir
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const orderParam = params.get("order") || ""
    const emailParam = params.get("email") || ""
    setOrderNumber(orderParam)
    setEmail(emailParam)
  }, [])

  const [orderNumber, setOrderNumber] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<any>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOrder(null)
    const result = await trackOrder(orderNumber, email)
    setLoading(false)
    if (result.success) {
      setOrder(result.order)
    } else {
      setError(result.error || "Commande introuvable.")
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Retour à l'accueil
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Suivre ma commande</CardTitle>
            <CardDescription>Entrez votre numéro de commande et votre email pour suivre votre commande</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="orderNumber">Numéro de commande</Label>
                <Input
                  id="orderNumber"
                  value={orderNumber}
                  onChange={e => setOrderNumber(e.target.value)}
                  placeholder="Ex: CMD2024-00001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Suivre ma commande
              </Button>
            </form>
          </CardContent>
        </Card>
        {order && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Commande {order.order_number}</CardTitle>
              <CardDescription>
                Statut :{" "}
                <Badge>
                  {statusLabels[order.status] || order.status}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Nom :</span> {order.customer_name}
                </div>
                <div>
                  <span className="font-semibold">Email :</span> {order.customer_email}
                </div>
                <div>
                  <span className="font-semibold">Adresse :</span> {order.shipping_address}, {order.shipping_postal_code} {order.shipping_city}, {order.shipping_country}
                </div>
                <div>
                  <span className="font-semibold">Montant total :</span> {order.total_amount} €
                </div>
                {order.tracking_number && (
                  <div>
                    <span className="font-semibold">Numéro de suivi :</span> {order.tracking_number}
                  </div>
                )}
                {order.admin_notes && (
                  <Alert className="mt-2">
                    <AlertDescription>{order.admin_notes}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
