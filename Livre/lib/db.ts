import { createServerClient } from "@supabase/ssr"

// Déplace tous les imports et usages de 'next/headers' dans les fonctions server-only
let cookiesImport: typeof import("next/headers") | undefined

function getCookiesModule() {
  if (!cookiesImport) {
    // @ts-ignore
    cookiesImport = require("next/headers")
  }
  return cookiesImport
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  shipping_address: string
  shipping_city: string
  shipping_postal_code: string
  shipping_country: string
  payment_method: "virement" | "paylib" | "lydia" | "revolut" | "paypal" | "autre"
  status: "pending_payment" | "payment_received" | "preparing" | "shipped" | "delivered"
  tracking_number?: string 
  carrier?: string
  admin_notes?: string
  total_amount: number
  created_at: string
  updated_at: string
}

export interface OrderCreateData {
  first_name: string
  last_name: string
  email: string
  phone?: string
  address: string
  city: string
  postal_code: string
  country: string
  quantity: number
  message?: string
  payment_method: "virement" | "paylib" | "lydia" | "revolut" | "paypal" | "autre"
}

// Create Supabase client for server-side operations
function createClient() {
  const { cookies } = getCookiesModule()
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      async getAll() {
        const { cookies } = getCookiesModule()
        const store = await cookies()
        return store.getAll()
      },
      async setAll(cookiesToSet) {
        const { cookies } = getCookiesModule()
        const store = await cookies()
        try {
          cookiesToSet.forEach(({ name, value, options }) => store.set(name, value, options))
        } catch {
          // ignore
        }
      },
    },
  })
}

// Get all orders
export async function getOrders(): Promise<Order[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    return []
  }

  return data || []
}

export const getAllOrders = getOrders

// Generate unique order number
export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const orders = await getOrders()
  const orderCount = orders.length + 1
  return `CMD${year}-${String(orderCount).padStart(5, "0")}`
}

export async function createOrder(orderData: OrderCreateData): Promise<Order | null> {
  const supabase = createClient()
  const orderNumber = await generateOrderNumber()

  // Get book price
  const { data: book } = await supabase.from("books").select("price").single()
  const bookPrice = book?.price || 20
  const totalAmount = bookPrice * orderData.quantity

  const newOrder = {
    order_number: orderNumber,
    customer_name: `${orderData.first_name} ${orderData.last_name}`,
    customer_email: orderData.email,
    customer_phone: orderData.phone,
    shipping_address: orderData.address,
    shipping_city: orderData.city,
    shipping_postal_code: orderData.postal_code,
    shipping_country: orderData.country,
    payment_method: orderData.payment_method,
    admin_notes: orderData.message,
    total_amount: totalAmount,
    status: "pending_payment" as const,
  }

  const { data, error } = await supabase.from("orders").insert(newOrder).select().single()

  if (error) {
    console.error("Error creating order:", error)
    return null
  }

  if (data) {
    const { data: bookData } = await supabase.from("books").select("id, price").single()
    if (bookData) {
      await supabase.from("order_items").insert({
        order_id: data.id,
        book_id: bookData.id,
        quantity: orderData.quantity,
        unit_price: bookData.price,
      })
    }
  }

  return data
}

export async function getOrderByNumberAndEmail(orderNumber: string, email: string): Promise<Order | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .ilike("customer_email", email)
    .single()

  if (error) {
    console.error("Error fetching order:", error)
    return null
  }

  return data
}

// Update order
export async function updateOrder(orderNumber: string, updates: Partial<Order>): Promise<Order | null> {
  const supabase = createClient()
  const orderNumberTrimmed = orderNumber.trim()

  // Log pour debug SQL direct
  console.log("[updateOrder] Tentative SQL directe : select * from orders where order_number = ?", orderNumberTrimmed);

  // Vérifie si la commande existe avant d'updater (ajoute un log du résultat)
  const { data: checkData, error: checkError } = await supabase
    .from("orders")
    .select("id, order_number")
    .eq("order_number", orderNumberTrimmed)

  console.log("[updateOrder] Résultat du check existence:", checkData, "Erreur:", checkError)

  if (checkError) {
    console.error("[updateOrder] Erreur lors du check existence:", checkError)
    return null
  }
  if (!checkData || checkData.length === 0) {
    const { data: allOrders } = await supabase.from("orders").select("order_number")
    console.warn("[updateOrder] Tous les order_number en base:", allOrders)
    console.warn("[updateOrder] Aucune commande trouvée pour order_number:", orderNumberTrimmed)
    return null
  }

  // Correction : utilise l'id pour l'update (clé primaire), pas order_number
  const orderId = checkData[0].id

  // Correction : updated_at doit être casté explicitement en type string (hors Partial<Order>)
  const updatePayload: Partial<Order> = {}
  Object.keys(updates).forEach((key) => {
    const typedKey = key as keyof Order
    const value = updates[typedKey]
    if (value !== undefined) {
      updatePayload[typedKey] = value
    }
  });
  // Ajoute updated_at hors du typage strict de Partial<Order>
  (updatePayload as Record<string, unknown>)["updated_at"] = new Date().toISOString()

  console.log("[updateOrder] updatePayload:", updatePayload, "orderId:", orderId)

  // Correction : retire .select() pour l'update (RLS/policy peut empêcher le retour de la ligne)
  const { error } = await supabase
    .from("orders")
    .update(updatePayload)
    .eq("id", orderId)

  if (error) {
    console.error("[updateOrder] Error updating order:", error)
    return null
  }

  // Recharge la commande à jour pour obtenir le vrai status et tous les champs
  const { data: updatedOrder, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle()

  if (fetchError) {
    console.error("[updateOrder] Error fetching updated order:", fetchError)
    return null
  }

  // Ajoute un log pour vérifier la valeur réelle du statut après update
  console.log("[updateOrder] Commande après update:", updatedOrder)

  return updatedOrder
}

// Get cookies
export async function getCookies() {
  const { cookies } = getCookiesModule()
  const cookieStore = await cookies()
  const allCookies: Record<string, string> = {}
  for (const cookie of cookieStore.getAll()) {
    allCookies[cookie.name] = cookie.value
  }
  return allCookies
}

export async function getCookie(name: string) {
  const { cookies } = getCookiesModule()
  const cookieStore = await cookies()
  const cookie = cookieStore.get(name)
  return cookie?.value
}

export async function isAdminAuthenticated() {
  const { cookies } = getCookiesModule()
  const cookieStore = await cookies()
  return cookieStore.get("admin_authenticated")?.value === "true"
}

export async function getAllCookies() {
  const { cookies } = getCookiesModule()
  const cookieStore = await cookies()
  return cookieStore.getAll()
}

// Supprime toute utilisation directe de cookieStore.getAll() sans await cookies()

// Pour récupérer la quantité d'une commande, ajoute une fonction utilitaire :
export async function getOrderQuantity(orderId: string): Promise<number> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("order_items")
    .select("quantity")
    .eq("order_id", orderId)
    .maybeSingle()
  if (error || !data) return 1
  return data.quantity || 1
}
