export interface EmailData {
  to: string
  subject: string
  html: string
}

export async function sendEmail(data: EmailData): Promise<boolean> {
  // Correction : utiliser l'URL absolue côté serveur
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` ||
    "http://localhost:3000"

  try {
    const response = await fetch(`${baseUrl}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    return response.ok
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}

export function generateOrderConfirmationEmail(order: any, paymentInstructions: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .order-number { font-size: 24px; font-weight: bold; color: #2d5a3d; margin: 20px 0; }
          .section { margin: 20px 0; padding: 20px; background: white; border-radius: 8px; }
          .label { font-weight: bold; color: #666; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Confirmation de commande</h1>
        </div>
        <div class="content">
          <p>Bonjour ${order.firstName ?? order.first_name ?? ""} ${order.lastName ?? order.last_name ?? ""},</p>
          <p>Merci pour votre commande ! Voici les détails :</p>
          
          <div class="order-number">
            Numéro de commande : ${order.orderNumber ?? order.order_number ?? ""}
          </div>
          
          <div class="section">
            <h2>Détails de la commande</h2>
            <p><span class="label">Quantité :</span> ${order.quantity ?? order.book_quantity ?? ""} livre(s)</p>
            <p><span class="label">Adresse de livraison :</span><br>
              ${
                (() => {
                  const addressLines = [
                    order.shipping_address,
                    order.shipping_postal_code,
                    order.shipping_city,
                    order.shipping_country
                  ]
                  .map(v => (v === null || v === undefined ? "" : String(v).trim()))
                  .filter(line =>
                    line.length > 0 &&
                    line.toLowerCase() !== "null" &&
                    line.toLowerCase() !== "undefined"
                  );
                  return addressLines.length > 0
                    ? addressLines.map(line => `${line}<br>`).join("")
                    : "<em>Non renseignée</em><br>";
                })()
              }
            </p>
            ${(order.message ?? order.dedication_message) ? `<p><span class="label">Message/Dédicace :</span> ${order.message ?? order.dedication_message}</p>` : ""}
          </div>
          
          <div class="section">
            <h2>Instructions de paiement</h2>
            ${paymentInstructions}
          </div>
          
          <div class="section">
            <h2>Suivi de commande</h2>
            <p>
              Vous pouvez suivre l'état de votre commande à tout moment en cliquant sur ce lien sécurisé :<br>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/${order.tracking_token}">
                Suivre ma commande
              </a>
            </p>
            <p>Ou en enregistrant ce lien. Gardez-le précieusement, il donne accès à votre suivi.</p>
          </div>
          
          <div class="footer">
            <p>Vente réalisée par un particulier — Traitement après réception du paiement</p>
            <p>Pour toute question, répondez simplement à cet email.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
