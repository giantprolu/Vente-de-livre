"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Ajout ici
} from "@/components/ui/dialog"
import { updateOrderStatus, adminLogout } from "@/app/actions/orders"
import { Package, Mail, Phone, MapPin, Calendar, CreditCard, LogOut, Edit } from "lucide-react"
import type { Order } from "@/lib/db"

interface AdminDashboardProps {
  orders: Order[]
}

// Les statuts techniques doivent être utilisés pour la logique
const statusLabels: Record<string, string> = {
  pending_payment: "En attente de paiement",
  payment_received: "Paiement reçu",
  preparing: "Commande en préparation",
  shipped: "Colis envoyé",
  delivered: "Colis livré / reçu",
}

const statusColors: Record<string, string> = {
  pending_payment: "bg-yellow-500",
  payment_received: "bg-blue-500",
  preparing: "bg-purple-500",
  shipped: "bg-orange-500",
  delivered: "bg-green-500",
}

const paymentMethodLabels: Record<string, string> = {
  bank_transfer: "Virement bancaire",
  paylib: "Paylib",
  lydia: "Lydia",
  revolut: "Revolut",
  paypal: "PayPal",
}

export default function AdminDashboard({ orders }: AdminDashboardProps) {
  const router = useRouter()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [carrier, setCarrier] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    await adminLogout()
    router.push("/admin/login")
    router.refresh()
  }

  // Remplace useState par useRef pour le bouton de fermeture
  const closeRef = useRef<HTMLButtonElement>(null)

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return

    setLoading(true)
    try {
      await updateOrderStatus(
        selectedOrder.order_number,
        newStatus,
        newStatus === "shipped" ? trackingNumber : undefined,
        newStatus === "shipped" ? carrier : undefined,
        customMessage || undefined,
      )

      setSelectedOrder(null)
      setNewStatus("")
      setTrackingNumber("")
      setCarrier("")
      setCustomMessage("")
      // Ferme la popup après mise à jour
      closeRef.current?.click()
      router.refresh()
    } catch (error) {
      console.error("Error updating order:", error)
    } finally {
      setLoading(false)
    }
  }

  // Correction : filtre sur les statuts techniques, pas sur les labels français
  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending_payment").length,
    paid: orders.filter((o) => o.status === "payment_received").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Panneau d'administration</h1>
            <p className="text-sm text-muted-foreground">Gestion des commandes</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total</CardDescription>
              <CardTitle className="text-3xl">{orderStats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>En attente</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">{orderStats.pending}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Payées</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{orderStats.paid}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>En préparation</CardDescription>
              <CardTitle className="text-3xl text-purple-600">{orderStats.preparing}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Expédiées</CardDescription>
              <CardTitle className="text-3xl text-orange-600">{orderStats.shipped}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Livrées</CardDescription>
              <CardTitle className="text-3xl text-green-600">{orderStats.delivered}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Commandes ({orders.length})</h2>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucune commande pour le moment
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">Commande #{order.order_number}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order)
                              setNewStatus(order.status)
                              setTrackingNumber(order.tracking_number || "")
                              setCarrier(order.carrier || "")
                              setCustomMessage(order.admin_notes || "")
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Modifier la commande #{order.order_number}</DialogTitle>
                            <DialogDescription>Mettez à jour le statut et ajoutez des informations</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Statut</Label>
                              <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending_payment">En attente de paiement</SelectItem>
                                  <SelectItem value="payment_received">Paiement reçu</SelectItem>
                                  <SelectItem value="preparing">Commande en préparation</SelectItem>
                                  <SelectItem value="shipped">Colis envoyé</SelectItem>
                                  <SelectItem value="delivered">Colis livré / reçu</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {newStatus === "shipped" && (
                              <>
                                <div className="space-y-2">
                                  <Label>Transporteur</Label>
                                  <Select value={carrier} onValueChange={setCarrier}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionner un transporteur" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="la_poste">La Poste</SelectItem>
                                      <SelectItem value="colissimo">Colissimo</SelectItem>
                                      <SelectItem value="chronopost">Chronopost</SelectItem>
                                      <SelectItem value="dpd">DPD</SelectItem>
                                      <SelectItem value="ups">UPS</SelectItem>
                                      <SelectItem value="fedex">FedEx</SelectItem>
                                      <SelectItem value="autre">Autre</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Numéro de suivi</Label>
                                  <Input
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    placeholder="Ex: 1234567890"
                                  />
                                </div>
                              </>
                            )}

                            <div className="space-y-2">
                              <Label>Message personnalisé (optionnel)</Label>
                              <Textarea
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                placeholder="Ajoutez une note pour le client..."
                                rows={3}
                              />
                            </div>

                            <Button onClick={handleUpdateStatus} disabled={loading} className="w-full">
                              {loading ? "Mise à jour..." : "Mettre à jour"}
                            </Button>
                            {/* Ajoute ce bouton caché pour fermer la popup */}
                            <DialogClose asChild>
                              <button ref={closeRef} style={{ display: "none" }} aria-hidden="true" tabIndex={-1}></button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm text-muted-foreground">Informations client</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{order.customer_name}</p>
                            <p className="text-muted-foreground">{order.customer_email}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div>
                            <p>{order.shipping_address}</p>
                            <p>
                              {order.shipping_postal_code} {order.shipping_city}
                            </p>
                            <p>{order.shipping_country}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm text-muted-foreground">Détails de la commande</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          {/* Correction : affiche "1 livre(s)" ou une valeur par défaut */}
                          <span>1 livre(s)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span>{paymentMethodLabels[order.payment_method]}</span>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="font-semibold">Total: {order.total_amount.toFixed(2)} €</p>
                        </div>
                        {order.tracking_number && (
                          <div className="pt-2 border-t">
                            <p className="text-muted-foreground">Transporteur: {order.carrier}</p>
                            <p className="font-mono">{order.tracking_number}</p>
                          </div>
                        )}
                        {order.admin_notes && (
                          <div className="pt-2 border-t">
                            <p className="text-muted-foreground">Note admin:</p>
                            <p className="italic">{order.admin_notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
