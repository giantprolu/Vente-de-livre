"use client"

import { useState, useEffect } from "react"
import { trackOrder } from "@/app/actions/orders"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, Package, Truck, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"

// Ajout des configs pour timeline et labels
const statusConfig = {
  pending_payment: {
    label: "En attente de paiement",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  payment_received: {
    label: "Paiement reçu",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-800 border-green-200",
  },
  preparing: {
    label: "Commande en préparation",
    icon: Package,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  shipped: {
    label: "Colis envoyé",
    icon: Truck,
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  delivered: {
    label: "Colis livré / reçu",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-800 border-green-200",
  },
}

const paymentMethodLabels: Record<string, string> = {
  bank_transfer: "Virement bancaire",
  virement: "Virement bancaire",
  paylib: "Paylib",
  lydia: "Lydia",
  lidya: "Lydia",
  revolut: "Revolut",
  paypal: "PayPal",
  autre: "Autre",
}

// Fonction utilitaire pour générer le lien de suivi selon le transporteur
function getTrackingUrl(carrier: string | undefined, trackingNumber: string | undefined): string | null {
  if (!carrier || !trackingNumber) return null
  const num = encodeURIComponent(trackingNumber.trim())
  switch (carrier.toLowerCase()) {
    case "colissimo":
      return `https://www.laposte.fr/outils/suivre-vos-envois?code=${num}`
    case "chronopost":
      return `https://www.chronopost.fr/fr/suivi-colis?listeNumerosLT=${num}`
    case "dpd":
      return `https://www.dpd.fr/trace/`
    case "ups":
      return `https://www.ups.com/track?loc=fr_FR&tracknum=${num}`
    case "fedex":
      return `https://www.fedex.com/fedextrack/?trknbr=${num}`
    case "la_poste":
      return `https://www.laposte.fr/outils/suivre-vos-envois?code=${num}`
    default:
      return null
  }
}

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<any>(null)

  // Pré-remplissage depuis l'URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const orderParam = params.get("order") || ""
    const emailParam = params.get("email") || ""
    setOrderNumber(orderParam)
    setEmail(emailParam)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOrder(null)
    // Récupère aussi la quantité depuis la réponse
    const result = await trackOrder(orderNumber, email)
    setLoading(false)
    if (result.success) {
      setOrder({ ...result.order, _quantity: result.quantity })
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Commande {order.order_number}</CardTitle>
                  <CardDescription>
                    Commandée le {new Date(order.created_at).toLocaleDateString("fr-FR")}
                  </CardDescription>
                </div>
                <Badge
                  className={
                    statusConfig[order.status as keyof typeof statusConfig]?.color ||
                    "bg-gray-200 text-gray-800 border-gray-300"
                  }
                  variant="outline"
                >
                  {/* Illustration principale du statut actif */}
                  {(() => {
                    const Icon = statusConfig[order.status as keyof typeof statusConfig]?.icon
                    return Icon ? <Icon className="h-6 w-6" /> : null
                  })()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Statut de la commande sous forme d'illustrations pleine largeur + label */}
              <div className="space-y-4">
                <h3 className="font-semibold">Statut de la commande</h3>
                <div className="flex w-full gap-2 justify-between">
                  {Object.entries(statusConfig).map(([key, config]) => {
                    const isActive = key === order.status
                    const isPast =
                      Object.keys(statusConfig).indexOf(key) < Object.keys(statusConfig).indexOf(order.status)
                    return (
                      <div key={key} className="flex flex-col items-center flex-1 min-w-0">
                        <Badge
                          className={`
                            flex items-center justify-center px-0 py-0 w-14 h-14
                            ${isActive
                              ? "border-2 border-black bg-white"
                              : isPast
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-400"}
                          `}
                          variant="outline"
                        >
                          <config.icon className="h-7 w-7" />
                        </Badge>
                        <span
                          className={`
                            mt-2 text-xs text-center leading-tight
                            ${isActive
                              ? "font-bold text-black"
                              : isPast
                              ? "text-green-700"
                              : "text-gray-400"}
                          `}
                          style={{
                            maxWidth: 80,
                            minHeight: 32,
                            wordBreak: "break-word",
                            display: "block",
                          }}
                          title={config.label}
                        >
                          {config.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Tracking Information */}
              {order.tracking_number && (
                <div className="space-y-2 border-t pt-4">
                  <h3 className="font-semibold">Informations de suivi</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Transporteur</p>
                    <p className="font-medium">{order.carrier || "Non spécifié"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Numéro de suivi</p>
                    <p className="font-mono text-sm">{order.tracking_number}</p>
                    {/* Ajout du lien de suivi */}
                    {getTrackingUrl(order.carrier, order.tracking_number) && (
                      <a
                        href={getTrackingUrl(order.carrier, order.tracking_number) as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-1 text-sm text-blue-600 underline hover:text-blue-800"
                      >
                        Suivre le colis sur le site du transporteur
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Custom Message */}
              {order.admin_notes && (
                <Alert>
                  <AlertDescription>{order.admin_notes}</AlertDescription>
                </Alert>
              )}

              {/* Order Details */}
              <div className="space-y-2 border-t pt-4">
                <h3 className="font-semibold">Détails de la commande</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantité</span>
                    <span>{order._quantity ?? "..."} livre(s)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Méthode de paiement</span>
                    <span>
                      {paymentMethodLabels[order.payment_method] || order.payment_method}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-2 border-t pt-4">
                <h3 className="font-semibold">Adresse de livraison</h3>
                <div className="text-sm space-y-1">
                  <p>{order.customer_name}</p>
                  <p>{order.shipping_address}</p>
                  <p>
                    {order.shipping_postal_code} {order.shipping_city}
                  </p>
                  <p>{order.shipping_country}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
