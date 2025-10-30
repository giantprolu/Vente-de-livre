"use server"

import { createOrder, getOrderByNumberAndEmail, updateOrder, getOrders, type OrderCreateData } from "@/lib/db"
import { sendEmail, generateOrderConfirmationEmail } from "@/lib/email"
import { getPaymentInstructions } from "@/lib/payment-instructions"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

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

    console.log("[submitOrder] orderData:", orderData)

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
      console.log("[submitOrder] Champs manquants", orderData)
      return { success: false, error: "Tous les champs obligatoires doivent être remplis." }
    }

    // Create order
    const order = await createOrder(orderData)
    console.log("[submitOrder] order créé:", order)

    if (!order) {
      return { success: false, error: "Erreur lors de la création de la commande." }
    }

    // Get payment instructions
    const paymentInstructions = getPaymentInstructions(order.payment_method, order.order_number)
    console.log("[submitOrder] paymentInstructions:", paymentInstructions)

    const emailHtml = generateOrderConfirmationEmail(
      {
        orderNumber: order.order_number,
        firstName: orderData.first_name,
        lastName: orderData.last_name,
        email: order.customer_email,
        quantity: orderData.quantity,
        paymentMethod: order.payment_method,
      },
      paymentInstructions,
    )
    console.log("[submitOrder] emailHtml:", emailHtml)

    const emailResult = await sendEmail({
      to: order.customer_email,
      subject: `Confirmation de commande ${order.order_number}`,
      html: emailHtml,
    })
    console.log("[submitOrder] sendEmail result:", emailResult)

    return {
      success: true,
      order: {
        orderNumber: order.order_number,
        email: order.customer_email,
        paymentMethod: order.payment_method,
      },
    }
  } catch (error) {
    console.error("Error creating order:", error)
    return { success: false, error: "Une erreur est survenue lors de la création de la commande." }
  }
}

export async function trackOrder(orderNumber: string, email: string) {
  try {
    console.log("[trackOrder] Recherche orderNumber:", orderNumber, "email:", email)
    const order = await getOrderByNumberAndEmail(orderNumber, email)
    console.log("[trackOrder] Résultat:", order)

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
  console.log("[adminLogin] Tentative de login avec password:", password)
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

  if (password === adminPassword) {
    const cookieStore = await cookies()
    cookieStore.set("admin_authenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    })
    console.log("[adminLogin] Authentification réussie")
    return { success: true }
  }

  console.log("[adminLogin] Mot de passe incorrect")
  return { success: false, error: "Mot de passe incorrect." }
}

export async function adminLogout() {
  console.log("[adminLogout] Déconnexion admin")
  const cookieStore = await cookies()
  cookieStore.delete("admin_authenticated")
  revalidatePath("/admin")
}

export async function getAllOrders() {
  try {
    const orders = await getOrders()
    console.log("[getAllOrders] Nb commandes:", orders.length)
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
    console.log("[updateOrderStatus] orderNumber:", orderNumber, "status:", status, "trackingNumber:", trackingNumber, "trackingCarrier:", trackingCarrier, "customMessage:", customMessage)
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

    console.log("[updateOrderStatus] updates envoyés à updateOrder:", updates)
    const order = await updateOrder(orderNumber, updates)
    console.log("[updateOrderStatus] Résultat updateOrder:", order)

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
