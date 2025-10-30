import { notFound } from "next/navigation"

function PaymentDetails({ order }: { order: any }) {
  // DEBUG temporaire : affiche la valeur réelle dans le rendu pour vérifier
  // Supprime cette ligne après vérification
  // return <pre>{JSON.stringify(order, null, 2)}</pre>

  const paymentMethod = (order.payment_method || "").toLowerCase().trim();

  switch (paymentMethod) {
    case "virement":
    case "bank_transfer":
      return (
        <section className="border rounded-lg p-4 mb-6 bg-white">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="inline-block">💶</span> Paiement par virement bancaire
          </h2>
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Numéro de commande</div>
            <div className="flex items-center">
              <div className="bg-purple-50 text-purple-700 px-3 py-2 rounded font-mono font-bold text-lg inline-block mb-2">{order.order_number}</div>
              <span className="ml-2 px-2 py-1 text-xs border rounded bg-gray-100 text-gray-400 cursor-not-allowed select-none">Copier</span>
            </div>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2">Détails du paiement</div>
            <div className="mb-1">
              <span className="block text-xs text-gray-500">IBAN</span>
              <span className="font-mono text-base">FR76 XXXX XXXX XXXX XXXX XXXX XXX</span>
            </div>
            <div className="mb-1">
              <span className="block text-xs text-gray-500">BIC</span>
              <span className="font-mono text-base">XXXXXXXX</span>
            </div>
            <div className="mb-1">
              <span className="block text-xs text-gray-500">Bénéficiaire</span>
              <span className="font-mono text-base">[Votre Nom]</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500">Référence</span>
              <span className="font-mono text-base">{order.order_number}</span>
            </div>
          </div>
          <div className="mb-4 flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
            <span>✉️</span>
            <span>N'oubliez pas d'indiquer le numéro de commande en référence du virement.</span>
          </div>
        </section>
      )
    case "paylib":
      return (
        <section className="border rounded-lg p-4 mb-6 bg-white">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="inline-block">📱</span> Paiement par Paylib
          </h2>
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Numéro de commande</div>
            <div className="bg-purple-50 text-purple-700 px-3 py-2 rounded font-mono font-bold text-lg inline-block mb-2">{order.order_number}</div>
            <span className="ml-2 px-2 py-1 text-xs border rounded bg-gray-100 text-gray-400 cursor-not-allowed select-none">Copier</span>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2">Détails du paiement</div>
            <div><span className="text-gray-500">Identifiant</span> <span className="ml-2 font-mono">+33 X XX XX XX XX</span></div>
            <div><span className="text-gray-500">Montant</span> <span className="ml-2 font-mono">{order.total_amount} €</span></div>
            <div><span className="text-gray-500">Référence</span> <span className="ml-2 font-mono">{order.order_number}</span></div>
          </div>
          <div className="mb-4 flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
            <span>✉️</span>
            <span>Envoyez le paiement via l'application Paylib en mode 'entre amis'.</span>
          </div>
        </section>
      )
    case "lydia":
    case "lidya":
      return (
        <section className="border rounded-lg p-4 mb-6 bg-white">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="inline-block">💸</span> Paiement par Lydia
          </h2>
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Numéro de commande</div>
            <div className="bg-purple-50 text-purple-700 px-3 py-2 rounded font-mono font-bold text-lg inline-block mb-2">{order.order_number}</div>
            <span className="ml-2 px-2 py-1 text-xs border rounded bg-gray-100 text-gray-400 cursor-not-allowed select-none">Copier</span>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2">Détails du paiement</div>
            <div><span className="text-gray-500">Identifiant</span> <span className="ml-2 font-mono">@votre-lydia</span></div>
            <div><span className="text-gray-500">Montant</span> <span className="ml-2 font-mono">{order.total_amount} €</span></div>
            <div><span className="text-gray-500">Référence</span> <span className="ml-2 font-mono">{order.order_number}</span></div>
          </div>
          <div className="mb-4 flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
            <span>✉️</span>
            <span>Envoyez le paiement via l'application Lydia en mode "entre amis".</span>
          </div>
        </section>
      )
    case "revolut":
      return (
        <section className="border rounded-lg p-4 mb-6 bg-white">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="inline-block">💳</span> Paiement par Revolut
          </h2>
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Numéro de commande</div>
            <div className="bg-purple-50 text-purple-700 px-3 py-2 rounded font-mono font-bold text-lg inline-block mb-2">{order.order_number}</div>
            <span className="ml-2 px-2 py-1 text-xs border rounded bg-gray-100 text-gray-400 cursor-not-allowed select-none">Copier</span>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2">Détails du paiement</div>
            <div><span className="text-gray-500">Identifiant</span> <span className="ml-2 font-mono">@votre-revolut</span></div>
            <div><span className="text-gray-500">Montant</span> <span className="ml-2 font-mono">{order.total_amount} €</span></div>
            <div><span className="text-gray-500">Référence</span> <span className="ml-2 font-mono">{order.order_number}</span></div>
          </div>
          <div className="mb-4 flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
            <span>✉️</span>
            <span>Envoyez le paiement via l'application Revolut en mode "entre amis".</span>
          </div>
        </section>
      )
    case "paypal":
      return (
        <section className="border rounded-lg p-4 mb-6 bg-white">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="inline-block">🅿️</span> Paiement par PayPal
          </h2>
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Numéro de commande</div>
            <div className="bg-purple-50 text-purple-700 px-3 py-2 rounded font-mono font-bold text-lg inline-block mb-2">{order.order_number}</div>
            <span className="ml-2 px-2 py-1 text-xs border rounded bg-gray-100 text-gray-400 cursor-not-allowed select-none">Copier</span>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2">Détails du paiement</div>
            <div><span className="text-gray-500">Identifiant PayPal</span> <span className="ml-2 font-mono">votre@email.com</span></div>
            <div><span className="text-gray-500">Montant</span> <span className="ml-2 font-mono">{order.total_amount} €</span></div>
            <div><span className="text-gray-500">Référence</span> <span className="ml-2 font-mono">{order.order_number}</span></div>
          </div>
          <div className="mb-4 flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
            <span>✉️</span>
            <span>Envoyez le paiement à l'identifiant PayPal ci-dessus en précisant la référence.</span>
          </div>
        </section>
      )
    // Ajoutez d'autres méthodes ici (revolut, etc.)
    default:
      return null
  }
}

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

export default async function PaymentPage({ searchParams }: { searchParams: Promise<{ order?: string, email?: string }> }) {
  const params = await searchParams
  const orderNumber = params.order || ""
  const email = params.email || ""

  if (!orderNumber || !email) return notFound()
  const { getOrderByNumberAndEmail } = await import("@/lib/db")
  const order = await getOrderByNumberAndEmail(orderNumber, email)
  if (!order) return notFound()

  // Ne pas utiliser getPaymentInstructions pour l'affichage principal, laissez PaymentDetails gérer l'affichage selon le mode
  // const { getPaymentInstructions } = await import("@/lib/payment-instructions")
  // const _paymentInstructions = getPaymentInstructions(order.payment_method, order.order_number)

  return (
    <main className="max-w-xl mx-auto p-6">
      <div className="bg-green-50 border border-green-200 text-green-900 rounded p-4 mb-6">
        <div className="font-semibold">Commande enregistrée avec succès !</div>
        <div className="text-sm">Un email de confirmation a été envoyé à <span className="font-mono">{email}</span></div>
      </div>
      <PaymentDetails order={order} />
      <NextSteps />
      <div className="flex gap-4 mt-4">
        <a href={`/track?order=${order.order_number}&email=${encodeURIComponent(email)}`} className="px-4 py-2 border rounded bg-white hover:bg-gray-50">Suivre ma commande</a>
        <a href="/" className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700">Retour à l'accueil</a>
      </div>
    </main>
  )
}
