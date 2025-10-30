"use client";

import CopyButton from "@/components/CopyButton";

export default function PaymentDetailsClient({ order }: { order: any }) {
  const paymentMethod = (order.payment_method || "").toLowerCase().trim();

  switch (paymentMethod) {
    case "virement":
    case "bank_transfer":
      return (
        <section className="border rounded-lg p-4 mb-6 bg-white">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            Paiement par virement bancaire
          </h2>
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Numéro de commande</div>
            <div className="flex items-center">
              <div className="bg-purple-50 text-purple-700 px-3 py-2 rounded font-mono font-bold text-lg inline-block mb-2">
                {order.order_number}
              </div>
              <CopyButton value={order.order_number} />
            </div>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2">Informations pour procéder au paiement</div>
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
            <span>N'oubliez pas d'indiquer le numéro de commande en référence du virement.</span>
          </div>
        </section>
      );
    case "paylib":
      return (
        <section className="border rounded-lg p-4 mb-6 bg-white">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            Paiement par Paylib
          </h2>
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Numéro de commande</div>
            <div className="flex items-center">
              <div className="bg-purple-50 text-purple-700 px-3 py-2 rounded font-mono font-bold text-lg inline-block mb-2">
                {order.order_number}
              </div>
              <CopyButton value={order.order_number} />
            </div>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2">Informations pour procéder au paiement</div>
            <div>
              <span className="text-gray-500">Identifiant</span>{" "}
              <span className="ml-2 font-mono">+33 X XX XX XX XX</span>
            </div>
            <div>
              <span className="text-gray-500">Montant</span>{" "}
              <span className="ml-2 font-mono">{order.total_amount} €</span>
            </div>
            <div>
              <span className="text-gray-500">Référence</span>{" "}
              <span className="ml-2 font-mono">{order.order_number}</span>
            </div>
          </div>
          <div className="mb-4 flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
            <span>Envoyez le paiement via l'application Paylib en mode 'entre amis'.</span>
          </div>
        </section>
      );
    case "lydia":
    case "lidya":
      return (
        <section className="border rounded-lg p-4 mb-6 bg-white">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            Paiement par Lydia
          </h2>
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Numéro de commande</div>
            <div className="flex items-center">
              <div className="bg-purple-50 text-purple-700 px-3 py-2 rounded font-mono font-bold text-lg inline-block mb-2">
                {order.order_number}
              </div>
              <CopyButton value={order.order_number} />
            </div>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2">Informations pour procéder au paiement</div>
            <div>
              <span className="text-gray-500">Identifiant</span>{" "}
              <span className="ml-2 font-mono">@votre-lydia</span>
            </div>
            <div>
              <span className="text-gray-500">Montant</span>{" "}
              <span className="ml-2 font-mono">{order.total_amount} €</span>
            </div>
            <div>
              <span className="text-gray-500">Référence</span>{" "}
              <span className="ml-2 font-mono">{order.order_number}</span>
            </div>
          </div>
          <div className="mb-4 flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
            <span>Envoyez le paiement via l'application Lydia en mode "entre amis".</span>
          </div>
        </section>
      );
    case "revolut":
      return (
        <section className="border rounded-lg p-4 mb-6 bg-white">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            Paiement par Revolut
          </h2>
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Numéro de commande</div>
            <div className="flex items-center">
              <div className="bg-purple-50 text-purple-700 px-3 py-2 rounded font-mono font-bold text-lg inline-block mb-2">
                {order.order_number}
              </div>
              <CopyButton value={order.order_number} />
            </div>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2">Informations pour procéder au paiement</div>
            <div>
              <span className="text-gray-500">Identifiant</span>{" "}
              <span className="ml-2 font-mono">@votre-revolut</span>
            </div>
            <div>
              <span className="text-gray-500">Montant</span>{" "}
              <span className="ml-2 font-mono">{order.total_amount} €</span>
            </div>
            <div>
              <span className="text-gray-500">Référence</span>{" "}
              <span className="ml-2 font-mono">{order.order_number}</span>
            </div>
          </div>
          <div className="mb-4 flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
            <span>Envoyez le paiement via l'application Revolut en mode "entre amis".</span>
          </div>
        </section>
      );
    case "paypal":
      return (
        <section className="border rounded-lg p-4 mb-6 bg-white">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            Paiement par PayPal
          </h2>
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Numéro de commande</div>
            <div className="flex items-center">
              <div className="bg-purple-50 text-purple-700 px-3 py-2 rounded font-mono font-bold text-lg inline-block mb-2">
                {order.order_number}
              </div>
              <CopyButton value={order.order_number} />
            </div>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2">Informations pour procéder au paiement</div>
            <div>
              <span className="text-gray-500">Identifiant PayPal</span>{" "}
              <span className="ml-2 font-mono">votre@email.com</span>
            </div>
            <div>
              <span className="text-gray-500">Montant</span>{" "}
              <span className="ml-2 font-mono">{order.total_amount} €</span>
            </div>
            <div>
              <span className="text-gray-500">Référence</span>{" "}
              <span className="ml-2 font-mono">{order.order_number}</span>
            </div>
          </div>
          <div className="mb-4 flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
            <span>Envoyez le paiement à l'identifiant PayPal ci-dessus en précisant la référence.</span>
          </div>
        </section>
      );
    default:
      return null;
  }
}