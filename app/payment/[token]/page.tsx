import { notFound } from "next/navigation"
import PaymentDetailsClient from "../PaymentDetailsClient"
import { getOrderByTrackingToken } from "@/app/actions/orders"

function NextSteps() {
  return (
    <section className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="font-semibold mb-2 text-blue-900">Que se passe-t-il ensuite ?</div>
      <ol className="list-decimal list-inside text-sm text-blue-900 space-y-1">
        <li>Effectuez le paiement selon les instructions ci-dessus</li>
        <li>Nous vérifions la réception du paiement (1-2 jours ouvrés)</li>
        <li>Votre commande est préparée et expédiée</li>
        <li>Vous recevez un numéro de suivi par email</li>
      </ol>
    </section>
  )
}

// Type discriminant pour usage interne
type GetOrderByTrackingTokenResult =
  | { success: true; order: any }
  | { success: false; error: string }

export default async function PaymentPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!token) return notFound()
  const rawResult = await getOrderByTrackingToken(token)
  console.log("DEBUG getOrderByTrackingToken:", JSON.stringify(rawResult, null, 2))

  // Affiche une erreur explicite si la commande n'est pas trouvée
  if (!rawResult || rawResult.success !== true || !("order" in rawResult)) {
    return (
      <main className="max-w-xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-900 rounded p-4 mb-6">
          <div className="font-semibold">Commande introuvable</div>
          <div className="text-sm">Le lien de paiement est invalide ou la commande n'existe pas.</div>
        </div>
        <a href="/" className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700">Retour à l'accueil</a>
      </main>
    )
  }
  const order = (rawResult as { success: true; order: any }).order

  return (
    <main className="max-w-xl mx-auto p-6">
      <div className="bg-green-50 border border-green-200 text-green-900 rounded p-4 mb-6">
        <div className="font-semibold">Commande enregistrée avec succès !</div>
        <div className="text-sm">Un email de confirmation a été envoyé.</div>
      </div>
      <PaymentDetailsClient order={order} />
      <NextSteps />
      <div className="flex gap-4 mt-4">
        <a href={`/track/${token}`} className="px-4 py-2 border rounded bg-white hover:bg-gray-50">Suivre ma commande</a>
        <a href="/" className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700">Retour à l'accueil</a>
      </div>
    </main>
  )
}
