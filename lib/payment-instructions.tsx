export function getPaymentInstructions(paymentMethod: string, orderNumber: string): string {
  const iban = process.env.IBAN || "FR76 XXXX XXXX XXXX XXXX XXXX XXX"
  const bic = process.env.BIC || "XXXXXXXX"
  const beneficiaryName = process.env.BENEFICIARY_NAME || "Nom du bénéficiaire"
  const paylibId = process.env.PAYLIB_ID || "@votre-paylib"
  const lydiaId = process.env.LYDIA_ID || "@votre-lydia"
  const revolutId = process.env.REVOLUT_ID || "@votre-revolut"
  const paypalLink = process.env.PAYPAL_ME_LINK || "https://paypal.me/votrecompte"

  switch (paymentMethod) {
    case "virement":
      return `
        <div style="background: #f0f9f4; padding: 20px; border-radius: 8px; border-left: 4px solid #2d5a3d;">
          <h3 style="margin-top: 0; color: #2d5a3d;">Virement bancaire (sans frais)</h3>
          <p><strong>IBAN :</strong> ${iban}</p>
          <p><strong>BIC :</strong> ${bic}</p>
          <p><strong>Bénéficiaire :</strong> ${beneficiaryName}</p>
          <p><strong>Référence à indiquer :</strong> ${orderNumber}</p>
          <p style="margin-bottom: 0; color: #666; font-size: 14px;">⚠️ N'oubliez pas d'indiquer le numéro de commande en référence du virement.</p>
        </div>
      `

    case "paylib":
      return `
        <div style="background: #f0f9f4; padding: 20px; border-radius: 8px; border-left: 4px solid #2d5a3d;">
          <h3 style="margin-top: 0; color: #2d5a3d;">Paylib (sans frais entre particuliers)</h3>
          <p><strong>Identifiant Paylib :</strong> ${paylibId}</p>
          <p><strong>Référence à indiquer :</strong> ${orderNumber}</p>
          <p style="margin-bottom: 0; color: #666; font-size: 14px;">Envoyez le paiement via votre application bancaire en mode "entre amis".</p>
        </div>
      `

    case "lydia":
      return `
        <div style="background: #f0f9f4; padding: 20px; border-radius: 8px; border-left: 4px solid #2d5a3d;">
          <h3 style="margin-top: 0; color: #2d5a3d;">Lydia (sans frais entre amis)</h3>
          <p><strong>Identifiant Lydia :</strong> ${lydiaId}</p>
          <p><strong>Référence à indiquer :</strong> ${orderNumber}</p>
          <p style="margin-bottom: 0; color: #666; font-size: 14px;">Envoyez le paiement via l'application Lydia en mode "entre amis".</p>
        </div>
      `

    case "revolut":
      return `
        <div style="background: #f0f9f4; padding: 20px; border-radius: 8px; border-left: 4px solid #2d5a3d;">
          <h3 style="margin-top: 0; color: #2d5a3d;">Revolut (sans frais entre particuliers)</h3>
          <p><strong>Identifiant Revolut :</strong> ${revolutId}</p>
          <p><strong>Référence à indiquer :</strong> ${orderNumber}</p>
          <p style="margin-bottom: 0; color: #666; font-size: 14px;">Envoyez le paiement via l'application Revolut.</p>
        </div>
      `

    case "paypal":
      return `
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
          <h3 style="margin-top: 0; color: #856404;">PayPal (frais possibles)</h3>
          <p><strong>Lien de paiement :</strong> <a href="${paypalLink}" style="color: #2d5a3d;">${paypalLink}</a></p>
          <p><strong>Référence à indiquer :</strong> ${orderNumber}</p>
          <p style="margin-bottom: 0; color: #856404; font-size: 14px;">⚠️ Attention : PayPal peut appliquer des frais sur la transaction.</p>
        </div>
      `

    default:
      return `
        <div style="background: #f0f9f4; padding: 20px; border-radius: 8px; border-left: 4px solid #2d5a3d;">
          <h3 style="margin-top: 0; color: #2d5a3d;">Autre mode de paiement</h3>
          <p>Merci de nous contacter pour convenir du mode de paiement.</p>
          <p><strong>Référence à indiquer :</strong> ${orderNumber}</p>
        </div>
      `
  }
}
