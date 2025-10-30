import { notFound } from "next/navigation"
import { getOrderByNumberAndEmail } from "@/lib/db"
import { getPaymentInstructions } from "@/lib/payment-instructions"

export default async function PaymentServer({ orderNumber, email }: { orderNumber: string, email: string }) {
  if (!orderNumber || !email) return notFound()
  const order = await getOrderByNumberAndEmail(orderNumber, email)
  if (!order) return notFound()
  const paymentInstructions = getPaymentInstructions(order.payment_method, order.order_number)

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Instructions de paiement</h1>
      <div className="mb-6">
        <div className="font-semibold">Numéro de commande :</div>
        <div className="mb-2">{order.order_number}</div>
        <div className="font-semibold">Montant total :</div>
        <div className="mb-2">{order.total_amount} €</div>
        <div className="font-semibold">Statut :</div>
        <div className="mb-2">{order.status}</div>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Instructions de paiement</h2>
        <div dangerouslySetInnerHTML={{ __html: paymentInstructions }} />
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Adresse de livraison</h2>
        <div>{order.shipping_address}</div>
        <div>{order.shipping_postal_code} {order.shipping_city}</div>
        <div>{order.shipping_country}</div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Suivi de commande</h2>
        <p>Vous pouvez revenir sur cette page à tout moment pour suivre l'état de votre commande.</p>
      </div>
    </main>
  )
}
