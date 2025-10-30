"use server"

import { createOrder, getOrderByNumberAndEmail, updateOrder, getOrders, type OrderCreateData } from "@/lib/db"
import { sendEmail, generateOrderConfirmationEmail } from "@/lib/email"
import { getPaymentInstructions } from "@/lib/payment-instructions"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { randomUUID } from "crypto"

export async function submitOrder(formData: FormData) {
  try {
    const orderData: OrderCreateData = {
      first_name: formData.get("firstName") as string,
      last_name: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      postal_code: formData.get("postalCode") as string,
      country: formData.get("country") as string,
      quantity: Number.parseInt(formData.get("quantity") as string),
      message: (formData.get("message") as string) || undefined,
      payment_method: formData.get("paymentMethod") as any,
    }

    // Validate required fields
    if (
      !orderData.first_name ||
      !orderData.last_name ||
      !orderData.email ||
      !orderData.address ||
      !orderData.city ||
      !orderData.postal_code ||
      !orderData.country ||
      !orderData.quantity ||
      !orderData.payment_method
    ) {
      return { success: false, error: "Tous les champs obligatoires doivent être remplis." }
    }

    // Génère un token unique pour le suivi
    const tracking_token = randomUUID()
    // Ajoute le token à l'objet orderData (et à la BDD)
    ;(orderData as any).tracking_token = tracking_token

    // Create order
    const order = await createOrder(orderData)

    if (!order) {
      return { success: false, error: "Erreur lors de la création de la commande." }
    }

    // Get payment instructions
    const paymentInstructions = getPaymentInstructions(orderData.payment_method, order.order_number)

    const emailHtml = generateOrderConfirmationEmail(
      {
        orderNumber: order.order_number,
        firstName: orderData.first_name,
        lastName: orderData.last_name,
        email: order.customer_email,
        quantity: orderData.quantity,
        paymentMethod: order.payment_method,
        // Ajout du lien de suivi sécurisé :
        tracking_token: tracking_token,
        // Ajout des champs d'adresse pour l'email :
        shipping_address: order.shipping_address,
        shipping_postal_code: order.shipping_postal_code,
        shipping_city: order.shipping_city,
        shipping_country: order.shipping_country,
      },
      paymentInstructions,
    )

    const emailResult = await sendEmail({
      to: order.customer_email,
      subject: `Confirmation de commande ${order.order_number}`,
      html: emailHtml,
    })

    return {
      success: true,
      order: {
        trackingToken: tracking_token,
        paymentMethod: order.payment_method,
        orderNumber: order.order_number, // Ajouté pour l'affichage
        email: order.customer_email,     // Ajouté pour l'affichage
      },
    }
  } catch (error) {
    console.error("Error creating order:", error)
    return { success: false, error: "Une erreur est survenue lors de la création de la commande." }
  }
}

export async function trackOrder(orderNumber: string, email: string) {
  try {
    const order = await getOrderByNumberAndEmail(orderNumber, email)

    if (!order) {
      return { success: false, error: "Commande introuvable. Vérifiez le numéro de commande et l'email." }
    }

    return { success: true, order }
  } catch (error) {
    console.error("Error tracking order:", error)
    return { success: false, error: "Une erreur est survenue lors de la recherche de la commande." }
  }
}

export async function adminLogin(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

  if (password === adminPassword) {
    const cookieStore = await cookies()
    cookieStore.set("admin_authenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    })
    return { success: true }
  }

  return { success: false, error: "Mot de passe incorrect." }
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_authenticated")
  revalidatePath("/admin")
}

export async function getAllOrders() {
  try {
    const orders = await getOrders()
    return { success: true, orders }
  } catch (error) {
    console.error("Error getting orders:", error)
    return { success: false, error: "Erreur lors de la récupération des commandes." }
  }
}

export async function updateOrderStatus(
  orderNumber: string,
  status: string,
  trackingNumber?: string,
  trackingCarrier?: string,
  customMessage?: string,
) {
  try {
    const validStatuses = [
      "pending_payment",
      "payment_received",
      "preparing",
      "shipped",
      "delivered",
    ]
    const statusMap: Record<string, string> = {
      "En attente de paiement": "pending_payment",
      "Paiement reçu": "payment_received",
      "Commande en préparation": "preparing",
      "Colis envoyé": "shipped",
      "Colis livré / reçu": "delivered",
    }
    let statusToSave = status
    if (!validStatuses.includes(status)) {
      statusToSave = statusMap[status] || "pending_payment"
    }

    const updates: any = { status: statusToSave }
    if (trackingNumber) updates.tracking_number = trackingNumber
    if (trackingCarrier) updates.carrier = trackingCarrier
    if (customMessage) updates.admin_notes = customMessage

    const order = await updateOrder(orderNumber, updates)

    if (!order) {
      return { success: false, error: "Commande introuvable." }
    }

    revalidatePath("/track")
    revalidatePath(`/track?order=${orderNumber}`)
    revalidatePath("/admin")
    return { success: true, order }
  } catch (error) {
    console.error("Error updating order:", error)
    return { success: false, error: "Erreur lors de la mise à jour de la commande." }
  }
}

// Ajoute une nouvelle fonction pour récupérer la commande par token
export async function getOrderByTrackingToken(token: string) {
  try {
    // Utilise la fonction de la DB sans collision de nom
    const db = await import("@/lib/db")
    // Correction : vérifie que la fonction existe et retourne bien une promesse
    if (typeof db.getOrderByTrackingToken !== "function") {
      return { success: false, error: "Fonction getOrderByTrackingToken non trouvée dans la DB." }
    }
    const orderResult = await db.getOrderByTrackingToken(token)
    if (orderResult == null) {
      return { success: false, error: "Commande introuvable." }
    }
    return { success: true, order: orderResult }
  } catch (error) {
    return { success: false, error: "Erreur lors de la recherche de la commande." }
  }
}
