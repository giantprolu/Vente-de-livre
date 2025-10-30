
// --- Correction Next.js :
// Ce fichier est maintenant un composant server qui exporte metadata et importe le composant client.

export const metadata = {
  title: "Commander le livre - Blissody",
  description: "Commandez votre exemplaire du livre témoignage en édition limitée.",
};

import OrderPageClient from "./OrderPageClient";

export default function OrderPage() {
  return <OrderPageClient />;
}
