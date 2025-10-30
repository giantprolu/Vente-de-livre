"use client";

import type React from "react";
import { useState } from "react";
import { submitOrder } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrderPageClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const bookPrice = 25;
  const [quantity, setQuantity] = useState(1);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await submitOrder(formData);

    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      setOrderDetails(result.order);
      // Redirect to payment instructions after 2 seconds
      setTimeout(() => {
        if (result.order) {
          router.push(`/payment?order=${result.order.orderNumber}&email=${result.order.email}`);
        }
      }, 2000);
    } else {
      setError(result.error || "Une erreur est survenue");
    }
  }

  if (success && orderDetails) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <CardTitle className="text-green-900">Commande confirmée !</CardTitle>
              </div>
              <CardDescription className="text-green-700">
                Votre commande a été enregistrée avec succès.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-green-700">Numéro de commande</p>
                <p className="text-lg font-semibold text-green-900">{orderDetails.orderNumber}</p>
              </div>
              <p className="text-sm text-green-700">
                Un email de confirmation a été envoyé à <strong>{orderDetails.email}</strong> avec les instructions de
                paiement.
              </p>
              <p className="text-sm text-green-700">Redirection vers les instructions de paiement...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Retour à l'accueil
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Formulaire de commande</CardTitle>
                <CardDescription>Remplissez vos informations pour commander le livre</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Informations personnelles</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input id="firstName" name="firstName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input id="lastName" name="lastName" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Adresse de livraison</h3>
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse *</Label>
                      <Input id="address" name="address" required />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville *</Label>
                        <Input id="city" name="city" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Code postal *</Label>
                        <Input id="postalCode" name="postalCode" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Pays *</Label>
                      <Input id="country" name="country" defaultValue="France" required />
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantité *</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      max="10"
                      defaultValue="1"
                      onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Méthode de paiement *</h3>
                    <RadioGroup name="paymentMethod" defaultValue="bank_transfer" required>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                        <Label htmlFor="bank_transfer" className="cursor-pointer">
                          Virement bancaire (IBAN)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paylib" id="paylib" />
                        <Label htmlFor="paylib" className="cursor-pointer">
                          Paylib
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lydia" id="lydia" />
                        <Label htmlFor="lydia" className="cursor-pointer">
                          Lydia
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="revolut" id="revolut" />
                        <Label htmlFor="revolut" className="cursor-pointer">
                          Revolut
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="cursor-pointer">
                          PayPal (frais de 3% appliqués)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message (optionnel)</Label>
                    <Textarea id="message" name="message" placeholder="Ajoutez un message si vous le souhaitez..." />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Traitement en cours...
                      </>
                    ) : (
                      "Confirmer la commande"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prix unitaire</span>
                  <span className="font-semibold">{bookPrice}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantité</span>
                  <span className="font-semibold">{quantity}</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-lg">{bookPrice * quantity}€</span>
                </div>
                <p className="text-xs text-muted-foreground">Frais de port inclus pour la France métropolitaine</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}